import * as fs from 'fs';
import * as path from 'path';
import { getSetInfo } from '../collection-tracker/set-metadata';
import { IndexCard, IndexCirculation, IndexEdition, IndexSet } from '../data/types';
import { getRarityCodeFromRarityId, Rarity } from '../utils/rarity';

const BLOG_REPO_LOCAL_PATH = '../blog.silvie.org';
const blogCustomTemplatesPath = `${BLOG_REPO_LOCAL_PATH}/_includes/custom-templates`

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

interface NamedCard {
  cards: IndexCard[];
  editions: number;
  name: string;
  previewImage: string;
  type: string;
}

enum CustomType {
  Champion = 'Champions',
  Ally = 'Allies',
  Location = 'Places',
  Item = 'Items',
}

const getCustomTypeFromType = (type: string) => {
  switch (type) {
    case 'ALLY':
      return CustomType.Ally;

    case 'CHAMPION':
      return CustomType.Champion;

    case 'DOMAIN':
      return CustomType.Location;

    case 'REGALIA':
    case 'ACTION':
    case 'ATTACK':
      return CustomType.Item;
  }
}

const generateNamedCardsTemplate = async () => {
  if (!fs.existsSync(blogCustomTemplatesPath)) {
    fs.mkdirSync(blogCustomTemplatesPath);
  }

  const cards = await allCards();
  const cardsWithUniqueNames = cards.filter(entry => entry.name.includes(',')).reduce((cardsArr, card) => {
    const name = card.name.replace(/,.*/, '');
    const type = getCustomTypeFromType(card.types.filter(entry => entry !== 'UNIQUE')[0]);
    const namedCardMatchIndex = cardsArr.findIndex(entry => entry.name === name && entry.type === type);
    const previewEdition = card.editions.filter(entry => entry.rarity >= 7)?.[0] ?? card.editions[0];
    const previewImage = `https://img.silvie.org/cdn/cards/${previewEdition.set.prefix}/${getRarityCodeFromRarityId(previewEdition.rarity)}/${previewEdition.set.language}-${previewEdition.collector_number}.jpg`;

    if (namedCardMatchIndex === -1) {
      return [
        ...cardsArr,
        {
          cards: [card],
          editions: card.editions.length,
          previewImage,
          name,
          type,
        }
      ];
    }

    const namedCardMatch = cardsArr[namedCardMatchIndex]

    return [
      ...cardsArr.slice(0, namedCardMatchIndex),
      {
        ...namedCardMatch,
        cards: [...namedCardMatch.cards, card],
        editions: namedCardMatch.editions + card.editions.length,
        previewImage: previewEdition.rarity >= 7 ? previewImage : namedCardMatch.previewImage,
      },
      ...cardsArr.slice(namedCardMatchIndex + 1),
    ]
  }, [] as NamedCard[])

  const typeOrder = Object.values(CustomType);

  const sortedUniqueCards = [...cardsWithUniqueNames].sort((a, b) => {
    if (a.type !== b.type) {
      const aIndex = typeOrder.findIndex(entry => entry === a.type);
      const bIndex = typeOrder.findIndex(entry => entry === b.type);

      if (aIndex === -1) {
        throw new Error(`Unhandled deck sort type: ${a.type}`)
      }

      if (bIndex === -1) {
        throw new Error(`Unhandled deck sort type: ${b.type}`)
      }

      return aIndex - bIndex;
    }

    return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
  });

  const templateData = [];

  let prevTemplateType;

  for (let i = 0; i < sortedUniqueCards.length; i++) {
    const {
      cards,
      editions,
      name,
      previewImage,
      type,
    } = sortedUniqueCards[i];
    
    if (prevTemplateType !== type) {
      prevTemplateType = type;
      templateData.push(`<tr>
<th colspan="2">${type}</th>
</tr>`)
    }

    templateData.push(`<tr style="background-image: url('${previewImage}')">
  <td><a href="https://index.gatcg.com/cards?name=${name.toLowerCase()}">${name}</a></td>
  <td>${cards.length}${editions === 1 ? '' : ` <small>(${editions} variants)</small>`}</td>
</tr>`)
  }

  fs.writeFileSync(`${blogCustomTemplatesPath}/named-cards.html`, `<table class="set-list set-list-custom set-list-named-cards-article">
  <thead>
    <tr>
      <th style="text-align: left">Name</th>
      <th style="text-align: left">Cards</th>
    </tr>
  </thead>
  <tbody>
    ${templateData.join('\n')}
  </tbody>
</table>`, 'utf8');
}

generateNamedCardsTemplate();