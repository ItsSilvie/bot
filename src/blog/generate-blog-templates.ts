import * as fs from 'fs';

const generateBlogTemplates = async () => {
  const allSets = Object.keys(JSON.parse(fs.readFileSync('./src/api-data/sets.json', 'utf8')));

  if (!fs.existsSync(`./templates`)) {
    fs.mkdirSync(`./templates`);
  }

  for (let i = 0; i < allSets.length; i++) {
    const setCode = allSets[i];

    console.log(`Parsing set ${setCode}`);
    const cardData = JSON.parse(fs.readFileSync(`./src/api-data/${setCode}.json`, 'utf8'));

    for (let j = 0; j < cardData.length; j++) {
      console.log(`    ...card ${j + 1}/${cardData.length}...`);
      const card = cardData[j];

      for (let k = 0; k < card.editions.length; k++) {
          console.log(`      ...edition ${k + 1}/${card.editions.length}...`);
          const cardEdition = card.editions[k];
          const cardEditionSet = cardEdition.set
          
          const cardTemplate = 
`<p>This card is part of the <a href="/${cardEditionSet.prefix}_(set)">${cardEditionSet.name}</a> set.</p>
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
    <div class="card-template-stat">
      <span class="card-template-stat-heading">Effect</span>
      <span class="card-template-stat-values">
        <span class="card-template-stat-values-effect">
          ${cardEdition.effect || card.effect}
        </span>
      </span>
    </div>
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
        ${cardEdition.circulationTemplates.map(circulationTemplate => (
          `<div>${circulationTemplate.foil ? 'Foil' : 'Normal'} &ndash; ${circulationTemplate.population_operator}${circulationTemplate.population.toLocaleString()}</div>`
        )).join('\n')}
      </span>
    </div>
  </div>
  <p>
    For the full card stats, <a href="https://index.gatcg.com/edition/${cardEdition.slug}">view this card on Grand Archive Index</a>.
  </p>
</div>`;

        fs.writeFileSync(`./templates/${cardEdition.slug}.html`, cardTemplate, 'utf8');
      }
    }
  }
}

generateBlogTemplates();