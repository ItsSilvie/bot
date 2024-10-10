import * as fs from 'fs';
import { getRarityCodeFromRarityId, Rarity } from '../utils/rarity';
import { obtainMethods } from './card-obtain-methods';
import customSets from './custom-sets-card-edition-uuids';

const BLOG_REPO_LOCAL_PATH = '../blog.silvie.org';

const blogTemplatesPath = `${BLOG_REPO_LOCAL_PATH}/_includes/templates`

const themaTypes = [
  'charm',
  'ferocity',
  'grace',
  'mystique',
  'valor',
]

const getThemaScoreHTMLFromThema = (thema, label: string) => {
  const typeBreakdown = themaTypes.filter(type => !!thema[type]).map(type => `<span class="thema-score thema-score-${type}" title="${type.toLocaleUpperCase()}">${thema[type].toLocaleString()}</span>`);
  return `<span class="thema-score-breakdown">${label} ${thema.total.toLocaleString()} ${typeBreakdown.join(' ')}</span>`;
}

const getThemaScoreHTMLFromTemplate = (templateData) => {
  const nonFoilTotal = templateData.thema.nonfoil.total;
  const foilTotal = templateData.thema.foil.total;

  if (!nonFoilTotal && !foilTotal) {
    return '';
  }

  let nonFoil; 
  let foil;

  if (nonFoilTotal) {
    nonFoil = getThemaScoreHTMLFromThema(templateData.thema.nonfoil, 'Normal');
  }

  if (foilTotal) {
    foil = getThemaScoreHTMLFromThema(templateData.thema.foil, 'Foil');
  }

  return `<div class="set-list-thema-score" title="Thema score">
  ${nonFoil && foil ? `${nonFoil}${foil}` : (nonFoil || foil)}
</div>`;
}

const generateBlogTemplates = async () => {
  fs.readdirSync(blogTemplatesPath).forEach(file => fs.rmSync(`${blogTemplatesPath}/${file}`));

  const allSets = Object.keys(JSON.parse(fs.readFileSync('./src/api-data/sets.json', 'utf8')));

  if (!fs.existsSync(blogTemplatesPath)) {
    fs.mkdirSync(blogTemplatesPath);
  }

  for (let i = 0; i < allSets.length; i++) {
    const setCode = allSets[i];

    console.log(`Parsing set ${setCode}`);
    const cardData = JSON.parse(fs.readFileSync(`./src/api-data/${setCode}.json`, 'utf8'));
    const setTemplateData = [];

    for (let j = 0; j < cardData.length; j++) {
      console.log(`    ...card ${j + 1}/${cardData.length}...`);
      const card = cardData[j];
      const filteredCardEditions = card.editions.filter(entry => entry.set.prefix === setCode);

      for (let k = 0; k < filteredCardEditions.length; k++) {
          console.log(`      ...edition ${k + 1}/${filteredCardEditions.length}...`);
          const cardEdition = filteredCardEditions[k];
          const cardEditionSet = cardEdition.set;

          const setTemplateCardObj = {
            anchor: '',
            cost: typeof card.cost_memory === 'number' ? card.cost_memory : card.cost_reserve,
            costType: typeof card.cost_memory === 'number' ? 'memory' : 'reserve',
            element: card.element,
            lastUpdated: card.last_update ?? new Date().toISOString(),
            name: card.name,
            number: '',
            rarity: '',
            population: '',
            cardSlug: card.slug,
            editionSlug: cardEdition.slug,
            thema: {
              foil: {
                total: cardEdition.thema_foil,
                ...themaTypes.reduce((obj, type) => ({
                  ...obj,
                  [type]: cardEdition[`thema_${type}_foil`],
                }), {}),
              },
              nonfoil: {
                total: cardEdition.thema_nonfoil,
                ...themaTypes.reduce((obj, type) => ({
                  ...obj,
                  [type]: cardEdition[`thema_${type}_nonfoil`],
                }), {}),
              },
            },
            set: cardEdition.set,
          };

          // #ksp--en-008-pr
          setTemplateCardObj.anchor = `${cardEditionSet.prefix}--${cardEditionSet.language}-${cardEdition.collector_number}-${getRarityCodeFromRarityId(cardEdition.rarity)}`.toLowerCase();
          
          setTemplateCardObj.number = `${cardEditionSet.language}-${cardEdition.collector_number}`;
          setTemplateCardObj.rarity = getRarityCodeFromRarityId(cardEdition.rarity);
          setTemplateCardObj.population = [...cardEdition.circulationTemplates, ...cardEdition.circulations].sort((a, b) => a.foil ? 1 : -1).map(circulationTemplate => (
            `${circulationTemplate.foil ? `Foil` : `Normal`} ${circulationTemplate.population_operator}${circulationTemplate.population.toLocaleString()}`
          )).join('<br/>')

          setTemplateData.push(setTemplateCardObj);
      }
    }

    const setTemplateEntries = [];

    for (let j = 0; j < setTemplateData.length; j++) {
      const setTemplateDataEntry = setTemplateData[j];
      const obtainMethod = obtainMethods[setTemplateDataEntry.anchor];
      const hasObtainMethods = Array.isArray(obtainMethod) && !!obtainMethod.length;

      const setTemplateEntry =
`<tr data-id="${setTemplateDataEntry.anchor}">
  <td class="set-list-card-number" style="text-align: left">
    ${setTemplateDataEntry.number}
  </td>
  <td style="text-align: left">
    <div class="set-list-card-name">
      <span class="card-cost card-cost-${setTemplateDataEntry.costType}">
        ${setTemplateDataEntry.cost === -1 ? 'X' : setTemplateDataEntry.cost}
      </span>
      <img class="image-element" src="https://img.silvie.org/misc/elements/${setTemplateDataEntry.element.toLowerCase()}.png" alt="${setTemplateDataEntry.element} element" />
      <abbr class="card-rarity-label card-rarity-label-${setTemplateDataEntry.rarity}" title="${Rarity[setTemplateDataEntry.rarity]}">${setTemplateDataEntry.rarity}</abbr>
      <span class="name-wrapper">
        <a href="https://index.gatcg.com/edition/${setTemplateDataEntry.editionSlug.replace(/ /g, '_')}" rel="noopener noreferrer" target="_blank">
          ${setTemplateDataEntry.name}
        </a>
      </span>
    </div>
    ${getThemaScoreHTMLFromTemplate(setTemplateDataEntry)}
  </td>
  <td class="set-list-card-population" style="text-align: right">
    ${setTemplateDataEntry.population}
  </td>
</tr>${hasObtainMethods ? (
  `<tr class="set-list-card-obtain-method-row">
  <td colspan="3">
    <div class="set-list-card-obtain-method-row-content">
      <div class="set-list-card-obtain-method-row-content-image" role="presentation" style="background-image: url('https://img.silvie.org/cdn/cards/${setTemplateDataEntry.set.prefix}/${setTemplateDataEntry.rarity}/${setTemplateDataEntry.number}.jpg')"></div>
      <div class="set-list-card-obtain-method-row-content-text">${obtainMethod.join('\n')}</div>
    </div>
  </td>
</tr>`
) : ''}`;

      setTemplateEntries.push(setTemplateEntry);
    }

    fs.writeFileSync(`${blogTemplatesPath}/${setCode.replace(/ /g, '-')}.html`, `<table class="set-list">
<thead>
  <tr>
    <th style="text-align: left">Number</th>
    <th style="text-align: left">Name</th>
    <th style="text-align: right">Population</th>
  </tr>
</thead>
<tbody>
  ${setTemplateEntries.join('\n')}
</tbody>
</table>`, 'utf8');


    // ----
    // Generate custom set templates.
    // ----
    const matchingCustomSets = customSets.filter(entry => entry.setCode === setCode);
    for (let j = 0; j < matchingCustomSets.length; j++) {
      const customSet = matchingCustomSets[j];
      const customSetTemplateData = [];

      for (let k = 0; k < customSet.cards.length; k++) {
        const customSetCard = customSet.cards[k] as {
          id: string;
          quantity?: number;
          token?: boolean;
        };
        const cardMatch = cardData.find(entry => entry.editions.find(resultEdition => resultEdition.uuid === customSetCard.id));

        if (!cardMatch) {
          throw new Error(`No matching card found for custom set ${customSet.filename} card ${customSetCard.id}. Is this not a result edition UUID?`);
        }

        const cardEditionMatch = cardMatch.editions.find(entry => entry.uuid === customSetCard.id);
        const cardEditionMatchSet = cardEditionMatch.set;

        const customSetTemplateCardObj = {
          anchor: '',
          cost: typeof cardMatch.cost_memory === 'number' ? cardMatch.cost_memory : cardMatch.cost_reserve,
          costType: typeof cardMatch.cost_memory === 'number' ? 'memory' : 'reserve',
          element: cardMatch.element,
          name: cardMatch.name,
          number: '',
          rarity: '',
          population: '',
          slug: cardMatch.slug,
          quantity: customSet.isDeck ? customSetCard.quantity : undefined,
          type: customSetCard.token ? 'TOKEN' : cardMatch.types.filter(entry => entry !== 'UNIQUE')[0],
          editionSlug: cardEditionMatch.slug,
        };

        // #ksp--en-008-pr
        customSetTemplateCardObj.anchor = `${cardEditionMatchSet.prefix}--${cardEditionMatchSet.language}-${cardEditionMatch.collector_number}-${getRarityCodeFromRarityId(cardEditionMatch.rarity)}`.toLowerCase();
        customSetTemplateCardObj.number = `${cardEditionMatchSet.language}-${cardEditionMatch.collector_number}`;
        customSetTemplateCardObj.rarity = getRarityCodeFromRarityId(cardEditionMatch.rarity);
        customSetTemplateCardObj.population = [...cardEditionMatch.circulationTemplates, ...cardEditionMatch.circulations].sort((a, b) => a.foil ? 1 : -1).map(circulationTemplate => (
          `${circulationTemplate.foil ? `Foil` : `Normal`} ${circulationTemplate.population_operator}${circulationTemplate.population.toLocaleString()}`
        )).join('<br/>')

        customSetTemplateData.push(customSetTemplateCardObj);
      }

      const customSetTemplateEntries = [];
      let prevType = '';

      let sortedCustomSetTemplateData = customSetTemplateData;
      
      const typeOrder = [
        'CHAMPION',
        'REGALIA',
        'ALLY',
        'ACTION',
        'ATTACK',
        'ITEM',
        'PHANTASIA',
        'DOMAIN',
        'TOKEN',
      ]

      if (customSet.isDeck) {
        sortedCustomSetTemplateData = [...customSetTemplateData].sort((a, b) => {
          const aIndex = typeOrder.findIndex(entry => entry === a.type);
          const bIndex = typeOrder.findIndex(entry => entry === b.type);

          if (aIndex === -1) {
            throw new Error(`Unhandled deck sort type: ${a.type}`)
          }

          if (bIndex === -1) {
            throw new Error(`Unhandled deck sort type: ${b.type}`)
          }

          return aIndex - bIndex;
        })
      }

      for (let k = 0; k < sortedCustomSetTemplateData.length; k++) {
        const customSetTemplateDataEntry = sortedCustomSetTemplateData[k];

        if (customSet.isDeck && prevType !== customSetTemplateDataEntry.type) {
          prevType = customSetTemplateDataEntry.type;
          customSetTemplateEntries.push(`<tr>
  <th colspan="3">${customSetTemplateDataEntry.type}</th>
</tr>`)
        }
  
        const setTemplateEntry =
  `<tr>
    <td style="text-align: left">
      ${customSetTemplateDataEntry.number}
    </td>
    <td style="text-align: left">
      <div class="set-list-card-name">
        <span class="card-cost card-cost-${customSetTemplateDataEntry.costType}">
          ${customSetTemplateDataEntry.cost === -1 ? 'X' : customSetTemplateDataEntry.cost}
        </span>
        <img class="image-element" src="https://img.silvie.org/misc/elements/${customSetTemplateDataEntry.element.toLowerCase()}.png" alt="${customSetTemplateDataEntry.element} element" />
        <abbr class="card-rarity-label card-rarity-label-${customSetTemplateDataEntry.rarity}" title="${Rarity[customSetTemplateDataEntry.rarity]}">${customSetTemplateDataEntry.rarity}</abbr>
        <span class="name-wrapper">
          <a href="https://index.gatcg.com/edition/${customSetTemplateDataEntry.editionSlug.replace(/ /g, '_')}" rel="noopener noreferrer" target="_blank">
            ${customSetTemplateDataEntry.name}
          </a> ${customSetTemplateDataEntry.quantity ? ` x${customSetTemplateDataEntry.quantity}` : ''}
        </span>
      </div>
    </td>
  </tr>`;
  
        customSetTemplateEntries.push(setTemplateEntry);
      }

      fs.writeFileSync(`${blogTemplatesPath}/${setCode.replace(/ /g, '-')}-${customSet.filename}.html`, `<table class="condensed-table set-list">
      <thead>
        <tr>
          <th style="text-align: left">Number</th>
          <th style="text-align: left">Name</th>
        </tr>
      </thead>
      <tbody>
        ${customSetTemplateEntries.join('\n')}
      </tbody>
      </table>`, 'utf8');
    }
  }
}

generateBlogTemplates();