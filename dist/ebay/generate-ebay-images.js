"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const fs = require("fs");
const https = require("https");
const rarity_1 = require("../utils/rarity");
const constants_1 = require("../utils/constants");
const EBAY_CDN_REPO_LOCAL_PATH = '../img.silvie.org/docs';
const ebayDataPath = `${EBAY_CDN_REPO_LOCAL_PATH}/cdn`;
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});
const getCardImage = async (slug, setPrefix, number, rarity) => {
    const setPrefixPath = `../img.silvie.org/docs/cdn/cards/${setPrefix}`;
    if (!fs.existsSync(setPrefixPath)) {
        fs.mkdirSync(setPrefixPath);
    }
    const rarityPath = `${setPrefixPath}/${rarity}`;
    if (!fs.existsSync(rarityPath)) {
        fs.mkdirSync(rarityPath);
    }
    await (0, node_fetch_1.default)(`${constants_1.IMAGE_BASE}/${slug}.jpg`, {
        agent: httpsAgent,
    }).then(response => response.body.pipe(fs.createWriteStream(`${rarityPath}/${number}.jpg`)));
};
const generateEbayImages = async () => {
    if (!fs.existsSync(ebayDataPath)) {
        fs.mkdirSync(ebayDataPath);
    }
    if (!fs.existsSync(`${ebayDataPath}/cards`)) {
        fs.mkdirSync(`${ebayDataPath}/cards`);
    }
    const allSets = Object.values(JSON.parse(fs.readFileSync('./src/api-data/sets.json', 'utf8')));
    const setCardData = [];
    const parseSet = (currentSet, options = {}) => {
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
                const setCardDataObj = {
                    name: card.name,
                    number: cardEdition.formattedCollectorNumber ?? `${cardEditionSet.language}-${cardEdition.collector_number}`,
                    rarity: (0, rarity_1.getRarityCodeFromRarityId)(cardEdition.rarity),
                    slug: cardEdition.slug,
                    set: cardEdition.set.prefix,
                };
                setCardData.push(setCardDataObj);
            }
        }
    };
    for (let i = 0; i < allSets.length; i++) {
        if (allSets[i].prefix === 'DOApSP') {
            // Ignore this set as it was only released for playing on TTS.
            continue;
        }
        parseSet(allSets[i]);
    }
    // for (let i = 0; i < setCardData.length; i++) {
    //   const card = setCardData[i];
    //   await getCardImage(card.slug, card.set, card.number, card.rarity);
    // }
    for (let i = 0; i < allSets.length; i++) {
        const prefix = allSets[i].prefix;
        if (prefix === 'DOApSP') {
            // Ignore this set as it was only released for playing on TTS.
            continue;
        }
        Object.keys(rarity_1.Rarity).forEach(rarity => {
            const cards = setCardData.filter(entry => entry.set === prefix && entry.rarity === rarity);
            if (!cards.length) {
                return;
            }
            const output = cards.map(entry => `${entry.number.replace('EN-', '')} ${entry.name.replace(/,/g, '')}`).join(',');
            fs.writeFileSync(`${ebayDataPath}/cards/${prefix}/${rarity}/data.txt`, output, 'utf-8');
        });
    }
};
generateEbayImages();
