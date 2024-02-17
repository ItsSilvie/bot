"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const CDN_REPO_LOCAL_PATH = '../img.silvie.org/docs';
const shortenerWordsDataPath = `${CDN_REPO_LOCAL_PATH}/cdn`;
const allCards = async () => {
    try {
        const sets = await Promise.resolve().then(() => require(path.resolve(__dirname, `../api-data/sets.json`)));
        let cards = [];
        const setPrefixes = Object.values(sets).map(entry => entry.prefix);
        for (let i = 0; i < setPrefixes.length; i++) {
            const setPrefix = setPrefixes[i];
            const setCards = await Promise.resolve().then(() => require(path.resolve(__dirname, `../api-data/${setPrefix}.json`)));
            cards = [
                ...cards,
                ...setCards.filter(({ uuid }) => !cards.find(entry => entry.uuid === uuid)),
            ];
        }
        return cards;
    }
    catch (e) {
        console.error(e);
    }
};
const generateShortenerWords = async () => {
    if (!fs.existsSync(shortenerWordsDataPath)) {
        fs.mkdirSync(shortenerWordsDataPath);
    }
    const cards = await allCards();
    const uniqueWords = [];
    const ignoredWords = [
        'back',
        'copy',
        'dead',
        'dies',
        'into',
        'lose',
        'lost',
        'kill',
        'onto',
        'take',
        'than',
        'then',
        'with',
        'when',
        'will',
        'until',
    ];
    const processString = (string) => {
        const parts = string
            .toLowerCase()
            .replace(/\\n|\n/g, ' ')
            .replace(/[^a-z ']+/gi, '')
            .split(' ')
            .filter(entry => entry.length > 3 && entry.length < 8 && !entry.includes('\'') && !ignoredWords.includes(entry));
        for (let j = 0; j < parts.length; j++) {
            const cardNamePart = parts[j];
            if (uniqueWords.find(entry => entry === cardNamePart)) {
                continue;
            }
            uniqueWords.push(cardNamePart);
        }
    };
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        processString(card.name);
        if (card.effect_raw) {
            processString(card.effect_raw);
        }
    }
    fs.writeFileSync(`${shortenerWordsDataPath}/words.json`, JSON.stringify(uniqueWords), 'utf-8');
};
generateShortenerWords();
