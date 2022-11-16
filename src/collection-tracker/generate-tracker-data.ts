import * as fs from 'fs';
import JsonToTS from 'json-to-ts';

const TRACKER_REPO_LOCAL_PATH = '../silvie-monorepo/packages/@types/src/generated';
const TRACKER_CDN_REPO_LOCAL_PATH = '../img.silvie.org';
const trackerDataPath = `${TRACKER_CDN_REPO_LOCAL_PATH}/cdn`;

enum Variant {
  Foil = "Foil",
  NonFoil = "Non-foil",
}

// https://stackoverflow.com/a/1026087/1317805
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function pascalCase(string) {
  return string
    .replace(/[^A-Za-z0-9]/g, '') // https://stackoverflow.com/a/32192557/1317805
    .split(' ')
    .map(part => capitalize(part))
    .join('');
}

const getRarityCodeFromRarityId = (rarityId) => {
  if (rarityId < 1 || rarityId > 8) {
    throw new Error(`Unhandled rarity ID: ${rarityId}`);
  }

  const rarityArr = [
    'C', // 1
    'U', // 2
    'R', // 3
    'SR', // 4
    'UR', // 5
    'PR', // 6
    'CSR', // 7
    'CUR', // 8
  ];

  return rarityArr[rarityId - 1];
}

const getVariantFromCardData = (cardEdition, circulationTemplate) => {
  if (circulationTemplate.foil) {
    return Variant.Foil;
  }

  return Variant.NonFoil;
}

const generateTrackerData = async () => {
  if (!fs.existsSync(trackerDataPath)) {
    fs.mkdirSync(trackerDataPath);
  }
  
  if (!fs.existsSync(`${trackerDataPath}/collection-tracker`)) {
    fs.mkdirSync(`${trackerDataPath}/collection-tracker`);
  }

  const allSets = Object.values(JSON.parse(fs.readFileSync('./src/api-data/sets.json', 'utf8'))) as {
    language: string;
    name: string;
    prefix: string;
  }[];

  let generatedSetData = [];
  let cardType;

  for (let i = 0; i < allSets.length; i++) {
    const currentSet = allSets[i];

    const {
      prefix: setCode,
    } = currentSet;

    console.log(`Parsing set ${setCode}`);
  
    const cardData = JSON.parse(fs.readFileSync(`./src/api-data/${setCode}.json`, 'utf8'));
    const setCardData = [];

    for (let j = 0; j < cardData.length; j++) {
      console.log(`    ...card ${j + 1}/${cardData.length}...`);
      const card = cardData[j];
      const cardEditions = card.editions.filter(entry => entry.set.prefix === setCode);

      for (let k = 0; k < cardEditions.length; k++) {
        console.log(`      ...edition ${k + 1}/${card.result_editions.length}...`);
        const cardEdition = cardEditions[k];
        const cardEditionSet = cardEdition.set;

        [...cardEdition.circulationTemplates, ...cardEdition.circulations].map(circulationTemplate => {
          console.log(circulationTemplate);
          
          const setCardDataObj = {
            anchor: `${cardEditionSet.prefix}--${cardEditionSet.language}-${cardEdition.collector_number}-${getRarityCodeFromRarityId(cardEdition.rarity)}`.toLowerCase(),
            element: card.element,
            image: `https://img.silvie.org/api-data/${cardEdition.uuid}.jpg`,
            name: card.name,
            number: `${cardEditionSet.language}-${cardEdition.collector_number}`,
            rarity: getRarityCodeFromRarityId(cardEdition.rarity),
            population: circulationTemplate.population,
            populationOperator: circulationTemplate.population_operator,
            slug: cardEdition.slug,
            uuid: cardEdition.uuid,
            variant: getVariantFromCardData(cardEdition, circulationTemplate),
          };;
  
          setCardData.push(setCardDataObj);
        });
      }
    }

    generatedSetData.push({
      ...currentSet,
      cards: {
        variants: Object.entries(Variant).reduce((obj, [key, value]) => ({
          ...obj,
          [key]: setCardData.filter(setCard => setCard.variant === value).length,
        }), {}),
        total: setCardData.length,
      },
    })

    fs.writeFileSync(`${trackerDataPath}/collection-tracker/${setCode}.json`, JSON.stringify(setCardData), 'utf-8');

    if (i === 0) {
      cardType = JsonToTS(setCardData[0])[0]
        .replace('interface', 'export interface')
        .replace('RootObject', 'GeneratedCard');
    }
  }

  fs.writeFileSync(`${trackerDataPath}/collection-tracker/sets.json`, JSON.stringify(generatedSetData), 'utf-8');

  const setType = JsonToTS(generatedSetData[0]).map(entry => {
    console.log(entry);
    return entry
      .replace('interface', 'export interface')
      .replace('RootObject', 'GeneratedSet')
      .replace('Cards', 'GeneratedSetCardCount')
      .replace('Variants', 'GeneratedSetCardVariantCount');
  }).join('\n\n')

  const options = JSON.parse(fs.readFileSync('./src/api-data/options.json', 'utf8')) as {
    [key: string]: {
      text: string,
      value: string,
    }[]
  };
  const optionTypes = Object.entries(options).reduce((arr, [key, values]) => {
    let valueFormatter;

    switch (key) {
      case 'set':
      case 'statOperator':
        return arr;

      case 'rarity':
        valueFormatter = (value) => getRarityCodeFromRarityId(value);
        break;

      default:
        break;
    }
    
    return [
      ...arr,
`export enum Generated${capitalize(key)} {
  ${values.map(({ text, value }) => `${pascalCase(text)} = "${typeof valueFormatter === 'function' ? valueFormatter(value) : value}",`).join('\n  ')}
}`
    ];
  }, [
`export enum GeneratedVariant {
  ${Object.entries(Variant).map(([key, value]) => `${key} = "${value}",`).join('\n  ')}
}`
  ]).join('\n\n');

  const formatCardType = (cardType) => {
    return cardType
      .replace('element: string', 'element: GeneratedElement')
      .replace('rarity: string', 'rarity: GeneratedRarity')
      .replace('variant: string', 'variant: GeneratedVariant')
  }
  
  fs.writeFileSync(`${TRACKER_REPO_LOCAL_PATH}/collection-tracker.ts`, `${optionTypes}\n\n${setType}\n\n${formatCardType(cardType)}`, 'utf-8');
}

generateTrackerData();