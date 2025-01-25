import fetch from 'node-fetch';
import * as fs from 'fs';
import * as https from 'https';
import { CardSearchData, CardSearchDataKeys, CardSearchDataValues, CardSearchFilterKeys } from './types';
import nonIndexSets from './non-index-sets';
import { API_BASE } from '../utils/constants';

const DECK_BUILDER_REPO_LOCAL_PATH = '../silvie-monorepo/packages/@types/src/generated';
const DECK_BUILDER_CDN_REPO_LOCAL_PATH = '../img.silvie.org/docs';
const deckBuilderDataPath = `${DECK_BUILDER_CDN_REPO_LOCAL_PATH}/cdn`;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const getCardImage = async (imagePath: string, uuid: string, nonIndexImage?: string) => {
  await fetch(nonIndexImage ?? `${API_BASE}${imagePath}`, {
    agent: httpsAgent,
  }).then(response => response.body.pipe(
    fs.createWriteStream(`../img.silvie.org/docs/cdn/deck-builder/${uuid}.jpg`)
  ));
}

const generateDeckBuilderData = async () => {
  if (!fs.existsSync(deckBuilderDataPath)) {
    fs.mkdirSync(deckBuilderDataPath);
  }
  
  if (!fs.existsSync(`${deckBuilderDataPath}/deck-builder`)) {
    fs.mkdirSync(`${deckBuilderDataPath}/deck-builder`);
  }
  
  if (!fs.existsSync(DECK_BUILDER_REPO_LOCAL_PATH)) {
    fs.mkdirSync(DECK_BUILDER_REPO_LOCAL_PATH);
  }

  const allSets = [
    ...Object.values(JSON.parse(fs.readFileSync('./src/api-data/sets.json', 'utf8'))),
    ...nonIndexSets.map(([setData]) => setData)
  ] as {
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
  
    const nonIndexSetMatch = nonIndexSets.find(([setData]) => setData.prefix === setCode);
    const cardData = nonIndexSetMatch ? nonIndexSetMatch[1].cardData : JSON.parse(fs.readFileSync(`./src/api-data/${setCode}.json`, 'utf8'));

    for (let j = 0; j < cardData.length; j++) {
      console.log(`    ...card ${j + 1}/${cardData.length}...`);
      const card = cardData[j];

      const cardSearchDataObj: CardSearchData = {
        [CardSearchDataKeys.CostType]: typeof card.cost_memory === 'number' ? (
          CardSearchDataValues.CostMemory
        ) : (
          CardSearchDataValues.CostReserve
        ),
        [CardSearchDataKeys.Filter]: {
          [CardSearchFilterKeys.Classes]: card.classes ?? undefined,
          [CardSearchFilterKeys.Element]: card.element,
          [CardSearchFilterKeys.SubTypes]: card.subtypes ?? undefined,
          [CardSearchFilterKeys.Types]: card.types ?? undefined,
        },
        [CardSearchDataKeys.UUID]: card.uuid,
        [CardSearchDataKeys.Name]: card.name,
        [CardSearchDataKeys.LastUpdated]: card.last_update,
      }

      if (cardSearchData.find(entry => entry.u === card.uuid)) {
        // Exclude matches that have already been seen in other sets.
        continue;
      }
      const {
        image,
      } = (card.editions || card.result_editions)[0];

      console.log(`      ...image ${j + 1}/${cardData.length}...`)
      await getCardImage(image, card.uuid, card.nonIndexImage);

      cardSearchData.push(cardSearchDataObj);
      fs.writeFileSync(`${deckBuilderDataPath}/deck-builder/${card.uuid}.json`, JSON.stringify(card), 'utf-8');
    }
  }

  fs.writeFileSync(`${deckBuilderDataPath}/deck-builder/search.json`, JSON.stringify(cardSearchData), 'utf-8');
  fs.copyFileSync(`./dist/deck-builder/types.ts`, `${DECK_BUILDER_REPO_LOCAL_PATH}/deck-builder.ts`);
}

generateDeckBuilderData();