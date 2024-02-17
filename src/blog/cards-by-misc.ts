import * as fs from 'fs';
import * as path from 'path';
import { getSetInfo } from '../collection-tracker/set-metadata';
import { IndexCard, IndexCirculation, IndexEdition, IndexSet } from '../data/types';
import { getRarityCodeFromRarityId, Rarity } from '../utils/rarity';

const BLOG_REPO_LOCAL_PATH = '../blog.silvie.org';
const blogCustomTemplatesPath = `${BLOG_REPO_LOCAL_PATH}/_includes/custom-templates`

const allCards = async () => {
  try {
    const sets: IndexSet[] = await import(path.resolve(__dirname, `../api-data/sets.json`));
    let cards: IndexCard[] = [];
    const setPrefixes = Object.values(sets).map(entry => entry.prefix);

    for (let i = 0; i < setPrefixes.length; i++) {
      const setPrefix = setPrefixes[i];

      const setCards: IndexCard[] = await import(path.resolve(__dirname, `../api-data/${setPrefix}.json`));

      cards = [
        ...cards,
        ...setCards.filter(({ uuid }) => !cards.find(entry => entry.uuid === uuid)),
      ];
    }

    return cards;
  } catch (e) {
    console.error(e);
  }
}

interface CountWithPopulation {
  count: number;
  population: number;
}

interface CardsByMisc {
  cards: number;
  countFoil: CountWithPopulation;
  countNonFoil: CountWithPopulation;
  editions: number;
  thing: string | number;
}

const generateCardsByMiscTemplate = async () => {
  if (!fs.existsSync(blogCustomTemplatesPath)) {
    fs.mkdirSync(blogCustomTemplatesPath);
  }

  const cards = await allCards();

  const generateThingRender = (arr: CardsByMisc[], thingKey: string, thingTitle: string, formatThing: (thing: CardsByMisc["thing"]) => string, config: {
    limit?: number;
  } = {}) => {
    const sortedThings = [...arr].sort((a, b) => {
      if (a.cards !== b.cards) {
        return a.cards < b.cards ? 1 : -1;
      }
  
      if (a.editions !== b.editions) {
        return a.editions < b.editions ? 1 : -1;
      }
  
      const aVariants = a.countFoil.count + a.countNonFoil.count;
      const bVariants = b.countFoil.count + b.countNonFoil.count;
  
      if (aVariants !== bVariants) {
        return aVariants < bVariants ? 1 : -1;
      }

      if (typeof a.thing !== 'string' || typeof b.thing !== 'string') {
        return Number(a.thing) < Number(b.thing) ? -1 : 1;
      }
  
      return a.thing.toLowerCase() < b.thing.toLowerCase() ? -1 : 1
    });
  
    const templateDataElements = [];
  
    for (let i = 0; i < sortedThings.length; i++) {
      if (i === config.limit ?? 9999999) {
        break;
      }

      const {
        cards,
        editions,
        countFoil,
        countNonFoil,
        thing,
      } = sortedThings[i];
  
      const variantsCount = countFoil.count + countNonFoil.count;
  
      templateDataElements.push(`<tr>
  <td>
    ${formatThing(thing)}
  </td>
  <td style="text-align: right">
    ${cards.toLocaleString()} card${cards === 1 ? '' : 's'}
    <div class="set-list-custom-by-illustrator-subrow">${editions.toLocaleString()} edition${editions === 1 ? '' : 's'}</div>
  </td>
  <td style="text-align: right">
    ${variantsCount.toLocaleString()}
    <div class="set-list-custom-by-illustrator-subrow">${countFoil.count.toLocaleString()} foil</div>
  </td>
</tr>`)
    }
  
    fs.writeFileSync(`${blogCustomTemplatesPath}/cards-by-${thingKey}.html`, `<table class="set-list set-list-custom set-list-custom-by-illustrator">
  <thead>
    <tr>
      <th style="text-align: left">${thingTitle}</th>
      <th style="text-align: left">Cards</th>
      <th style="text-align: left">Variants</th>
    </tr>
  </thead>
  <tbody>
    ${templateDataElements.join('\n')}
  </tbody>
</table>`, 'utf8');
  }

  const generateCardByThing = (thingKey: string, thingTitle: string, formatThing: (thing: CardsByMisc["thing"]) => string, config: {
    filterFn?: (thing: CardsByMisc["thing"]) => boolean;
    isCardKey?: boolean;
    limit?: number;
    reducerFn?: <T extends IndexCard | IndexEdition>(arr: T[], thing: T) => T[];
  } = {}) => {
    let reducedCards = cards;

    if (config.isCardKey && config.reducerFn) {
      reducedCards = cards.reduce((cardsArr, card) => {
        if (typeof config.reducerFn !== 'function') {
          return [...cardsArr, card];
        }

        return config.reducerFn(cardsArr, card);
      }, [])
    }

    const cardsByThing = reducedCards.reduce((cardsArr, card) => {
      let reducedEditions = card.editions;

      if (!config.isCardKey && config.reducerFn) {
        reducedEditions = card.editions.reduce((editionsArr, edition) => {
          if (typeof config.reducerFn !== 'function') {
            return [...editionsArr, edition];
          }
  
          return config.reducerFn(editionsArr, edition);
        }, []);
      }

      return reducedEditions.reduce((editionsArr, edition, index) => {
        const thing = config.isCardKey ? card[thingKey] : edition[thingKey];

        if (typeof config.filterFn === 'function' && !config.filterFn(thing)) {
          return editionsArr;
        }

        const isFirstOfCardFromThing = config.isCardKey ? undefined : card.editions.findIndex(entry => entry[thingKey] === thing) === index;
        const thingMatchIndex = editionsArr.findIndex(entry => entry.thing === thing);
        const circulations = [...edition.circulationTemplates, ...edition.circulations];
        const variantCount = circulations.length;
        const variantPopulation = circulations.reduce((n, entry) => n + entry.population, 0);
        const foils = circulations.filter(entry => entry.foil);
        const foilCount = foils.length;
        const foilPopulation = foils.reduce((n, entry) => n + entry.population, 0);
        const nonFoilCount = variantCount - foilCount;
        const nonFoilPopulation = variantPopulation - foilPopulation;
    
        if (thingMatchIndex === -1) {
          return [
            ...editionsArr,
            {
              cards: 1,
              countFoil: {
                count: foilCount,
                population: foilPopulation,
              },
              countNonFoil: {
                count: nonFoilCount,
                population: nonFoilPopulation,
              },
              editions: 1,
              thing,
            }
          ];
        }
    
        const thingMatch = editionsArr[thingMatchIndex]
    
        return [
          ...editionsArr.slice(0, thingMatchIndex),
          {
            ...thingMatch,
            cards: thingMatch.cards + (isFirstOfCardFromThing || (isFirstOfCardFromThing === undefined && index === 0) ? 1 : 0),
            countFoil: {
              count: thingMatch.countFoil.count + foilCount,
              population: thingMatch.countFoil.population + foilPopulation,
            },
            countNonFoil: {
              count: thingMatch.countNonFoil.count + nonFoilCount,
              population: thingMatch.countNonFoil.population + nonFoilPopulation,
            },
            editions: thingMatch.editions + 1,
          },
          ...editionsArr.slice(thingMatchIndex + 1),
        ]
      }, cardsArr);
    }, [] as CardsByMisc[])

    generateThingRender(cardsByThing, thingKey, thingTitle, formatThing, config);
  }

  const generateCardByThingArray = (thingKey: string, thingTitle: string, formatThing: (thing: CardsByMisc["thing"]) => string, config: {
    filterFn?: (thing: CardsByMisc["thing"]) => boolean;
    isCardKey?: boolean;
    limit?: number;
    reducerFn?: <T extends IndexCard | IndexEdition>(arr: T[], thing: T) => T[];
  } = {}) => {
    let reducedCards = cards;

    if (config.isCardKey && config.reducerFn) {
      reducedCards = cards.reduce((cardsArr, card) => {
        if (typeof config.reducerFn !== 'function') {
          return [...cardsArr, card];
        }

        return config.reducerFn(cardsArr, card);
      }, [])
    }

    const cardsByThing = reducedCards.reduce((cardsArr, card) => {
      let reducedEditions = card.editions;

      if (!config.isCardKey && config.reducerFn) {
        reducedEditions = card.editions.reduce((editionsArr, edition) => {
          if (typeof config.reducerFn !== 'function') {
            return [...editionsArr, edition];
          }
  
          return config.reducerFn(editionsArr, edition);
        }, []);
      }

      return reducedEditions.reduce((editionsArr, edition, index) => {
        const thing = config.isCardKey ? card[thingKey] : edition[thingKey] as string[] | number[];

        return thing.reduce((thingArr, thing) => {
          if (typeof config.filterFn === 'function' && !config.filterFn(thing)) {
            return editionsArr;
          }

          const isFirstOfCardFromThing = config.isCardKey ? undefined : card.editions.findIndex(entry => entry[thingKey].includes(thing)) === index;
          const thingMatchIndex = thingArr.findIndex(entry => entry.thing === thing);
          const circulations = [...edition.circulationTemplates, ...edition.circulations];
          const variantCount = circulations.length;
          const variantPopulation = circulations.reduce((n, entry) => n + entry.population, 0);
          const foils = circulations.filter(entry => entry.foil);
          const foilCount = foils.length;
          const foilPopulation = foils.reduce((n, entry) => n + entry.population, 0);
          const nonFoilCount = variantCount - foilCount;
          const nonFoilPopulation = variantPopulation - foilPopulation;
      
          if (thingMatchIndex === -1) {
            return [
              ...thingArr,
              {
                cards: 1,
                countFoil: {
                  count: foilCount,
                  population: foilPopulation,
                },
                countNonFoil: {
                  count: nonFoilCount,
                  population: nonFoilPopulation,
                },
                editions: 1,
                thing,
              }
            ];
          }
      
          const thingMatch = thingArr[thingMatchIndex]
      
          return [
            ...thingArr.slice(0, thingMatchIndex),
            {
              ...thingMatch,
              cards: thingMatch.cards + (isFirstOfCardFromThing || (isFirstOfCardFromThing === undefined && index === 0) ? 1 : 0),
              countFoil: {
                count: thingMatch.countFoil.count + foilCount,
                population: thingMatch.countFoil.population + foilPopulation,
              },
              countNonFoil: {
                count: thingMatch.countNonFoil.count + nonFoilCount,
                population: thingMatch.countNonFoil.population + nonFoilPopulation,
              },
              editions: thingMatch.editions + 1,
            },
            ...thingArr.slice(thingMatchIndex + 1),
          ]
        }, editionsArr)
      }, cardsArr);
    }, [] as CardsByMisc[])

    generateThingRender(cardsByThing, thingKey, thingTitle, formatThing, config);
  }

  generateCardByThing('element', 'Element', (element) => (
    `<div style="align-items: center; display: flex; column-gap: 8px;">
  <img src="https://img.silvie.org/misc/elements/${(element as string).toLowerCase()}.png" width="24px" />
  <a href="https://index.gatcg.com/cards?element=${element}">
    ${element}
  </a>
</div>`
  ), {
    isCardKey: true,
  });

  generateCardByThing('rarity', 'Rarity', (rarity) => (
    `<a href="https://index.gatcg.com/cards?rarity=${rarity}">
  ${Rarity[getRarityCodeFromRarityId(rarity)]} (${getRarityCodeFromRarityId(rarity)})
</a>`
  ), {
    isCardKey: false,
  });

  generateCardByThingArray('types', 'Type', (type) => (
    `<div style="align-items: center; display: flex; column-gap: 8px;">
    <img src="https://img.silvie.org/misc/types/${(type as string).toLowerCase()}.png" width="24px" />
  <a href="https://index.gatcg.com/cards?type=${type}">
    ${type}
  </a>
</div>`
  ), {
    filterFn: (type) => type !== 'UNIQUE' && type !== 'REGALIA' && type !== 'TOKEN',
    isCardKey: true,
  });

  generateCardByThingArray('classes', 'Class', (classEntry) => (
    `<a href="https://index.gatcg.com/cards?class=${classEntry}">
  ${classEntry}
</a>`
  ), {
    isCardKey: true,
  });

  generateCardByThing('name', 'Card name', (name) => (
    `<a href="https://index.gatcg.com/cards?name=${name}">
  ${name}
</a>`
  ), {
    isCardKey: true,
    limit: 10,
  });

  generateCardByThing('customName', 'Name', (name) => (
    `<a href="https://index.gatcg.com/cards?name=${name}">
  ${name}
</a>`
  ), {
    reducerFn: <IndexCard>(arr, card) => {
      if (!/, /.test((card.name as string))) {
        return arr;
      }

      return [
        ...arr,
        {
          ...card,
          customName: card.name.replace(/, .*$/, ''),
        },
      ]
    },
    isCardKey: true,
    limit: 10,
  });
}

generateCardsByMiscTemplate();