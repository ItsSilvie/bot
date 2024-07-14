"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const fs = require("fs");
const rarity_1 = require("../utils/rarity");
const commands_1 = require("../utils/commands");
const SHOPIFY_CDN_REPO_LOCAL_PATH = '../img.silvie.org/docs';
const stocklistDataPath = `${SHOPIFY_CDN_REPO_LOCAL_PATH}/cdn`;
const priceConfig = {
    currency: 'GBP',
    minimumPrice: 0.25,
    percentageOffset: 0.9,
    foils: false,
};
const generateProductImport = async () => {
    if (!fs.existsSync(stocklistDataPath)) {
        fs.mkdirSync(stocklistDataPath);
    }
    if (!fs.existsSync(`${stocklistDataPath}/stocklist`)) {
        fs.mkdirSync(`${stocklistDataPath}/stocklist`);
    }
    const exchangeRates = await (0, node_fetch_1.default)(`${commands_1.API_URL}/api/pricing/rates`)
        .then(res => res.json());
    if (typeof exchangeRates === 'string') {
        throw new Error(exchangeRates);
    }
    //  "Option1 Name","Option1 Value","Option2 Name","Option2 Value","Option3 Name","Option3 Value","Variant SKU","Variant Grams","Variant Inventory Tracker","Variant Inventory Policy","Variant Fulfillment Service","Variant Price","Variant Compare At Price","Variant Requires Shipping","Variant Taxable","Variant Barcode", 
    // , "Gift Card","SEO Title","SEO Description","Google Shopping / Google Product Category","Google Shopping / Gender","Google Shopping / Age Group","Google Shopping / MPN","Google Shopping / Condition","Google Shopping / Custom Product","Google Shopping / Custom Label 0","Google Shopping / Custom Label 1","Google Shopping / Custom Label 2","Google Shopping / Custom Label 3","Google Shopping / Custom Label 4","Variant Image","Variant Weight Unit","Variant Tax Code","Cost per item","Included / United Kingdom","Price / United Kingdom","Compare At Price / United Kingdom","Included / International","Price / International","Compare At Price / International","Status"
    const cardData = [];
    const allSets = Object.values(JSON.parse(fs.readFileSync('./src/api-data/sets.json', 'utf8')));
    const parseSet = (currentSet, options = {}) => {
        const baseSetCode = options.baseSetCode ?? currentSet.prefix;
        const setCode = options.setCode ?? currentSet.prefix;
        const setName = options.setName ?? currentSet.name;
        console.log(`Parsing set ${setCode}`);
        const cards = options.cardData ?? JSON.parse(fs.readFileSync(`./src/api-data/${baseSetCode}.json`, 'utf8'));
        for (let j = 0; j < cards.length; j++) {
            console.log(`    ...card ${j + 1}/${cardData.length}...`);
            const card = cards[j];
            const cardEditions = card.editions?.filter(entry => entry.set.prefix === baseSetCode) ?? [];
            for (let k = 0; k < cardEditions.length; k++) {
                console.log(`      ...edition ${k + 1}/${card.editions.length}...`);
                const cardEdition = cardEditions[k];
                const cardEditionSet = cardEdition.set;
                const cardCirculations = [...cardEdition.circulationTemplates, ...cardEdition.circulations];
                const setCardDataObj = {
                    id: cardEdition.uuid,
                    element: card.element,
                    name: card.name,
                    number: cardEdition.formattedCollectorNumber ?? `${cardEditionSet.language}-${cardEdition.collector_number}`,
                    rarity: (0, rarity_1.getRarityCodeFromRarityId)(cardEdition.rarity),
                    slug: cardEdition.slug,
                    set: cardEdition.set.prefix,
                    setName: cardEdition.set.name,
                    nonFoil: !!cardCirculations.find(entry => entry.foil !== true),
                    foil: !!cardCirculations.find(entry => entry.foil === true),
                };
                cardData.push(setCardDataObj);
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
    const combinedOutput = [
        `"Handle","Title","Body (HTML)","Vendor","Product Category","Type","Tags","Published","Image Src","Image Position","Image Alt Text","Variant Price","Variant Compare At Price","Variant Inventory Tracker"`,
    ];
    for (let i = 0; i < allSets.length; i++) {
        const prefix = allSets[i].prefix;
        if (prefix === 'DOApSP') {
            // Ignore this set as it was only released for playing on TTS.
            continue;
        }
        console.log(`Getting price information for set: ${prefix}...`);
        let cardPrices = await (0, node_fetch_1.default)(`${commands_1.API_URL}/api/pricing/set?prefix=${prefix}`)
            .then(res => res.json());
        if (typeof cardPrices === 'string') {
            console.log(`  ...no price data found for set ${prefix}...`);
            cardPrices = [];
        }
        const cards = cardData.filter(entry => entry.set === prefix);
        if (!cards.length) {
            return;
        }
        const output = [
            [
                "Handle",
                "Title",
                "Body (HTML)",
                "Vendor",
                "Product Category",
                "Type",
                "Tags",
                "Published",
                "Image Src",
                "Image Position",
                "Image Alt Text",
                "Variant Price",
                "Variant Compare At Price",
                "Variant Inventory Tracker",
                "Variant Weight Unit",
                "Variant SKU",
                "Option1 Name",
                "Option1 Value",
            ].join(',')
        ];
        for (let j = 0; j < cards.length; j++) {
            const card = cards[j];
            const cardPriceFoil = cardPrices?.foil?.find(entry => entry.card.uuid === card.id);
            const cardPriceNonFoil = cardPrices?.nonFoil?.find(entry => entry.card.uuid === card.id);
            const rarity = rarity_1.Rarity[card.rarity];
            const rarityAnVsA = ['U', 'UR'];
            const baseCardData = {
                handle: card.slug,
                title: `${card.number} ${card.name} (${card.rarity})`,
                body: `<p>${card.name} is ${rarityAnVsA.includes(card.rarity) ? 'an' : 'a'} ${rarity.toLowerCase()} card in Grand Archive's ${card.setName} set.<p>`,
                vendor: 'Weebs of the Shore',
                category: 'Arts & Entertainment > Hobbies & Creative Arts > Collectibles > Collectible Trading Cards',
                type: 'Trading Card',
                tags: `Set: ${card.set}, Rarity: ${rarity}`,
                published: 'FALSE',
                imageSrc: `https://img.silvie.org/cdn/cards/${card.set}/${card.rarity}/${card.number}.jpg`,
                imagePosition: '1',
                imageAlt: card.name,
                variantInventoryTracker: 'shopify',
                variantWeightUnit: 'g',
                variantSKU: card.id.toUpperCase(),
                option1Name: 'Title',
                option1Value: 'Default Title',
            };
            const roundPrice = (price) => (Math.ceil(price * 100) / 100);
            const getPrice = (priceDataset) => {
                let variantPrice = '';
                let variantCompareAtPrice = '';
                if (!priceDataset || !priceDataset.prices?.marketPrice) {
                    return {
                        variantPrice,
                        variantCompareAtPrice,
                    };
                }
                const marketPriceWithExchangeApplied = priceDataset.prices.marketPrice * exchangeRates.rates[priceConfig.currency];
                variantPrice = roundPrice(marketPriceWithExchangeApplied * priceConfig.percentageOffset);
                if (variantPrice < priceConfig.minimumPrice) {
                    variantPrice = roundPrice(priceConfig.minimumPrice);
                }
                if (priceConfig.percentageOffset >= 1 || variantPrice >= marketPriceWithExchangeApplied) {
                    return {
                        variantPrice,
                        variantCompareAtPrice,
                    };
                }
                return {
                    variantPrice,
                    variantCompareAtPrice: roundPrice(marketPriceWithExchangeApplied),
                };
            };
            if (card.nonFoil) {
                const { variantPrice, variantCompareAtPrice, } = getPrice(cardPriceNonFoil);
                const nonFoilData = [
                    baseCardData.handle,
                    baseCardData.title,
                    baseCardData.body,
                    baseCardData.vendor,
                    baseCardData.category,
                    baseCardData.type,
                    `${baseCardData.tags}, Variant: Non-foil`,
                    baseCardData.published,
                    baseCardData.imageSrc,
                    baseCardData.imagePosition,
                    baseCardData.imageAlt,
                    variantPrice,
                    variantCompareAtPrice,
                    baseCardData.variantInventoryTracker,
                    baseCardData.variantWeightUnit,
                    baseCardData.variantSKU,
                    baseCardData.option1Name,
                    baseCardData.option1Value,
                ].map(entry => `"${entry}"`).join(',');
                output.push(nonFoilData);
                combinedOutput.push(nonFoilData);
            }
            if (priceConfig.foils && card.foil) {
                const { variantPrice, variantCompareAtPrice, } = getPrice(cardPriceFoil);
                const foilData = [
                    `${baseCardData.handle}-foil`,
                    `${baseCardData.title} FOIL`,
                    baseCardData.body,
                    baseCardData.vendor,
                    baseCardData.category,
                    baseCardData.type,
                    `${baseCardData.tags}, Variant: Foil`,
                    baseCardData.published,
                    baseCardData.imageSrc,
                    baseCardData.imagePosition,
                    baseCardData.imageAlt,
                    variantPrice,
                    variantCompareAtPrice,
                    baseCardData.variantInventoryTracker,
                    baseCardData.variantWeightUnit,
                    baseCardData.variantSKU,
                    baseCardData.option1Name,
                    baseCardData.option1Value,
                ].map(entry => `"${entry}"`).join(',');
                output.push(foilData);
                combinedOutput.push(foilData);
            }
        }
        fs.writeFileSync(`${stocklistDataPath}/stocklist/${prefix}-shopify.csv`, output.join('\n'), 'utf-8');
    }
    fs.writeFileSync(`${stocklistDataPath}/stocklist/_all-cards-shopify.csv`, combinedOutput.join('\n'), 'utf-8');
};
try {
    generateProductImport();
}
catch (e) {
    console.error(e);
}
