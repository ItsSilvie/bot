import * as fs from 'fs';

const TRACKER_REPO_LOCAL_PATH = '../silvie.org';

const trackerDataPath = `${TRACKER_REPO_LOCAL_PATH}/src/data`

const getRarityCodeFromRarityId = (rarityId) => {
  if (rarityId < 1 || rarityId > 7) {
    throw new Error(`Unhandled rarity ID: ${rarityId}`);
  }

  const rarityArr = [
    'C', // 1
    'U', // 2
    'R', // 3
    'SR', // 4
    'UR', // 5
    'CR', // 6
    'PR', // 7
  ];

  return rarityArr[rarityId - 1];
}

const getVariantFromCardData = (cardEdition, circulationTemplate) => {
  if (circulationTemplate.foil) {
    return 'Foil';
  }

  return 'Non-foil';
}

const generateTrackerData = async () => {
  if (!fs.existsSync(trackerDataPath)) {
    fs.mkdirSync(trackerDataPath);
  }
  
  if (!fs.existsSync(`${trackerDataPath}/cards`)) {
    fs.mkdirSync(`${trackerDataPath}/cards`);
  }

  const allSets = Object.values(JSON.parse(fs.readFileSync('./src/api-data/sets.json', 'utf8'))) as {
    language: string;
    name: string;
    prefix: string;
  }[];

  fs.writeFileSync(`${trackerDataPath}/sets.json`, JSON.stringify(allSets), 'utf-8');

  for (let i = 0; i < allSets.length; i++) {
    const {
      prefix: setCode,
    } = allSets[i];

    console.log(`Parsing set ${setCode}`);
  
    const cardData = JSON.parse(fs.readFileSync(`./src/api-data/${setCode}.json`, 'utf8'));
    const setCardData = [];
    let cardId = 0;

    for (let j = 0; j < cardData.length; j++) {
      console.log(`    ...card ${j + 1}/${cardData.length}...`);
      const card = cardData[j];

      for (let k = 0; k < card.result_editions.length; k++) {
        console.log(`      ...edition ${k + 1}/${card.result_editions.length}...`);
        const cardEdition = card.result_editions[k];
        const cardEditionSet = cardEdition.set;

        const setCardDataObj = {
          anchor: '',
          element: card.element,
          id: 0,
          image: `https://img.silvie.org/api-data/${cardEdition.uuid}.jpg`,
          name: card.name,
          number: '',
          rarity: '',
          population: '',
          slug: card.slug,
          variant: '',
        };

        [...cardEdition.circulationTemplates, ...cardEdition.circulations].map(circulationTemplate => {
          setCardDataObj.anchor = `${cardEditionSet.prefix}--${cardEditionSet.language}-${cardEdition.collector_number}-${getRarityCodeFromRarityId(cardEdition.rarity)}`.toLowerCase();
          setCardDataObj.number = `${cardEditionSet.language}-${cardEdition.collector_number}`;
          setCardDataObj.population = `${circulationTemplate.population_operator}${circulationTemplate.population.toLocaleString()}`;
          setCardDataObj.rarity = getRarityCodeFromRarityId(cardEdition.rarity);
          setCardDataObj.variant = getVariantFromCardData(cardEdition, circulationTemplate);
          setCardDataObj.id = ++cardId;

          setCardData.push(setCardDataObj);
        });
      }
    }

    fs.writeFileSync(`${trackerDataPath}/cards/${setCode}.json`, JSON.stringify(setCardData), 'utf-8');
  }
}

generateTrackerData();