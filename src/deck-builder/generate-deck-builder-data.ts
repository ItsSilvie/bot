import fetch from 'node-fetch';
import * as fs from 'fs';
import * as https from 'https';
import { CardSearchData, CardSearchDataKeys, CardSearchDataValues, CardSearchFilterKeys } from './types';

const DECK_BUILDER_REPO_LOCAL_PATH = '../silvie-monorepo/packages/@types/src/generated';
const DECK_BUILDER_CDN_REPO_LOCAL_PATH = '../img.silvie.org';
const deckBuilderDataPath = `${DECK_BUILDER_CDN_REPO_LOCAL_PATH}/cdn`;

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const getCardImage = async (slug: string, uuid: string) => {
  await fetch(`https://api.gatcg.com/images/cards/${slug}.jpg`, {
    agent: httpsAgent,
  }).then(response => response.body.pipe(
    fs.createWriteStream(`../img.silvie.org/cdn/deck-builder/${uuid}.jpg`)
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
      }

      if (cardSearchData.find(entry => entry.u === card.uuid)) {
        // Exclude matches that have already been seen in other sets.
        continue;
      }
      const {
        slug,
      } = (card.editions || card.result_editions)[0];

      console.log(`      ...image ${j + 1}/${cardData.length}...`)
      await getCardImage(slug, card.uuid);

      cardSearchData.push(cardSearchDataObj);
      fs.writeFileSync(`${deckBuilderDataPath}/deck-builder/${card.uuid}.json`, JSON.stringify(card), 'utf-8');
    }
  }

  fs.writeFileSync(`${deckBuilderDataPath}/deck-builder/search.json`, JSON.stringify(cardSearchData), 'utf-8');
  fs.copyFileSync(`./dist/deck-builder/types.ts`, `${DECK_BUILDER_REPO_LOCAL_PATH}/deck-builder.ts`);
}

generateDeckBuilderData();