"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const rarity_1 = require("../utils/rarity");
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
                const cardCirculations = [...cardEdition.circulationTemplates, ...cardEdition.circulations];
                const basicData = {
                    element: card.element,
                    elements: card.elements,
                    name: card.name,
                    number: cardEdition.formattedCollectorNumber ?? `${cardEditionSet.language}-${cardEdition.collector_number}`,
                    rarity: (0, rarity_1.getRarityCodeFromRarityId)(cardEdition.rarity),
                    slug: cardEdition.slug,
                    set: cardEdition.set.prefix,
                };
                const variants = cardCirculations.reduce((output, circulation) => {
                    if (!circulation.variants?.length) {
                        return output;
                    }
                    return {
                        ...output,
                        ...circulation.variants.reduce((variantOutput, variant) => ({
                            ...variantOutput,
                            [variant.image]: {
                                nonFoil: false,
                                foil: false,
                                description: variant.description,
                                image: variant.image,
                                ...variantOutput[variant.image],
                                ...(variant.kind === 'NONFOIL' ? { nonFoil: true } : { foil: true }),
                            }
                        }), {}),
                    };
                }, {});
                const baseCirculationNonFoilPopulation = cardCirculations.find(entry => entry.foil !== true);
                const baseCirculationFoilPopulation = cardCirculations.find(entry => entry.foil === true);
                const variantNonFoilPopulation = cardCirculations.filter(entry => entry.foil !== true).reduce((n, circulation) => {
                    return n + (circulation.variants?.reduce((n2, variant) => n2 + variant.population, 0) ?? 0);
                }, 0);
                const variantFoilPopulation = cardCirculations.filter(entry => entry.foil === true).reduce((n, circulation) => {
                    return n + (circulation.variants?.reduce((n2, variant) => n2 + variant.population, 0) ?? 0);
                }, 0);
                if (!variants[cardEdition.image]) {
                    variants[cardEdition.image] = {
                        nonFoil: !!baseCirculationNonFoilPopulation && (variantNonFoilPopulation === 0 || baseCirculationNonFoilPopulation - variantNonFoilPopulation > 0),
                        foil: !!baseCirculationFoilPopulation && (variantFoilPopulation === 0 || baseCirculationFoilPopulation - variantFoilPopulation > 0),
                    };
                }
                Object.values(variants).forEach(variant => {
                    setCardData.push({
                        ...basicData,
                        name: variant.description ? `${basicData.name} (${variant.description})` : basicData.name,
                        nonFoil: variant.nonFoil,
                        foil: variant.foil,
                    });
                });
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
        const output = cards.map(({ elements, slug, name, number, rarity, nonFoil, foil }) => ([elements.join(', '), rarity, number, name, nonFoil ? 0 : 'N/A', foil ? 0 : 'N/A', `=HYPERLINK("https://index.gatcg.com/edition/${slug}", "View on Index")`].join(cellSeparator))).join('\n');
        fs.writeFileSync(`${stocklistDataPath}/stocklist/${prefix}.txt`, output, 'utf-8');
    }
};
generateBlankStocklist();
