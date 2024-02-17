import * as fs from 'fs';
import * as path from 'path';
import { IndexSet, IndexCard } from '../data/types';
import { getRarityCodeFromRarityId } from '../utils/rarity';

const CDN_REPO_LOCAL_PATH = '../img.silvie.org/docs';
const shortenerWordsDataPath = `${CDN_REPO_LOCAL_PATH}/cdn`;

const allCards = async () => {
  try {
    const sets: IndexSet[] = await import(path.resolve(__dirname, `../api-data/sets.json`));
    let cards: IndexCard[] = [];
    const setPrefixes = Object.values(sets).map(entry => entry.prefix);

    for (let i = 0; i < setPrefixes.length; i++) {
      const setPrefix = setPrefixes[i];

      const setCards: IndexCard[] = await import(path.resolve(__dirname, `../api-data/${setPrefix}.json`));

      cards = [
        ...cards,
        ...setCards.filter(({ uuid }) => !cards.find(entry => entry.uuid === uuid)),
      ];
    }

    return cards;
  } catch (e) {
    console.error(e);
  }
}

const generateShortenerWords = async () => {
  if (!fs.existsSync(shortenerWordsDataPath)) {
    fs.mkdirSync(shortenerWordsDataPath);
  }

  const cards = await allCards();
  const uniqueWords: string[] = [];

  const ignoredWords = [
    'back',
    'card',
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
    'that',
    'then',
    'this',
    'with',
    'when',
    'will',
    'your',
    'until',
  ]

  const processString = (string: string) => {
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
  }

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    processString(card.name);

    if (card.effect_raw) {
      processString(card.effect_raw);
    }
  }

  fs.writeFileSync(`${shortenerWordsDataPath}/words.json`, JSON.stringify(uniqueWords), 'utf-8');
}

generateShortenerWords();