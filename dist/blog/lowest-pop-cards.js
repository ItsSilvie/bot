"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const set_metadata_1 = require("../collection-tracker/set-metadata");
const rarity_1 = require("../utils/rarity");
const BLOG_REPO_LOCAL_PATH = '../blog.silvie.org';
const blogCustomTemplatesPath = `${BLOG_REPO_LOCAL_PATH}/_includes/custom-templates`;
const OUTPUT_LIST_SIZE = 100;
const EXCLUDE_POPULATION_ABOVE = 150;
const allCards = async () => {
    try {
        const sets = await Promise.resolve().then(() => require(path.resolve(__dirname, `../api-data/sets.json`)));
        let cards = [];
        const setPrefixes = Object.values(sets).map(entry => entry.prefix);
        for (let i = 0; i < setPrefixes.length; i++) {
            const setPrefix = setPrefixes[i];
            const setCards = await Promise.resolve().then(() => require(path.resolve(__dirname, `../api-data/${setPrefix}.json`)));
            cards = [
                ...cards,
                ...setCards.filter(({ uuid }) => !cards.find(entry => entry.uuid === uuid)),
            ];
        }
        return cards;
    }
    catch (e) {
        console.error(e);
    }
};
const generateLowestPopCardsTemplate = async () => {
    if (!fs.existsSync(blogCustomTemplatesPath)) {
        fs.mkdirSync(blogCustomTemplatesPath);
    }
    const cards = await allCards();
    const cardsWithUniqueCirculations = cards.reduce((cardsArr, card) => {
        return [
            ...cardsArr,
            ...card.editions.reduce((editionsArr, edition) => {
                return [
                    ...editionsArr,
                    ...([...edition.circulations, ...edition.circulationTemplates].reduce((circulationsArr, circulation) => {
                        if (circulation.population > EXCLUDE_POPULATION_ABOVE) {
                            return circulationsArr;
                        }
                        return [
                            ...circulationsArr,
                            {
                                card,
                                edition,
                                circulation,
                            }
                        ];
                    }, []))
                ];
            }, [])
        ];
    }, []);
    const sortedUniqueCards = [...cardsWithUniqueCirculations].sort((a, b) => {
        if (a.circulation.population !== b.circulation.population) {
            // The populations are different.
            return a.circulation.population > b.circulation.population ? 1 : -1;
        }
        if (a.circulation.printing !== b.circulation.printing) {
            // One card is still in print whilst the other is finalised.
            return a.circulation.printing ? 1 : -1;
        }
        if (a.edition.set.prefix === b.edition.set.prefix) {
            // They're in the same set, sort by collector number;
            return a.edition.collector_number > b.edition.collector_number ? 1 : -1;
        }
        const aSetInfo = (0, set_metadata_1.getSetInfo)(a.edition.set.prefix);
        const bSetInfo = (0, set_metadata_1.getSetInfo)(b.edition.set.prefix);
        if (aSetInfo.year !== bSetInfo.year) {
            // The years are different, show the earlier year first.
            return aSetInfo.year > bSetInfo.year ? 1 : -1;
        }
        if (aSetInfo.type !== bSetInfo.type) {
            // The types are different, sort by type alphabetically.
            return aSetInfo.type > bSetInfo.type ? 1 : -1;
        }
        // If all else fails, sort by set name alphabetically.
        return a.edition.set.name > b.edition.set.name ? 1 : -1;
    }).filter((card, index, all) => (index < OUTPUT_LIST_SIZE || card.circulation.population === all[OUTPUT_LIST_SIZE - 1].circulation.population));
    const templateData = [];
    for (let i = 0; i < sortedUniqueCards.length; i++) {
        const { card, edition, circulation, } = sortedUniqueCards[i];
        const rank = sortedUniqueCards.findIndex(entry => entry.circulation.population === circulation.population) + 1;
        const setTemplateCardObj = {
            anchor: '',
            cost: typeof card.cost_memory === 'number' ? card.cost_memory : card.cost_reserve,
            costType: typeof card.cost_memory === 'number' ? 'memory' : 'reserve',
            element: card.element,
            lastUpdated: card.last_update ?? new Date(0).toISOString(),
            name: card.name,
            number: '',
            rarity: '',
            population: '',
            printing: circulation.printing,
            cardSlug: card.slug,
            editionSlug: edition.slug,
            rank,
            set: edition.set,
        };
        // #ksp--en-008-pr
        setTemplateCardObj.anchor = `${edition.set.prefix}--${edition.set.language}-${edition.collector_number}-${(0, rarity_1.getRarityCodeFromRarityId)(edition.rarity)}`.toLowerCase();
        setTemplateCardObj.number = `${edition.set.language}-${edition.collector_number}`;
        setTemplateCardObj.rarity = (0, rarity_1.getRarityCodeFromRarityId)(edition.rarity);
        setTemplateCardObj.population = `${circulation.foil ? `Foil` : `Normal`} ${circulation.population_operator}${circulation.population.toLocaleString()}`;
        templateData.push(setTemplateCardObj);
    }
    const setTemplateEntries = [];
    for (let j = 0; j < templateData.length; j++) {
        const setTemplateDataEntry = templateData[j];
        const setTemplateEntry = `<tr${setTemplateDataEntry.printing ? ' class="in-print"' : ''}>
  <td style="text-align: center">
    ${setTemplateDataEntry.rank !== j + 1 ? '-' : setTemplateDataEntry.rank}
  </td>
  <td class="set-list-card-number" style="text-align: left">
    ${setTemplateDataEntry.set.prefix}
    <br />
    ${setTemplateDataEntry.number}
  </td>
  <td style="text-align: left">
    <div class="set-list-card-name">
      <span class="card-cost card-cost-${setTemplateDataEntry.costType}">
        ${setTemplateDataEntry.cost === -1 ? 'X' : setTemplateDataEntry.cost}
      </span>
      <img class="image-element" src="https://img.silvie.org/misc/elements/${setTemplateDataEntry.element.toLowerCase()}.png" alt="${setTemplateDataEntry.element} element" />
      <abbr class="card-rarity-label card-rarity-label-${setTemplateDataEntry.rarity}" title="${rarity_1.Rarity[setTemplateDataEntry.rarity]}">${setTemplateDataEntry.rarity}</abbr>
      <span class="name-wrapper">
        <a href="https://index.gatcg.com/edition/${setTemplateDataEntry.editionSlug.replace(/ /g, '_')}" rel="noopener noreferrer" target="_blank">
          ${setTemplateDataEntry.name}
        </a>
        <span class="name-wrapper-set-name">
          <a href="/${setTemplateDataEntry.set.prefix.replace(/ /g, '-')}_(set)">
            ${setTemplateDataEntry.set.name}
          </a>
        </span>
      </span>
    </div>
  </td>
  <td class="set-list-card-population" style="text-align: right">
    ${setTemplateDataEntry.population}
  </td>
</tr>`;
        setTemplateEntries.push(setTemplateEntry);
    }
    fs.writeFileSync(`${blogCustomTemplatesPath}/lowest-pop.html`, `<table class="set-list set-list-custom">
  <thead>
    <tr>
      <th style="text-align: center">#</th>
      <th style="text-align: left">Number</th>
      <th style="text-align: left">Name</th>
      <th style="text-align: right">Population</th>
    </tr>
  </thead>
  <tbody>
    ${setTemplateEntries.join('\n')}
  </tbody>
</table>`, 'utf8');
};
generateLowestPopCardsTemplate();
