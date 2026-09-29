import * as fs from 'fs';
import * as path from 'path';
import { getRarityCodeFromRarityId, Rarity } from '../utils/rarity';
import { obtainMethods } from './card-obtain-methods';
import customSets from './custom-sets-card-edition-uuids';
import { getSetInfo } from '../collection-tracker/set-metadata';

const BLOG_REPO_LOCAL_PATH = '../blog.silvie.org';

const blogTemplatesPath = `${BLOG_REPO_LOCAL_PATH}/_includes/templates`
const blogSetsPath = `${BLOG_REPO_LOCAL_PATH}/sets`;

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

const slugifySetName = (name: string) => name
  .replace(/re:collection/gi, 'recollection')
  .replace(/&/g, 'and')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/['’]/g, '')
  .replace(/[^a-zA-Z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .toLowerCase();

const getSetYear = (set) => {
  const releaseDate = new Date(set.release_date);
  if (releaseDate.getFullYear() >= 2000) {
    return releaseDate.getFullYear();
  }

  return new Date(set.created_at).getFullYear();
};

const getDateOrdinal = (day: number) => {
  const suffix = day % 10 === 1 && day % 100 !== 11 ? 'st' : day % 10 === 2 && day % 100 !== 12 ? 'nd' : day % 10 === 3 && day % 100 !== 13 ? 'rd' : 'th';
  return `${day}${suffix}`;
};

const getOldestEditionTimestamp = (set, cardData) => {
  const editionTimestamps = cardData
    .flatMap(card => card.editions ?? [])
    .filter(edition => edition.set?.prefix === set.prefix)
    .map(edition => new Date(edition.created_at).getTime())
    .filter(timestamp => Number.isFinite(timestamp));

  return editionTimestamps.length ? Math.min(...editionTimestamps) : undefined;
};

const formatReleaseDate = (set, cardData = readSetCardData(set)) => {
  const timestamp = hasPublishedReleaseDate(set)
    ? new Date(set.release_date).getTime()
    : getOldestEditionTimestamp(set, cardData);

  if (!Number.isFinite(timestamp)) {
    return 'Release date currently unavailable';
  }

  const date = new Date(timestamp);

  return `${date.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' })} ${getDateOrdinal(date.getUTCDate())} ${date.getUTCFullYear()}`;
};

const getSetPagePath = (set) => {
  const year = getSetYear(set);
  if (/^Promotional \d{4}$/i.test(set.name)) {
    return `${year}-promotional.markdown`;
  }

  return `${year}-${slugifySetName(set.name)}.markdown`;
};

const getExistingSetPagePath = (set) => {
  const year = getSetYear(set);
  const canonicalPath = `${blogSetsPath}/${getSetPagePath(set)}`;
  const slug = slugifySetName(set.name);
  const legacySlug = slug.replace(new RegExp(`-${year}$`), '');
  const legacyPath = `${blogSetsPath}/${year}-${legacySlug}.markdown`;

  if (fs.existsSync(legacyPath)) {
    return legacyPath;
  }

  if (fs.existsSync(canonicalPath)) {
    return canonicalPath;
  }

  return undefined;
};

const formatRelatedSets = (set, allSets) => {
  const related = allSets.filter(other => other.prefix !== set.prefix && other.release_date === set.release_date);
  if (!related.length) {
    return '';
  }

  const links = related.map(other => `[${other.name}](/${other.prefix.replace(/ /g, '-')}_(set))`);
  const linkedSets = links.length === 1 ? links[0] : `${links.slice(0, -1).join(', ')} and ${links[links.length - 1]}`;
  return ` alongside ${linkedSets}`;
};

const hasPublishedReleaseDate = (set) => {
  const date = new Date(set.release_date);
  return Number.isFinite(date.getTime()) && date.getUTCFullYear() >= 2000;
};

const readSetCardData = (set) => {
  const cardPath = `./src/api-data/${set.prefix}.json`;
  if (!fs.existsSync(cardPath)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(cardPath, 'utf8'));
};

const getSetSortTimestamp = (set, cardData) => {
  if (hasPublishedReleaseDate(set)) {
    return new Date(set.release_date).getTime();
  }

  const oldestEditionTimestamp = getOldestEditionTimestamp(set, cardData);
  if (oldestEditionTimestamp !== undefined) {
    return oldestEditionTimestamp;
  }

  const setTimestamp = new Date(set.created_at).getTime();
  return Number.isFinite(setTimestamp) ? setTimestamp : 0;
};

const getSetElements = (set, cardData) => {
  const elements = new Set<string>();

  for (const card of cardData) {
    const belongsToSet = (card.editions ?? []).some(edition => edition.set?.prefix === set.prefix);
    if (!belongsToSet) continue;

    const cardElements = Array.isArray(card.elements) && card.elements.length
      ? card.elements
      : (card.element ? [card.element] : []);

    cardElements.forEach(element => elements.add(String(element).toUpperCase()));
  }

  return [...elements].sort((a, b) => {
    const basicOrder = ['NORM', 'FIRE', 'WATER', 'WIND'];
    const aIndex = basicOrder.indexOf(a);
    const bIndex = basicOrder.indexOf(b);

    if (aIndex !== -1 || bIndex !== -1) {
      return (aIndex === -1 ? basicOrder.length : aIndex) - (bIndex === -1 ? basicOrder.length : bIndex);
    }

    return a.localeCompare(b);
  });
};

const getElementImageHTML = (set, elements) => elements.map(element => {
  const filename = `${element.toLowerCase()}.png`;
  const imagePath = path.resolve(`../img.silvie.org/docs/misc/elements/${filename}`);
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Missing element image for ${element} in set ${set.prefix}: ${imagePath}`);
  }

  return `<img class="image-element" src="https://img.silvie.org/misc/elements/${filename}" alt="${element} element" />`;
}).join('');

const getSetSection = (set) => {
  if (/pantheon/i.test(set.name)) {
    return 'Pantheon';
  }

  try {
    const types = getSetInfo(set.prefix).type.map(type => String(type));
    if (types.includes('pantheon')) return 'Pantheon';
    if (types.includes('deck')) return 'Decks';
    if (types.includes('promo')) return 'Promo sets';
    if (types.includes('special')) return 'Special sets';
  } catch {
    const name = set.name.toLowerCase();
    if (name.includes('deck')) return 'Decks';
    if (name.includes('promo')) return 'Promo sets';
    if (name.includes('supporter') || name.includes('special')) return 'Special sets';
  }

  return 'Main sets';
};

const getSetIndexRow = (set, cardData) => {
  const elements = getSetSection(set) === 'Decks'
    ? getElementImageHTML(set, getSetElements(set, cardData))
    : '';
  const name = elements ? `${elements}<br>${set.name}` : set.name;
  return `${set.prefix} | [${name}](/${set.prefix.replace(/ /g, '-')}_(set)) | ${formatReleaseDate(set, cardData)}`;
};

const getIndexRowPrefix = (row) => row.match(/^([^|\n]+)\s*\|/)?.[1].trim();

const addElementsToDeckIndexRow = (row, set, cardData) => {
  const elements = getElementImageHTML(set, getSetElements(set, cardData));
  if (row.includes('image-element')) {
    return row;
  }

  return elements ? row.replace('| [', `| [${elements}<br>`) : row;
};

const generateSetPagesAndIndex = (allSets) => {
  fs.mkdirSync(blogSetsPath, { recursive: true });

  for (const set of allSets) {
    const existingPagePath = getExistingSetPagePath(set);
    if (existingPagePath) {
      continue;
    }

    const pagePath = `${blogSetsPath}/${getSetPagePath(set)}`;

    const frontmatterDate = new Date(hasPublishedReleaseDate(set) ? set.release_date : getSetSortTimestamp(set, readSetCardData(set)));
    const frontmatterDateString = `${frontmatterDate.toISOString().slice(0, 10)} 00:00:00 +0000`;
    const releaseSentence = `${set.name} released on ${formatReleaseDate(set, readSetCardData(set))}${formatRelatedSets(set, allSets)}.`;

    fs.writeFileSync(pagePath, `---
layout: set
title: "${set.name.replace(/"/g, '\\"')} (${set.prefix})"
date: ${frontmatterDateString}
categories: sets
permalink: ${set.prefix.replace(/ /g, '-')}_(set)
# image: /assets/images/sets/${set.prefix}/box.png
---
<!-- {% include image.html url="/assets/images/sets/${set.prefix}/box.png" description="${set.name.replace(/"/g, '\\"')} product image." max-width="600px" %} -->

${releaseSentence}

## Set list

Cards in this set are prefixed \`${set.prefix}\`.

{% include templates/${set.prefix.replace(/ /g, '-')}.html %}
`, 'utf8');
    console.log(`Generated blog set page ${pagePath}`);
  }

  const indexPath = `${blogSetsPath}/0000-all-sets.markdown`;
  if (!fs.existsSync(indexPath)) return;
  let index = fs.readFileSync(indexPath, 'utf8');

  if (!index.includes('## Pantheon')) {
    index = index.replace(
      /\r?\n## Special sets/,
      `\n\n## Pantheon\n\nPrefix | Name | Release\n:-- | :-- | :--\n\n## Special sets`,
    );
  }

  const cardDataByPrefix = new Map<string, any[]>(allSets.map(set => [set.prefix, readSetCardData(set)]));
  const setByPrefix = new Map<string, any>(allSets.map(set => [set.prefix, set]));
  const sectionPattern = /(## (Main sets|Pantheon|Special sets|Promo sets|Decks)\r?\n\r?\nPrefix \| Name \| Release\r?\n:-- \| :-- \| :--\r?\n)([\s\S]*?)(?=\r?\n## |\r?\n\*|$)/g;

  index = index.replace(sectionPattern, (match, header, section, body) => {
    const existingRows = body.split(/\r?\n/).filter(row => row.includes('|') && getIndexRowPrefix(row));
    const sectionSets = allSets.filter(set => getSetSection(set) === section);
    const generatedRows = sectionSets.map(set => getSetIndexRow(set, cardDataByPrefix.get(set.prefix)));
    let rows;

    if (section === 'Decks') {
      const existingPrefixes = new Set(existingRows.map(getIndexRowPrefix));
      rows = [
        ...existingRows.map(row => {
          const set = setByPrefix.get(getIndexRowPrefix(row));
          return set ? addElementsToDeckIndexRow(row, set, cardDataByPrefix.get(set.prefix)) : row;
        }),
        ...generatedRows.filter(row => !existingPrefixes.has(getIndexRowPrefix(row))),
      ];
    } else {
      const knownPrefixes = new Set(sectionSets.map(set => set.prefix));
      const unknownRows = existingRows.filter(row => !knownPrefixes.has(getIndexRowPrefix(row)) && !setByPrefix.has(getIndexRowPrefix(row)));
      rows = [...unknownRows, ...generatedRows];
    }

    rows.sort((a, b) => {
      const aSet = setByPrefix.get(getIndexRowPrefix(a));
      const bSet = setByPrefix.get(getIndexRowPrefix(b));
      const aTime = aSet ? getSetSortTimestamp(aSet, cardDataByPrefix.get(aSet.prefix)) : 0;
      const bTime = bSet ? getSetSortTimestamp(bSet, cardDataByPrefix.get(bSet.prefix)) : 0;
      return bTime - aTime || a.localeCompare(b);
    });

    return `${header}${rows.join('\n')}\n`;
  });

  fs.writeFileSync(indexPath, index, 'utf8');
};

const generateBlogTemplates = async () => {
  fs.readdirSync(blogTemplatesPath).forEach(file => fs.rmSync(`${blogTemplatesPath}/${file}`));

  const allSets = Object.keys(JSON.parse(fs.readFileSync('./src/api-data/sets.json', 'utf8')));
  const allSetData = Object.values(JSON.parse(fs.readFileSync('./src/api-data/sets.json', 'utf8')));

  if (!fs.existsSync(blogTemplatesPath)) {
    fs.mkdirSync(blogTemplatesPath);
  }

  generateSetPagesAndIndex(allSetData);

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
          elements: cardMatch.elements,
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
