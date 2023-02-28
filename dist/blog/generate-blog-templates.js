"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const rarity_1 = require("../utils/rarity");
const custom_sets_card_edition_uuids_1 = require("./custom-sets-card-edition-uuids");
const BLOG_REPO_LOCAL_PATH = '../blog.silvie.org';
const blogTemplatesPath = `${BLOG_REPO_LOCAL_PATH}/_includes/templates`;
const blogCardPagesPath = `${BLOG_REPO_LOCAL_PATH}/cards`;
const generateBlogTemplates = async () => {
    fs.readdirSync(blogTemplatesPath).forEach(file => fs.rmSync(`${blogTemplatesPath}/${file}`));
    fs.readdirSync(blogCardPagesPath).forEach(file => fs.rmSync(`${blogCardPagesPath}/${file}`));
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
                    set: cardEdition.set,
                };
                // #ksp--en-008-pr
                setTemplateCardObj.anchor = `${cardEditionSet.prefix}--${cardEditionSet.language}-${cardEdition.collector_number}-${(0, rarity_1.getRarityCodeFromRarityId)(cardEdition.rarity)}`.toLowerCase();
                setTemplateCardObj.number = `${cardEditionSet.language}-${cardEdition.collector_number}`;
                setTemplateCardObj.rarity = (0, rarity_1.getRarityCodeFromRarityId)(cardEdition.rarity);
                setTemplateCardObj.population = [...cardEdition.circulationTemplates, ...cardEdition.circulations].sort((a, b) => a.foil ? 1 : -1).map(circulationTemplate => (`${circulationTemplate.foil ? `Foil` : `Normal`} ${circulationTemplate.population_operator}${circulationTemplate.population.toLocaleString()}`)).join('<br/>');
                setTemplateData.push(setTemplateCardObj);
                const cardTemplate = `<div class="card-template">
  <figure class="image">
    <img
      src="https://img.silvie.org/api-data/${cardEdition.uuid}.jpg"
      alt="${card.name} &ndash; ${cardEditionSet.prefix} &middot; ${cardEditionSet.language}-${cardEdition.collector_number}"
      style="max-width: 440px;"
    >
    <figcaption>${card.name} &ndash; ${cardEditionSet.prefix} &middot; ${cardEditionSet.language}-${cardEdition.collector_number}</figcaption>
  </figure>
  <div class="card-template-info">
    <div class="card-template-stats">
      <div class="card-template-stat">
        <span class="card-template-stat-heading">Set</span>
        <span class="card-template-stat-values">
          <a href="/${cardEditionSet.prefix.replace(/ /g, '-')}_(set)">${cardEditionSet.name}</a>
        </span>
      </div>
      ${cardEdition.effect || card.effect ? (`   <div class="card-template-stat">
      <span class="card-template-stat-heading">Effect</span>
      <span class="card-template-stat-values">
        <span class="card-template-stat-values-effect">
          ${cardEdition.effect || card.effect}
        </span>
      </span>
    </div>`) : ''}
      ${card.rule ? `    <div class="card-template-stat">
        <span class="card-template-stat-heading">Rules</span>
        <span class="card-template-stat-values">${card.rule.map(rule => `<span class="card-template-stat-values-rule">${rule.date_added} &ndash; ${rule.description}</span>`).join('')}</span>
      </div>` : ''}
      <div class="card-template-stat">
        <span class="card-template-stat-heading">Rarity</span>
        <span class="card-template-stat-values">
          <span class="card-rarity-label card-rarity-label-${setTemplateCardObj.rarity}">${rarity_1.Rarity[setTemplateCardObj.rarity]}</span>
        </span>
      </div>
      <div class="card-template-stat">
        <span class="card-template-stat-heading">Illustrator</span>
        <span class="card-template-stat-values">
          <span class="dead-link"><a href="/illustrators">${cardEdition.illustrator}</a></span>
        </span>
      </div>
      <div class="card-template-stat">
        <span class="card-template-stat-heading">Population</span>
        <span class="card-template-stat-values">
          ${[...cardEdition.circulationTemplates, ...cardEdition.circulations].sort((a, b) => a.foil ? 1 : -1).map(circulationTemplate => (`<div>${circulationTemplate.foil ? 'Foil' : 'Normal'} ${circulationTemplate.population_operator}${circulationTemplate.population.toLocaleString()}</div>`)).join('\n')}
        </span>
      </div>
    </div>
    <p class="card-template-index-link">
      <a href="https://index.gatcg.com/edition/${cardEdition.slug}">View this card on Grand Archive Index</a>.
    </p>
  </div>
</div>`;
                fs.writeFileSync(`${blogTemplatesPath}/${cardEdition.slug}.html`, cardTemplate, 'utf8');
            }
        }
        const setTemplateEntries = [];
        for (let j = 0; j < setTemplateData.length; j++) {
            const setTemplateDataEntry = setTemplateData[j];
            const templateData = `## ${setTemplateDataEntry.set.prefix} &middot; ${setTemplateDataEntry.number} ${setTemplateDataEntry.rarity}

{% include templates/${setTemplateDataEntry.editionSlug.replace(/ /g, '_')}.html %}`;
            if (!fs.existsSync(`${blogCardPagesPath}/${setTemplateDataEntry.cardSlug}.markdown`)) {
                fs.writeFileSync(`${blogCardPagesPath}/${setTemplateDataEntry.cardSlug}.markdown`, (`---
layout: card
title:  "${setTemplateDataEntry.name} (card)"
date:   "${setTemplateDataEntry.lastUpdated}"
permalink: ${setTemplateDataEntry.cardSlug}_(card)
---

${templateData}
`), 'utf8');
            }
            else {
                const existingFileData = fs.readFileSync(`${blogCardPagesPath}/${setTemplateDataEntry.cardSlug}.markdown`, 'utf8');
                if (existingFileData.indexOf(templateData) === -1) {
                    fs.writeFileSync(`${blogCardPagesPath}/${setTemplateDataEntry.cardSlug}.markdown`, (`${existingFileData}

${templateData}
`), 'utf8');
                }
            }
            const setTemplateEntry = `<tr>
  <td style="text-align: left">
    ${setTemplateDataEntry.number}
  </td>
  <td style="text-align: left">
    <div class="set-list-card-name">
      <span class="card-cost card-cost-${setTemplateDataEntry.costType}">
        ${setTemplateDataEntry.cost}
      </span>
      <img class="image-element" src="https://img.silvie.org/misc/elements/${setTemplateDataEntry.element.toLowerCase()}.png" alt="${setTemplateDataEntry.element} element" />
      <abbr class="card-rarity-label card-rarity-label-${setTemplateDataEntry.rarity}" title="${rarity_1.Rarity[setTemplateDataEntry.rarity]}">${setTemplateDataEntry.rarity}</abbr>
      <span class="name-wrapper">
        <a href="/${setTemplateDataEntry.cardSlug}_(card)#${setTemplateDataEntry.anchor}">
          ${setTemplateDataEntry.name}
        </a>
      </span>
    </div>
  </td>
  <td style="text-align: right">
    ${setTemplateDataEntry.population}
  </td>
</tr>`;
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
        const matchingCustomSets = custom_sets_card_edition_uuids_1.default.filter(entry => entry.setCode === setCode);
        for (let j = 0; j < matchingCustomSets.length; j++) {
            const customSet = matchingCustomSets[j];
            const customSetTemplateData = [];
            for (let k = 0; k < customSet.cards.length; k++) {
                const customSetCard = customSet.cards[k];
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
                    type: cardMatch.types[0],
                };
                // #ksp--en-008-pr
                customSetTemplateCardObj.anchor = `${cardEditionMatchSet.prefix}--${cardEditionMatchSet.language}-${cardEditionMatch.collector_number}-${(0, rarity_1.getRarityCodeFromRarityId)(cardEditionMatch.rarity)}`.toLowerCase();
                customSetTemplateCardObj.number = `${cardEditionMatchSet.language}-${cardEditionMatch.collector_number}`;
                customSetTemplateCardObj.rarity = (0, rarity_1.getRarityCodeFromRarityId)(cardEditionMatch.rarity);
                customSetTemplateCardObj.population = [...cardEditionMatch.circulationTemplates, ...cardEditionMatch.circulations].sort((a, b) => a.foil ? 1 : -1).map(circulationTemplate => (`${circulationTemplate.foil ? `Foil` : `Normal`} ${circulationTemplate.population_operator}${circulationTemplate.population.toLocaleString()}`)).join('<br/>');
                customSetTemplateData.push(customSetTemplateCardObj);
            }
            const customSetTemplateEntries = [];
            let prevType = '';
            for (let k = 0; k < customSetTemplateData.length; k++) {
                const customSetTemplateDataEntry = customSetTemplateData[k];
                if (customSet.isDeck && prevType !== customSetTemplateDataEntry.type) {
                    prevType = customSetTemplateDataEntry.type;
                    customSetTemplateEntries.push(`<tr>
  <th colspan="3">${customSetTemplateDataEntry.type}</th>
</tr>`);
                }
                const setTemplateEntry = `<tr>
    <td style="text-align: left">
      ${customSetTemplateDataEntry.number}
    </td>
    <td style="text-align: left">
      <div class="set-list-card-name">
        <span class="card-cost card-cost-${customSetTemplateDataEntry.costType}">
          ${customSetTemplateDataEntry.cost}
        </span>
        <img class="image-element" src="https://img.silvie.org/misc/elements/${customSetTemplateDataEntry.element.toLowerCase()}.png" alt="${customSetTemplateDataEntry.element} element" />
        <abbr class="card-rarity-label card-rarity-label-${customSetTemplateDataEntry.rarity}" title="${rarity_1.Rarity[customSetTemplateDataEntry.rarity]}">${customSetTemplateDataEntry.rarity}</abbr>
        <span class="name-wrapper">
          <a href="/${customSetTemplateDataEntry.slug}_(card)#${customSetTemplateDataEntry.anchor}">
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
};
generateBlogTemplates();
