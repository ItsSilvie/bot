"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const fs = require("fs");
const https = require("https");
const types_1 = require("./types");
const non_index_sets_1 = require("./non-index-sets");
const DECK_BUILDER_REPO_LOCAL_PATH = '../silvie-monorepo/packages/@types/src/generated';
const DECK_BUILDER_CDN_REPO_LOCAL_PATH = '../img.silvie.org/docs';
const deckBuilderDataPath = `${DECK_BUILDER_CDN_REPO_LOCAL_PATH}/cdn`;
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});
const getCardImage = async (slug, uuid, nonIndexImage) => {
    await (0, node_fetch_1.default)(nonIndexImage ?? `https://api.gatcg.com/images/cards/${slug}.jpg`, {
        agent: httpsAgent,
    }).then(response => response.body.pipe(fs.createWriteStream(`../img.silvie.org/docs/cdn/deck-builder/${uuid}.jpg`)));
};
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
        ...non_index_sets_1.default.map(([setData]) => setData)
    ];
    const cardSearchData = [];
    for (let i = 0; i < allSets.length; i++) {
        const currentSet = allSets[i];
        const { prefix: setCode, } = currentSet;
        console.log(`Parsing set ${setCode}`);
        const nonIndexSetMatch = non_index_sets_1.default.find(([setData]) => setData.prefix === setCode);
        const cardData = nonIndexSetMatch ? nonIndexSetMatch[1].cardData : JSON.parse(fs.readFileSync(`./src/api-data/${setCode}.json`, 'utf8'));
        for (let j = 0; j < cardData.length; j++) {
            console.log(`    ...card ${j + 1}/${cardData.length}...`);
            const card = cardData[j];
            const cardSearchDataObj = {
                [types_1.CardSearchDataKeys.CostType]: typeof card.cost_memory === 'number' ? (types_1.CardSearchDataValues.CostMemory) : (types_1.CardSearchDataValues.CostReserve),
                [types_1.CardSearchDataKeys.Filter]: {
                    [types_1.CardSearchFilterKeys.Classes]: card.classes ?? undefined,
                    [types_1.CardSearchFilterKeys.Element]: card.element,
                    [types_1.CardSearchFilterKeys.SubTypes]: card.subtypes ?? undefined,
                    [types_1.CardSearchFilterKeys.Types]: card.types ?? undefined,
                },
                [types_1.CardSearchDataKeys.UUID]: card.uuid,
                [types_1.CardSearchDataKeys.Name]: card.name,
            };
            if (cardSearchData.find(entry => entry.u === card.uuid)) {
                // Exclude matches that have already been seen in other sets.
                continue;
            }
            const { slug, } = (card.editions || card.result_editions)[0];
            console.log(`      ...image ${j + 1}/${cardData.length}...`);
            await getCardImage(slug, card.uuid, card.nonIndexImage);
            cardSearchData.push(cardSearchDataObj);
            fs.writeFileSync(`${deckBuilderDataPath}/deck-builder/${card.uuid}.json`, JSON.stringify(card), 'utf-8');
        }
    }
    fs.writeFileSync(`${deckBuilderDataPath}/deck-builder/search.json`, JSON.stringify(cardSearchData), 'utf-8');
    fs.copyFileSync(`./dist/deck-builder/types.ts`, `${DECK_BUILDER_REPO_LOCAL_PATH}/deck-builder.ts`);
};
generateDeckBuilderData();
