import * as fs from 'fs';
import JsonToTS from 'json-to-ts';

const DECK_BUILDER_REPO_LOCAL_PATH = '../img.silvie.org';
const deckBuilderDataPath = `${DECK_BUILDER_REPO_LOCAL_PATH}/cdn`;

const generateDeckBuilderData = async () => {
  if (!fs.existsSync(deckBuilderDataPath)) {
    fs.mkdirSync(deckBuilderDataPath);
  }
  
  if (!fs.existsSync(`${deckBuilderDataPath}/deck-builder`)) {
    fs.mkdirSync(`${deckBuilderDataPath}/deck-builder`);
  }

  const allSets = Object.values(JSON.parse(fs.readFileSync('./src/api-data/sets.json', 'utf8'))) as {
    language: string;
    name: string;
    prefix: string;
  }[];

  const cardSearchData = [];

  for (let i = 0; i < allSets.length; i++) {
    const currentSet = allSets[i];

    const {
      prefix: setCode,
    } = currentSet;

    console.log(`Parsing set ${setCode}`);
  
    const cardData = JSON.parse(fs.readFileSync(`./src/api-data/${setCode}.json`, 'utf8'));

    for (let j = 0; j < cardData.length; j++) {
      console.log(`    ...card ${j + 1}/${cardData.length}...`);
      const card = cardData[j];

      const cardSearchDataObj: {
        n: string; // Card name
        t: 'm' | 'r'; // Cost type
        u: string; // Card uuid
      } = {
        u: card.uuid,
        n: card.name,
        t: typeof card.cost_memory === 'number' ? 'm' : 'r',
      }

      if (cardSearchData.find(entry => entry.u === card.uuid)) {
        // Exclude matches that have already been seen in other sets.
        continue;
      }

      cardSearchData.push(cardSearchDataObj);
      fs.writeFileSync(`${deckBuilderDataPath}/deck-builder/${card.uuid}.json`, JSON.stringify(card), 'utf-8');
    }
  }

  fs.writeFileSync(`${deckBuilderDataPath}/deck-builder/search.json`, JSON.stringify(cardSearchData), 'utf-8');
}

generateDeckBuilderData();