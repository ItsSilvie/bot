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

export default allCards();

interface CountWithPopulation {
  count: number;
  population: number;
}

interface CardsByIllustrator {
  cards: number;
  countFoil: CountWithPopulation;
  countNonFoil: CountWithPopulation;
  editions: number;
  illustrator: string;
  rarities: {
    [key: number]: CountWithPopulation & {
      editions: number;
      populationFoil: number;
    };
  }
}

const generateNamedCardsTemplate = async () => {
  if (!fs.existsSync(blogCustomTemplatesPath)) {
    fs.mkdirSync(blogCustomTemplatesPath);
  }

  const cards = await allCards();
  const cardsByIllustrator = cards.reduce((cardsArr, card) => {
    return card.editions.reduce((editionsArr, edition, index) => {
      const illustrator = edition.illustrator?.trim() ?? 'Unknown';
      const isFirstOfCardFromIllustrator = card.editions.findIndex(entry => entry.illustrator.toLowerCase() === illustrator.toLowerCase()) === index;
      const isFirstOfCardRarityFromIllustrator = card.editions.findIndex(entry => entry.illustrator.toLowerCase() === illustrator.toLowerCase() && entry.rarity === edition.rarity) === index;

      const illustratorMatchIndex = editionsArr.findIndex(entry => entry.illustrator.toLowerCase() === illustrator.toLowerCase());
      const circulations = [...edition.circulationTemplates, ...edition.circulations];
      const variantCount = circulations.length;
      const variantPopulation = circulations.reduce((n, entry) => n + entry.population, 0);
      const foils = circulations.filter(entry => entry.foil);
      const foilCount = foils.length;
      const foilPopulation = foils.reduce((n, entry) => n + entry.population, 0);
      const nonFoilCount = variantCount - foilCount;
      const nonFoilPopulation = variantPopulation - foilPopulation;
  
      if (illustratorMatchIndex === -1) {
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
            illustrator,
            rarities: {
              [edition.rarity]: {
                count: 1,
                editions: 1,
                population: variantPopulation,
                populationFoil: foilPopulation,
              },
            },
          }
        ];
      }
  
      const illustratorCardMatch = editionsArr[illustratorMatchIndex]
  
      return [
        ...editionsArr.slice(0, illustratorMatchIndex),
        {
          ...illustratorCardMatch,
          cards: illustratorCardMatch.cards + (isFirstOfCardFromIllustrator ? 1 : 0),
          countFoil: {
            count: illustratorCardMatch.countFoil.count + foilCount,
            population: illustratorCardMatch.countFoil.population + foilPopulation,
          },
          countNonFoil: {
            count: illustratorCardMatch.countNonFoil.count + nonFoilCount,
            population: illustratorCardMatch.countNonFoil.population + nonFoilPopulation,
          },
          editions: illustratorCardMatch.editions + 1,
          rarities: {
            ...illustratorCardMatch.rarities,
            [edition.rarity]: {
              count: (illustratorCardMatch.rarities[edition.rarity]?.count ?? 0) + (isFirstOfCardRarityFromIllustrator ? 1 : 0),
              editions: (illustratorCardMatch.rarities[edition.rarity]?.editions ?? 0) + 1,
              population: (illustratorCardMatch.rarities[edition.rarity]?.population ?? 0) + variantPopulation,
              populationFoil: (illustratorCardMatch.rarities[edition.rarity]?.populationFoil ?? 0) + foilPopulation,
            },
          },
        },
        ...editionsArr.slice(illustratorMatchIndex + 1),
      ]
    }, cardsArr);
  }, [] as CardsByIllustrator[])

  const sortedIllustrators = [...cardsByIllustrator].sort((a, b) => {
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

    return a.illustrator.toLowerCase() < b.illustrator.toLowerCase() ? -1 : 1
  });

  const templateData = [];

  for (let i = 0; i < sortedIllustrators.length; i++) {
    const {
      cards,
      editions,
      illustrator,
      countFoil,
      countNonFoil,
    } = sortedIllustrators[i];

    const variantsCount = countFoil.count + countNonFoil.count;

    templateData.push(`<tr>
  <td><a href="https://index.gatcg.com/cards?illustrator=${illustrator}">${illustrator}</a></td>
  <td>
    ${cards.toLocaleString()} card${cards === 1 ? '' : 's'}
    <div class="set-list-custom-by-illustrator-subrow">${editions.toLocaleString()} edition${editions === 1 ? '' : 's'}</div>
  </td>
  <td>
    ${variantsCount.toLocaleString()}
    <div class="set-list-custom-by-illustrator-subrow">${countFoil.count.toLocaleString()} foil</div>
  </td>
</tr>`)
  }

  fs.writeFileSync(`${blogCustomTemplatesPath}/cards-by-illustrator.html`, `<table class="set-list set-list-custom set-list-custom-by-illustrator">
  <thead>
    <tr>
      <th style="text-align: left">Illustrator</th>
      <th style="text-align: left">Cards</th>
      <th style="text-align: left">Variants</th>
    </tr>
  </thead>
  <tbody>
    ${templateData.join('\n')}
  </tbody>
</table>`, 'utf8');

  const sortedIllustratorsByPopulation = [...cardsByIllustrator].sort((a, b) => {
    const aPopulation = a.countFoil.population + a.countNonFoil.population;
    const bPopulation = b.countFoil.population + b.countNonFoil.population;

    if (aPopulation !== bPopulation) {
      return aPopulation < bPopulation ? 1 : -1;
    }

    return a.illustrator.toLowerCase() < b.illustrator.toLowerCase() ? -1 : 1
  });

  const templateDataPopulation = [];

  for (let i = 0; i < sortedIllustratorsByPopulation.length; i++) {
    const {
      illustrator,
      countFoil,
      countNonFoil,
    } = sortedIllustratorsByPopulation[i];

    const variantsPopulation = countFoil.population + countNonFoil.population;

  templateDataPopulation.push(`<tr>
  <td><a href="https://index.gatcg.com/cards?illustrator=${illustrator}">${illustrator}</a></td>
  <td style="text-align: right">
    ${variantsPopulation.toLocaleString()}
    <div class="set-list-custom-by-illustrator-subrow">${countFoil.population.toLocaleString()} foil</div>
  </td>
</tr>`)
}

fs.writeFileSync(`${blogCustomTemplatesPath}/cards-by-illustrator-population.html`, `<table class="set-list set-list-custom set-list-custom-by-illustrator">
<thead>
  <tr>
    <th style="text-align: left">Illustrator</th>
    <th style="text-align: left">Population</th>
  </tr>
</thead>
<tbody>
  ${templateDataPopulation.join('\n')}
</tbody>
</table>`, 'utf8');

  for (let i = 0; i < Object.values(Rarity).length; i++) {
    const rarityId = i + 1;
    const rarityCode = getRarityCodeFromRarityId(i + 1);

    const sortedIllustratorsByRarity = [...cardsByIllustrator]
      .filter(entry => !!entry.rarities[rarityId])
      .sort((a, b) => {
        const aRarity = a.rarities[rarityId].count;
        const bRarity = b.rarities[rarityId].count;

        if (aRarity !== bRarity) {
          return aRarity < bRarity ? 1 : -1;
        }

        const aPopulation = a.rarities[rarityId].population;
        const bPopulation = b.rarities[rarityId].population;

        if (aPopulation !== bPopulation) {
          return aPopulation < bPopulation ? 1 : -1;
        }

        return a.illustrator.toLowerCase() < b.illustrator.toLowerCase() ? -1 : 1
      });

    const templateDataRarity = [];

    for (let i = 0; i < sortedIllustratorsByRarity.length; i++) {
      const {
        illustrator,
        rarities,
      } = sortedIllustratorsByRarity[i];

      const rarity = rarities[rarityId];

      templateDataRarity.push(`<tr>
  <td><a href="https://index.gatcg.com/cards?illustrator=${illustrator}&rarity=${rarityId}">${illustrator}</a></td>
  <td style="text-align: right">
    ${rarity.count.toLocaleString()} card${rarity.count === 1 ? '' : 's'}
    <div class="set-list-custom-by-illustrator-subrow">${rarity.editions.toLocaleString()} edition${rarity.editions === 1 ? '' : 's'}</div>
  </td>
  <td style="text-align: right">
    ${rarity.population.toLocaleString()}
    <div class="set-list-custom-by-illustrator-subrow">${rarity.populationFoil.toLocaleString()} foil</div>
  </td>
</tr>`)
  }

    fs.writeFileSync(`${blogCustomTemplatesPath}/cards-by-illustrator-rarity-${rarityCode}.html`, `<table class="set-list set-list-custom set-list-custom-by-illustrator">
  <thead>
    <tr>
      <th style="text-align: left">Illustrator</th>
      <th style="text-align: left">Cards</th>
      <th style="text-align: left">Population</th>
    </tr>
  </thead>
  <tbody>
    ${templateDataRarity.join('\n')}
  </tbody>
</table>`, 'utf8');
  }
  
  const sortedIllustratorsPRCPR = [...cardsByIllustrator]
    .map(entry => {
      const defaultRarityObj = {
        count: 0,
        editions: 0,
        population: 0,
        populationFoil: 0,
      }
      const rarityPR = entry.rarities[6] ?? defaultRarityObj;
      const rarityCPR = entry.rarities[9] ?? defaultRarityObj;

      return {
        ...entry,
        matchingRarityCount: rarityPR.count + rarityCPR.count,
        matchingRarityEditions: rarityPR.editions + rarityCPR.editions,
        matchingRarityPopulation: rarityPR.population + rarityCPR.population,
        matchingRarityPopulationFoil: rarityPR.populationFoil + rarityCPR.populationFoil,
      }
    })
    .filter(entry => !!entry.matchingRarityCount)
    .sort((a, b) => {
      if (a.matchingRarityCount !== b.matchingRarityCount) {
        return a.matchingRarityCount < b.matchingRarityCount ? 1 : -1;
      }

      if (a.matchingRarityPopulation !== b.matchingRarityPopulation) {
        return a.matchingRarityPopulation < b.matchingRarityPopulation ? 1 : -1;
      }

      return a.illustrator.toLowerCase() < b.illustrator.toLowerCase() ? -1 : 1
    });

  const templateDataPRCPR = [];

  for (let i = 0; i < sortedIllustratorsPRCPR.length; i++) {
    const {
      illustrator,
      matchingRarityCount,
      matchingRarityEditions,
      matchingRarityPopulation,
      matchingRarityPopulationFoil,
    } = sortedIllustratorsPRCPR[i];

    templateDataPRCPR.push(`<tr>
  <td><a href="https://index.gatcg.com/cards?illustrator=${illustrator}&rarity=6&rarity=9">${illustrator}</a></td>
  <td style="text-align: right">
    ${matchingRarityCount.toLocaleString()} card${matchingRarityCount === 1 ? '' : 's'}
    <div class="set-list-custom-by-illustrator-subrow">${matchingRarityEditions.toLocaleString()} edition${matchingRarityEditions === 1 ? '' : 's'}</div>
  </td>
  <td style="text-align: right">
    ${matchingRarityPopulation.toLocaleString()}
    <div class="set-list-custom-by-illustrator-subrow">${matchingRarityPopulationFoil.toLocaleString()} foil</div>
  </td>
</tr>`)
  }

  fs.writeFileSync(`${blogCustomTemplatesPath}/cards-by-illustrator-rarity-PR-CPR.html`, `<table class="set-list set-list-custom set-list-custom-by-illustrator">
  <thead>
    <tr>
      <th style="text-align: left">Illustrator</th>
      <th style="text-align: left">Cards</th>
      <th style="text-align: left">Population</th>
    </tr>
  </thead>
  <tbody>
    ${templateDataPRCPR.join('\n')}
  </tbody>
</table>`, 'utf8');

  const sortedIllustratorsCR = [...cardsByIllustrator]
    .map(entry => {
      const defaultRarityObj = {
        count: 0,
        editions: 0,
        population: 0,
        populationFoil: 0,
      }
      const rarityCSR = entry.rarities[7] ?? defaultRarityObj;
      const rarityCUR = entry.rarities[8] ?? defaultRarityObj;
      const rarityCPR = entry.rarities[9] ?? defaultRarityObj;

      return {
        ...entry,
        matchingRarityCount: rarityCSR.count + rarityCUR.count + rarityCPR.count,
        matchingRarityEditions: rarityCSR.editions + rarityCUR.count + rarityCPR.editions,
        matchingRarityPopulation: rarityCSR.population + rarityCUR.count + rarityCPR.population,
        matchingRarityPopulationFoil: rarityCSR.populationFoil + rarityCUR.count + rarityCPR.populationFoil,
      }
    })
    .filter(entry => !!entry.matchingRarityCount)
    .sort((a, b) => {
      if (a.matchingRarityCount !== b.matchingRarityCount) {
        return a.matchingRarityCount < b.matchingRarityCount ? 1 : -1;
      }

      if (a.matchingRarityPopulation !== b.matchingRarityPopulation) {
        return a.matchingRarityPopulation < b.matchingRarityPopulation ? 1 : -1;
      }

      return a.illustrator.toLowerCase() < b.illustrator.toLowerCase() ? -1 : 1
    });

  const templateDataCR = [];

  for (let i = 0; i < sortedIllustratorsCR.length; i++) {
    const {
      illustrator,
      matchingRarityCount,
      matchingRarityEditions,
      matchingRarityPopulation,
      matchingRarityPopulationFoil,
    } = sortedIllustratorsCR[i];

    templateDataCR.push(`<tr>
  <td><a href="https://index.gatcg.com/cards?illustrator=${illustrator}&rarity=7&rarity=8&rarity=9">${illustrator}</a></td>
  <td style="text-align: right">
    ${matchingRarityCount.toLocaleString()} card${matchingRarityCount === 1 ? '' : 's'}
    <div class="set-list-custom-by-illustrator-subrow">${matchingRarityEditions.toLocaleString()} edition${matchingRarityEditions === 1 ? '' : 's'}</div>
  </td>
  <td style="text-align: right">
    ${matchingRarityPopulation.toLocaleString()}
    <div class="set-list-custom-by-illustrator-subrow">${matchingRarityPopulationFoil.toLocaleString()} foil</div>
  </td>
</tr>`)
  }

  fs.writeFileSync(`${blogCustomTemplatesPath}/cards-by-illustrator-rarity-CR.html`, `<table class="set-list set-list-custom set-list-custom-by-illustrator">
  <thead>
    <tr>
      <th style="text-align: left">Illustrator</th>
      <th style="text-align: left">Cards</th>
      <th style="text-align: left">Population</th>
    </tr>
  </thead>
  <tbody>
    ${templateDataCR.join('\n')}
  </tbody>
</table>`, 'utf8');
}

generateNamedCardsTemplate();