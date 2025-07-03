"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const fs = require("fs");
const https = require("https");
const constants_1 = require("./utils/constants");
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});
const apiScrape = async () => {
    const [_, __, cardSetArg] = process.argv;
    const getOptions = async () => {
        const response = await (0, node_fetch_1.default)(`${constants_1.API_BASE}/option/search`, {
            agent: httpsAgent,
        }).then(response => response.json());
        return response;
    };
    const options = await getOptions();
    const cardSets = options.set.map(({ value }) => value);
    if (cardSetArg && cardSets.indexOf(cardSetArg) === -1) {
        throw new Error(`${cardSetArg} is not a known set. Does the hardcoded set list need updating?`);
    }
    const getAllPaginatedResults = async (url, output, currentPage, size) => {
        const { data, page, total_pages: totalPages, } = await (0, node_fetch_1.default)(`${url}&page=${currentPage || 1}`, {
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
    };
    const getCardImage = async (imagePath, uuid) => {
        await (0, node_fetch_1.default)(`${constants_1.API_BASE}${imagePath}?cache-bust=${Date.now()}`, {
            agent: httpsAgent,
        }).then(response => response.body.pipe(fs.createWriteStream(`../img.silvie.org/docs/api-data/${uuid}.jpg`, {
            flags: 'w',
        }))).catch((e) => console.error(e));
    };
    const getAllCards = async (cardSet) => {
        console.log('  ...getting cards...');
        const response = await getAllPaginatedResults(`${constants_1.API_BASE}/cards/search?prefix=${cardSet}`);
        return response;
    };
    const updatedSetsOutput = {};
    const processOptions = async () => {
        fs.writeFileSync('./src/api-data/options.json', JSON.stringify(options), 'utf8');
    };
    const processSet = async (cardSet) => {
        const cardData = await getAllCards(cardSet);
        console.log('  ...updating sets list...');
        updatedSetsOutput[cardSet] = cardData[0].editions.find(edition => edition.set.prefix === cardSet).set;
        fs.writeFileSync('./src/api-data/sets.json', JSON.stringify(updatedSetsOutput), 'utf8');
        let existingSetData;
        if (fs.existsSync(`./src/api-data/${cardSet}.json`)) {
            existingSetData = JSON.parse(fs.readFileSync(`./src/api-data/${cardSet}.json`, 'utf8'));
        }
        fs.writeFileSync(`./src/api-data/${cardSet}.json`, JSON.stringify(cardData), 'utf8');
        console.log('  ...getting card images...');
        for (let i = 0; i < cardData.length; i++) {
            console.log(`    ...card ${i + 1}/${cardData.length}...`);
            const card = cardData[i];
            const cardEditionsInSet = card.editions.filter(edition => edition.set.prefix === cardSet);
            const existingCardData = existingSetData?.find((entry) => entry.uuid === card.uuid);
            for (let j = 0; j < cardEditionsInSet.length; j++) {
                const cardEdition = cardEditionsInSet[j];
                const existingEditionMatch = existingCardData?.editions?.find((edition) => edition.uuid === cardEdition.uuid);
                if (existingEditionMatch && existingEditionMatch.last_update === cardEdition.last_update) {
                    // If the edition exists and is up-to-date, we can skip it
                    console.log(`      ...skipping ${j + 1}/${cardEditionsInSet.length} (not updated)...`);
                }
                else {
                    console.log(`      ...image ${j + 1}/${cardEditionsInSet.length}...`);
                    await getCardImage(cardEdition.image, cardEdition.uuid);
                }
                const cardOrientationsInEdition = cardEdition.other_orientations ?? [];
                const existingCardOrientationsInEdition = existingEditionMatch?.other_orientations ?? [];
                for (let k = 0; k < cardOrientationsInEdition.length; k++) {
                    const editionOrientation = cardOrientationsInEdition[k];
                    const existingOrientationMatch = existingCardOrientationsInEdition.find(orientation => orientation.edition.uuid === editionOrientation.edition.uuid);
                    if (existingOrientationMatch && existingOrientationMatch.edition.last_update === editionOrientation.edition.last_update) {
                        // If the other orientation edition exists and is up-to-date, we can skip it
                        console.log(`        ...skipping orientation ${k + 1}/${cardOrientationsInEdition.length} (not updated)...`);
                    }
                    else {
                        console.log(`        ...orientation image ${k + 1}/${cardOrientationsInEdition.length}...`);
                        await getCardImage(editionOrientation.edition.image, editionOrientation.edition.uuid);
                    }
                }
            }
        }
    };
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
};
apiScrape();
