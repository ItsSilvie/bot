import fetch from 'node-fetch';
import * as fs from 'fs';
import * as https from 'https';
import { getRarityCodeFromRarityId } from '../utils/rarity';

const EBAY_CDN_REPO_LOCAL_PATH = '../img.silvie.org/docs';
const stocklistDataPath = `${EBAY_CDN_REPO_LOCAL_PATH}/cdn`;

const cellSeparator = '	';

const generateBlankStocklist = () => {
  if (!fs.existsSync(stocklistDataPath)) {
    fs.mkdirSync(stocklistDataPath);
  }
  
  if (!fs.existsSync(`${stocklistDataPath}/stocklist`)) {
    fs.mkdirSync(`${stocklistDataPath}/stocklist`);
  }

  const allSets = Object.values(JSON.parse(fs.readFileSync('./src/api-data/sets.json', 'utf8'))) as {
    language: string;
    name: string;
    prefix: string;
  }[];
  const setCardData = [];

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

    for (let j = 0; j < cardData.length; j++) {
      console.log(`    ...card ${j + 1}/${cardData.length}...`);
      const card = cardData[j];
      const cardEditions = card.editions.filter(entry => entry.set.prefix === baseSetCode);

      for (let k = 0; k < cardEditions.length; k++) {
        console.log(`      ...edition ${k + 1}/${card.editions.length}...`);
        const cardEdition = cardEditions[k];
        const cardEditionSet = cardEdition.set;
        const cardCirculations = [...cardEdition.circulationTemplates, ...cardEdition.circulations];

        const setCardDataObj = {
          element: card.element,
          elements: card.elements,
          name: card.name,
          number: cardEdition.formattedCollectorNumber ?? `${cardEditionSet.language}-${cardEdition.collector_number}`,
          rarity: getRarityCodeFromRarityId(cardEdition.rarity),
          slug: cardEdition.slug,
          set: cardEdition.set.prefix,
          nonFoil: !!cardCirculations.find(entry => entry.foil !== true),
          foil: !!cardCirculations.find(entry => entry.foil === true),
        };

        setCardData.push(setCardDataObj);
      }
    }
  }

  for (let i = 0; i < allSets.length; i++) {
    if (allSets[i].prefix === 'DOApSP') {
      // Ignore this set as it was only released for playing on TTS.
      continue;
    }

    parseSet(allSets[i]);
  }

  for (let i = 0; i < allSets.length; i++) {
    const prefix = allSets[i].prefix;

    if (prefix === 'DOApSP') {
      // Ignore this set as it was only released for playing on TTS.
      continue;
    }

    const cards = setCardData.filter(entry => entry.set === prefix);

    if (!cards.length) {
      return;
    }

    const output = cards.map(({ elements, name, number, rarity, nonFoil, foil }, index) => (
      [elements.join(', '), rarity, number, name, nonFoil ? 0 : 'N/A', foil ? 0 : 'N/A'].join(cellSeparator)
    )).join('\n');
  

    fs.writeFileSync(`${stocklistDataPath}/stocklist/${prefix}.txt`, output, 'utf-8');
  }
}

generateBlankStocklist();