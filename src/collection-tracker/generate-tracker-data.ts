import * as fs from 'fs';
import JsonToTS from 'json-to-ts';
import { getRarityCodeFromRarityId, Rarity } from '../utils/rarity';
import nonIndexSets from './non-index-sets';
import { getSetCategory, getSetInfo, getSetLogo, getSetMetadata } from './set-metadata';

const TRACKER_REPO_LOCAL_PATH = '../silvie-monorepo/packages/@types/src/generated';
const TRACKER_CDN_REPO_LOCAL_PATH = '../img.silvie.org/docs';
const trackerDataPath = `${TRACKER_CDN_REPO_LOCAL_PATH}/cdn`;

enum Variant {
  OilFoil = "Oil foil",
  Foil = "Foil",
  MatteFoil = "Matte foil",
  Metal = "Metal",
  NonFoil = "Non-foil",
  StarFoil = "Star foil",
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

const getVariantFromCardData = (cardEdition, circulationTemplate) => {
  if (circulationTemplate.foil) {
    switch (circulationTemplate.foilType) {
      case 'oil':
        return Variant.OilFoil;

      case 'matte':
        return Variant.MatteFoil;

      case 'metal':
        return Variant.Metal;

      case 'star':
        return Variant.StarFoil;

      default:
        return Variant.Foil;
    }

  }

  return Variant.NonFoil;
}

const generateTrackerData = async () => {
  let champions = [];

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
  let setPageSetDataType;

  const parseSet = (currentSet: typeof allSets[0], options: {
    baseSetCode?: string;
    cardData?: any;
    generateType?: boolean;
    setCode?: string;
    setName?: string;
  } = {}) => {
    const baseSetCode = options.baseSetCode ?? currentSet.prefix;
    const setCode = options.setCode ?? currentSet.prefix;
    const setName = options.setName ?? currentSet.name;

    console.log(`Parsing set ${setCode}`);
  
    const cardData = options.cardData ?? JSON.parse(fs.readFileSync(`./src/api-data/${baseSetCode}.json`, 'utf8'));
    const setCardData = [];

    for (let j = 0; j < cardData.length; j++) {
      console.log(`    ...card ${j + 1}/${cardData.length}...`);
      const card = cardData[j];
      const cardEditions = card.editions.filter(entry => entry.set.prefix === baseSetCode);

      if (card.types?.includes('CHAMPION') && !card.subtypes?.includes('SPIRIT')) {
        const [championName] = card.name.split(',');
        if (!champions.includes(championName)) {
          champions.push(championName);
        }
      }

      for (let k = 0; k < cardEditions.length; k++) {
        console.log(`      ...edition ${k + 1}/${card.editions.length}...`);
        const cardEdition = cardEditions[k];
        const cardEditionSet = cardEdition.set;

        [...cardEdition.circulationTemplates, ...cardEdition.circulations].map(circulationTemplate => {          
          const setCardDataObj = {
            anchor: `${cardEditionSet.prefix}--${cardEditionSet.language}-${cardEdition.collector_number}-${getRarityCodeFromRarityId(cardEdition.rarity)}`.toLowerCase(),
            element: card.element,
            elements: card.elements,
            image: card.nonIndexImage ?? `https://img.silvie.org/api-data/${cardEdition.uuid}.jpg`,
            name: card.name,
            number: cardEdition.formattedCollectorNumber ?? `${cardEditionSet.language}-${cardEdition.collector_number}`,
            rarity: getRarityCodeFromRarityId(cardEdition.rarity),
            population: circulationTemplate.population,
            populationOperator: circulationTemplate.population_operator,
            slug: cardEdition.slug,
            uuid: `${cardEdition.uuid}-${circulationTemplate.uuid}${options.setCode ? `-${options.setCode}` : ''}`,
            variant: getVariantFromCardData(cardEdition, circulationTemplate),
          };
  
          setCardData.push(setCardDataObj);
        });
      }
    }

    const setListSetData = {
      ...currentSet,
      prefix: setCode,
      name: setName,
      cards: {
        variants: Object.entries(Variant).filter(([key, value]) => {
          // Ignore foil variants (these are combined in the reducer below).
          if (value === Variant.OilFoil || value === Variant.MatteFoil || value === Variant.StarFoil) {
            return false;
          }

          return true;
        }).reduce((obj, [key, value]) => {
          return {
            ...obj,
            [key]: setCardData.filter(setCard => {
              if (value === Variant.Foil) {
                // Combine all foil variants.
                return setCard.variant === Variant.Foil || setCard.variant === Variant.OilFoil || setCard.variant === Variant.MatteFoil || setCard.variant === Variant.StarFoil
              }

              return setCard.variant === value
            }).length,
          }
        }, {}),
        total: setCardData.length,
      },
      category: null,
      logo: null,
      info: null,
    }

    const setLogo = getSetLogo(setCode);

    if (setLogo) {
      setListSetData.logo = setLogo;
    }

    const setCategory = getSetCategory(setCode);

    if (setCategory) {
      setListSetData.category = setCategory;
    }

    const setInfo = getSetInfo(setCode);

    if (setInfo) {
      setListSetData.info = setInfo;
    }

    generatedSetData.push(setListSetData);

    const setPageSetData = {
      cards: setCardData,
      meta: null
    }

    const setMetadata = getSetMetadata(setCode);

    if (setMetadata) {
      setPageSetData.meta = setMetadata;
    }

    fs.writeFileSync(`${trackerDataPath}/collection-tracker/${setCode}.json`, JSON.stringify(setPageSetData), 'utf-8');

    if (options.generateType) {
      setPageSetDataType = JsonToTS(setPageSetData).map(entry => {
        return entry
          .replace('interface', 'export interface')
          .replace('RootObject', 'GeneratedSetData')
          .replace('Meta', 'GeneratedSetMetadata')
          .replace('meta: GeneratedSetMetadata', 'meta?: GeneratedSetMetadata')
          .replace('Linked', 'GeneratedSetMetadataLinkedSet')
          .replace('journal: string', 'journal?: string')
          .replace('linked: ', 'linked?: ')
          .replace('Card', 'GeneratedCard')
          .replace('element: string', 'element: GeneratedElement')
          .replace('rarity: string', 'rarity: GeneratedRarity')
          .replace('variant: string', 'variant: GeneratedVariant');
      }).join('\n\n')
    }
  }

  for (let i = 0; i < allSets.length; i++) {
    if (allSets[i].prefix === 'DOApSP') {
      // Ignore this set as it was only released for playing on TTS.
      continue;
    }

    parseSet(allSets[i]);
  }

  // Manually create non-Index sets.
  nonIndexSets.forEach(([setData, options]) => {
    if (setData.prefix === 'DEMO22-SAMPLE') {
      parseSet(setData, {
        ...options,
        // Generate the type here as this set includes both journal and linked set metadata.
        generateType: true,
      });
      return;
    }

    parseSet(setData, options);
  })

  fs.writeFileSync(`${trackerDataPath}/collection-tracker/sets.json`, JSON.stringify(generatedSetData), 'utf-8');

  const setListSetDataType = JsonToTS(generatedSetData[0]).map(entry => {
    return entry
      .replace('interface', 'export interface')
      .replace('RootObject', 'GeneratedSet')
      .replace(/name\: string\;\n  prefix\: string\;/, 'name: GeneratedSetName;\n  prefix: GeneratedSetPrefix;')
      .replace('Cards', 'GeneratedSetCardCount')
      .replace('Info', 'GeneratedSetInfo')
      .replace('Variants', 'GeneratedSetCardVariantCount')
      .replace('logo: string', 'logo?: string');
  }).join('\n\n')

  const options = JSON.parse(fs.readFileSync('./src/api-data/options.json', 'utf8')) as {
    [key: string]: {
      display?: string;
      text: string;
      value: string;
    }[]
  };
  const optionTypes = Object.entries(options).reduce((arr, [key, values]) => {
    let keyFormatter = (data) => pascalCase(data.text);
    let typeFormatter = (key) => `Generated${capitalize(key)}`;
    let valueFormatter;

    switch (key) {
      case 'statOperator':
        return arr;

      case 'set':
        return [
          ...arr,
          `export enum ${typeFormatter(key)}Prefix {
  ${values.map((entry) => `${pascalCase(entry.value)} = "${entry.value}",`).join('\n  ')}
}

export enum ${typeFormatter(key)}Name {
  ${values.map((entry) => `${pascalCase(entry.value)} = "${entry.text}",`).join('\n  ')}
}`
        ];

      case 'rarity':
        valueFormatter = (value) => getRarityCodeFromRarityId(value);
        break;

      default:
        break;
    }
    
    return [
      ...arr,
`export enum ${typeFormatter(key)} {
  ${values.map((entry) => `${keyFormatter(entry)} = "${typeof valueFormatter === 'function' ? valueFormatter(entry.value) : entry.value}",`).join('\n  ')}
}`
    ];
  }, [
`export enum GeneratedVariant {
  ${Object.entries(Variant).map(([key, value]) => `${key} = "${value}",`).join('\n  ')}
}`,
`export enum GeneratedRarityLabel {
  ${Object.entries(Rarity).map(([key, value]) => `${key} = "${value}",`).join('\n  ')}
}`,
`export enum GeneratedChampion {
  ${[...champions].sort((a, b) => a > b ? 1 : -1).map((champion) => `${champion.replace(/ /g, '')} = "${champion}",`).join('\n  ')}
}`
  ]).join('\n\n');
  
  fs.writeFileSync(`${TRACKER_REPO_LOCAL_PATH}/collection-tracker.ts`, `${optionTypes}\n\n${setListSetDataType}\n\n${setPageSetDataType}`, 'utf-8');
}

generateTrackerData();