import fetch from 'node-fetch';
import * as fs from 'fs';
import * as https from 'https';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const apiScrape = async () => {
  const [_, __, cardSetArg] = process.argv;

  const getOptions = async () => {
    const response = await fetch(`https://api.gatcg.com/option/search`, {
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

  const getCardImage = async (slug: string, uuid: string) => {
    await fetch(`https://api.gatcg.com/images/cards/${slug}.jpg`, {
      agent: httpsAgent,
    }).then(response => {
      console.log('writing', uuid);

      response.body.pipe(
        fs.createWriteStream(`../img.silvie.org/docs/api-data/${uuid}.jpg`, {
          flags: 'w',
        })
      );
    }).catch((e) => console.error(e));
  }

  const getAllCards = async (cardSet) => {
    console.log('  ...getting cards...');
    const response = await getAllPaginatedResults(`https://api.gatcg.com/cards/search?prefix=${cardSet}`);
    return response;
  }

  const allSets = JSON.parse(fs.readFileSync('./src/api-data/sets.json', 'utf8'));
  const updatedSetsOutput = { ...allSets };

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
      for (let j = 0; j < card.editions.length; j++) {
        console.log(`      ...image ${j + 1}/${card.editions.length}...`);
        const cardEdition = card.editions[j];
        await getCardImage(cardEdition.slug, cardEdition.uuid);
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