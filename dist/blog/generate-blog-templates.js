"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const custom_sets_card_edition_uuids_1 = require("./custom-sets-card-edition-uuids");
const BLOG_REPO_LOCAL_PATH = '../blog.silvie.org';
const blogTemplatesPath = `${BLOG_REPO_LOCAL_PATH}/_includes/templates`;
const blogCardPagesPath = `${BLOG_REPO_LOCAL_PATH}/cards`;
const getRarityCodeFromRarityId = (rarityId) => {
    if (rarityId < 1 || rarityId > 7) {
        throw new Error(`Unhandled rarity ID: ${rarityId}`);
    }
    const rarityArr = [
        'C',
        'U',
        'R',
        'SR',
        'UR',
        'CR',
        'PR', // 7
    ];
    return rarityArr[rarityId - 1];
};
const generateBlogTemplates = async () => {
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
            for (let k = 0; k < card.result_editions.length; k++) {
                console.log(`      ...edition ${k + 1}/${card.result_editions.length}...`);
                const cardEdition = card.result_editions[k];
                const cardEditionSet = cardEdition.set;
                const setTemplateCardObj = {
                    anchor: '',
                    element: card.element,
                    name: card.name,
                    number: '',
                    rarity: '',
                    population: '',
                    slug: card.slug,
                };
                // #ksp--en-008-pr
                setTemplateCardObj.anchor = `${cardEditionSet.prefix}--${cardEditionSet.language}-${cardEdition.collector_number}-${getRarityCodeFromRarityId(cardEdition.rarity)}`.toLowerCase();
                setTemplateCardObj.number = `${cardEditionSet.language}-${cardEdition.collector_number}`;
                setTemplateCardObj.rarity = getRarityCodeFromRarityId(cardEdition.rarity);
                setTemplateCardObj.population = [...cardEdition.circulationTemplates, ...cardEdition.circulations].map(circulationTemplate => (`${circulationTemplate.foil ? `Foil` : `Normal`} ${circulationTemplate.population_operator}${circulationTemplate.population.toLocaleString()}`)).join(' &ndash; ');
                setTemplateData.push(setTemplateCardObj);
                const cardTemplate = `<p>This card is part of the <a href="/${cardEditionSet.prefix}_(set)">${cardEditionSet.name}</a> set.</p>
<div class="card-template">
  <figure class="image">
    <img
      src="https://img.silvie.org/api-data/${cardEdition.uuid}.jpg"
      alt="${card.name} &ndash; ${cardEditionSet.prefix} &middot; ${cardEditionSet.language}-${cardEdition.collector_number}"
      style="max-width: 440px;"
    >
    <figcaption>${card.name} &ndash; ${cardEditionSet.prefix} &middot; ${cardEditionSet.language}-${cardEdition.collector_number}</figcaption>
  </figure>
  <div class="card-template-stats">
  ${cardEdition.effect || card.effect ? (`  <div class="card-template-stat">
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
      <span class="card-template-stat-heading">Illustrator</span>
      <span class="card-template-stat-values">
        <span class="dead-link"><a href="/illustrators">${cardEdition.illustrator}</a></span>
      </span>
    </div>
    <div class="card-template-stat">
      <span class="card-template-stat-heading">Population</span>
      <span class="card-template-stat-values">
        ${[...cardEdition.circulationTemplates, ...cardEdition.circulations].map(circulationTemplate => (`<div>${circulationTemplate.foil ? 'Foil' : 'Normal'} &ndash; ${circulationTemplate.population_operator}${circulationTemplate.population.toLocaleString()}</div>`)).join('\n')}
      </span>
    </div>
  </div>
  <p>
    For the full card stats, <a href="https://index.gatcg.com/edition/${cardEdition.slug}">view this card on Grand Archive Index</a>.
  </p>
</div>`;
                fs.writeFileSync(`${blogTemplatesPath}/${cardEdition.slug}.html`, cardTemplate, 'utf8');
            }
        }
        const setTemplateEntries = [];
        for (let j = 0; j < setTemplateData.length; j++) {
            const setTemplateDataEntry = setTemplateData[j];
            if (!fs.existsSync(`${blogCardPagesPath}/${setTemplateDataEntry.slug}.markdown`)) {
                fs.writeFileSync(`${blogCardPagesPath}/${setTemplateDataEntry.slug}.markdown`, (`---
layout: card
title:  "${setTemplateDataEntry.name} (trading card)"
date:   2022-06-25 08:44:00 +0100
permalink: ${setTemplateDataEntry.slug}_(card)
incomplete: true
---

## ${setCode} &middot; ${setTemplateDataEntry.number} ${setTemplateDataEntry.rarity}

{% include templates/${setTemplateDataEntry.slug}-${setCode.toLowerCase()}.html %}`), 'utf8');
            }
            const setTemplateEntry = `<tr>
  <td style="text-align: left">
    ${setTemplateDataEntry.number}
  </td>
  <td style="text-align: left">
    <img class="image-element" src="https://img.silvie.org/misc/elements/${setTemplateDataEntry.element.toLowerCase()}.png" alt="${setTemplateDataEntry.element} element" />
    <a href="/${setTemplateDataEntry.slug}_(card)#${setTemplateDataEntry.anchor}">
      ${setTemplateDataEntry.name}
    </a>
  </td>
  <td style="text-align: left">
    ${setTemplateDataEntry.rarity}
  </td>
  <td style="text-align: right">
    ${setTemplateDataEntry.population}
  </td>
</tr>`;
            setTemplateEntries.push(setTemplateEntry);
        }
        fs.writeFileSync(`${blogTemplatesPath}/${setCode}.html`, `<table>
<thead>
  <tr>
    <th style="text-align: left">Number</th>
    <th style="text-align: left">Name</th>
    <th style="text-align: left">Rarity</th>
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
                const cardMatch = cardData.find(entry => entry.result_editions.find(resultEdition => resultEdition.uuid === customSetCard.id));
                if (!cardMatch) {
                    throw new Error(`No matching card found for custom set ${customSet.filename} card ${customSetCard.id}. Is this not a result edition UUID?`);
                }
                const cardEditionMatch = cardMatch.result_editions.find(entry => entry.uuid === customSetCard.id);
                const cardEditionMatchSet = cardEditionMatch.set;
                const customSetTemplateCardObj = {
                    anchor: '',
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
                customSetTemplateCardObj.anchor = `${cardEditionMatchSet.prefix}--${cardEditionMatchSet.language}-${cardEditionMatch.collector_number}-${getRarityCodeFromRarityId(cardEditionMatch.rarity)}`.toLowerCase();
                customSetTemplateCardObj.number = `${cardEditionMatchSet.language}-${cardEditionMatch.collector_number}`;
                customSetTemplateCardObj.rarity = getRarityCodeFromRarityId(cardEditionMatch.rarity);
                customSetTemplateCardObj.population = [...cardEditionMatch.circulationTemplates, ...cardEditionMatch.circulations].map(circulationTemplate => (`${circulationTemplate.foil ? `Foil` : `Normal`} ${circulationTemplate.population_operator}${circulationTemplate.population.toLocaleString()}`)).join(' &ndash; ');
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
      <img class="image-element" src="https://img.silvie.org/misc/elements/${customSetTemplateDataEntry.element.toLowerCase()}.png" alt="${customSetTemplateDataEntry.element} element" />
      <a href="/${customSetTemplateDataEntry.slug}_(card)#${customSetTemplateDataEntry.anchor}">
        ${customSetTemplateDataEntry.name}
      </a>${customSetTemplateDataEntry.quantity ? ` x${customSetTemplateDataEntry.quantity}` : ''}
    </td>
    
    ${customSetTemplateDataEntry.quantity ? '' : (`    <td style="text-align: left">
      ${customSetTemplateDataEntry.rarity}
    </td>`)}
  </tr>`;
                customSetTemplateEntries.push(setTemplateEntry);
            }
            fs.writeFileSync(`${blogTemplatesPath}/${setCode}-${customSet.filename}.html`, `<table class="condensed-table">
      <thead>
        <tr>
          <th style="text-align: left">Number</th>
          <th style="text-align: left">Name</th>
          ${customSet.isDeck ? '' : '<th style="text-align: left">Rarity</th>'}
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
