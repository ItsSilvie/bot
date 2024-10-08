"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const rarity_1 = require("../utils/rarity");
const BLOG_REPO_LOCAL_PATH = '../blog.silvie.org';
const blogCustomTemplatesPath = `${BLOG_REPO_LOCAL_PATH}/_includes/custom-templates`;
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
var CustomType;
(function (CustomType) {
    CustomType["Champion"] = "Champions";
    CustomType["Ally"] = "Allies";
    CustomType["Location"] = "Places";
    CustomType["Item"] = "Items";
    CustomType["Phantasia"] = "Phantasia";
})(CustomType || (CustomType = {}));
const getCustomTypeFromType = (type) => {
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
        case 'PHANTASIA':
            return CustomType.Phantasia;
    }
};
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
        const previewImage = `https://img.silvie.org/cdn/cards/${previewEdition.set.prefix}/${(0, rarity_1.getRarityCodeFromRarityId)(previewEdition.rarity)}/${previewEdition.set.language}-${previewEdition.collector_number}.jpg`;
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
        const namedCardMatch = cardsArr[namedCardMatchIndex];
        return [
            ...cardsArr.slice(0, namedCardMatchIndex),
            {
                ...namedCardMatch,
                cards: [...namedCardMatch.cards, card],
                editions: namedCardMatch.editions + card.editions.length,
                previewImage: previewEdition.rarity >= 7 ? previewImage : namedCardMatch.previewImage,
            },
            ...cardsArr.slice(namedCardMatchIndex + 1),
        ];
    }, []);
    const typeOrder = Object.values(CustomType);
    const sortedUniqueCards = [...cardsWithUniqueNames].sort((a, b) => {
        if (a.type !== b.type) {
            const aIndex = typeOrder.findIndex(entry => entry === a.type);
            const bIndex = typeOrder.findIndex(entry => entry === b.type);
            if (aIndex === -1) {
                throw new Error(`Unhandled deck sort type: ${a.type}`);
            }
            if (bIndex === -1) {
                throw new Error(`Unhandled deck sort type: ${b.type}`);
            }
            return aIndex - bIndex;
        }
        return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
    });
    const templateData = [];
    let prevTemplateType;
    for (let i = 0; i < sortedUniqueCards.length; i++) {
        const { cards, editions, name, previewImage, type, } = sortedUniqueCards[i];
        if (prevTemplateType !== type) {
            prevTemplateType = type;
            templateData.push(`<tr>
<th colspan="2">${type}</th>
</tr>`);
        }
        templateData.push(`<tr style="background-image: url('${previewImage}')">
  <td><a href="https://index.gatcg.com/cards?name=${name.toLowerCase()}">${name}</a></td>
  <td>${cards.length}${editions === 1 ? '' : ` <small>(${editions} variants)</small>`}</td>
</tr>`);
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
};
generateNamedCardsTemplate();
