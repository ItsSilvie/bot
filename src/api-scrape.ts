import fetch from 'node-fetch';
import * as fs from 'fs';
import * as https from 'https';
import { API_BASE } from './utils/constants';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const apiScrape = async () => {
  const [_, __, cardSetArg] = process.argv;

  const getOptions = async () => {
    const response = await fetch(`${API_BASE}/option/search`, {
      agent: httpsAgent,
    }).then(response => response.json())
    return response;
  }

  const options = await getOptions();
  const cardSets = options.set.map(({ value }) => value);

  if (cardSetArg && cardSets.indexOf(cardSetArg) === -1) {
    throw new Error(`${cardSetArg} is not a known set. Does the hardcoded set list need updating?`);
  }

  const getAllPaginatedResults = async (url: string, output?: any[], currentPage?: number, size?: number) => {
    const {
      data,
      page,
      total_pages: totalPages,
    } = await fetch(`${url}&page=${currentPage || 1}`, {
      agent: httpsAgent,
    }).then(response => response.json());
    
    if (!Array.isArray(output) || !currentPage || !size) {
      if (totalPages === 1) {
        return data;
      }

      return getAllPaginatedResults(url, data, 2, totalPages);
    }

    const response = [
      ...output,
      ...data
    ];

    if (currentPage === size) {
      return response;
    }

    return getAllPaginatedResults(url, response, page + 1, totalPages);
  }

  const getCardImage = async (imagePath: string, uuid: string) => {
    await fetch(`${API_BASE}${imagePath}?cache-bust=${Date.now()}`, {
      agent: httpsAgent,
    }).then(response => response.body.pipe(
      fs.createWriteStream(`../img.silvie.org/docs/api-data/${uuid}.jpg`, {
        flags: 'w',
      })
    )).catch((e) => console.error(e));
  }

  const getAllCards = async (cardSet) => {
    console.log('  ...getting cards...');
    const response = await getAllPaginatedResults(`${API_BASE}/cards/search?prefix=${cardSet}`);
    return response;
  }

  const updatedSetsOutput = {};

  const processOptions = async () => {
    fs.writeFileSync('./src/api-data/options.json', JSON.stringify(options), 'utf8');
  }

  const processSet = async (cardSet) => {
    const cardData = await getAllCards(cardSet);
    fs.writeFileSync(`./src/api-data/${cardSet}.json`, JSON.stringify(cardData) as string, 'utf8');

    console.log('  ...getting card images...');
    for (let i = 0; i < cardData.length; i++) {
      console.log(`    ...card ${i + 1}/${cardData.length}...`);
      const card = cardData[i];
      const cardEditionsInSet = card.editions.filter(edition => edition.set.prefix === cardSet)
      for (let j = 0; j < cardEditionsInSet.length; j++) {
        console.log(`      ...image ${j + 1}/${cardEditionsInSet.length}...`);
        const cardEdition = cardEditionsInSet[j];
        await getCardImage(cardEdition.image, cardEdition.uuid);

        const cardOrientationsInEdition = cardEdition.other_orientations ?? [];
        for (let k = 0; k < cardOrientationsInEdition.length; k++) {
          console.log(`        ...orientation image ${k + 1}/${cardOrientationsInEdition.length}...`);
          const editionOrientation = cardOrientationsInEdition[k];
          await getCardImage(editionOrientation.edition.image, editionOrientation.edition.uuid);
        }
      }
    }

    updatedSetsOutput[cardSet] = cardData[0].editions.find(edition => edition.set.prefix === cardSet).set;
    fs.writeFileSync('./src/api-data/sets.json', JSON.stringify(updatedSetsOutput), 'utf8');
  }

  await processOptions();

  if (!cardSetArg) {
    for (let i = 0; i < cardSets.length; i++) {
      const cardSet = cardSets[i];
      console.log(`${i + 1}/${cardSets.length} (${cardSet})...`);
      await processSet(cardSet);
    }

    return;
  }

  await processSet(cardSetArg);
  await processOptions();
}

apiScrape();