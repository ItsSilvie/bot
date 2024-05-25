import fetch from 'node-fetch';
import * as fs from 'fs';
import * as https from 'https';
import { getRarityCodeFromRarityId, Rarity } from '../utils/rarity';

const SHOPIFY_CDN_REPO_LOCAL_PATH = '../img.silvie.org/docs';
const stocklistDataPath = `${SHOPIFY_CDN_REPO_LOCAL_PATH}/cdn`;

const cellSeparator = ',';

const generateProductImport = () => {
  if (!fs.existsSync(stocklistDataPath)) {
    fs.mkdirSync(stocklistDataPath);
  }
  
  if (!fs.existsSync(`${stocklistDataPath}/stocklist`)) {
    fs.mkdirSync(`${stocklistDataPath}/stocklist`);
  }

  //  "Option1 Name", "Option1 Value", "Option2 Name", "Option2 Value", "Option3 Name", "Option3 Value", "Variant SKU", "Variant Grams", "Variant Inventory Tracker", "Variant Inventory Policy", "Variant Fulfillment Service", "Variant Price", "Variant Compare At Price", "Variant Requires Shipping", "Variant Taxable", "Variant Barcode", 
  // , "Gift Card", "SEO Title", "SEO Description", "Google Shopping / Google Product Category", "Google Shopping / Gender", "Google Shopping / Age Group", "Google Shopping / MPN", "Google Shopping / Condition", "Google Shopping / Custom Product", "Google Shopping / Custom Label 0", "Google Shopping / Custom Label 1", "Google Shopping / Custom Label 2", "Google Shopping / Custom Label 3", "Google Shopping / Custom Label 4", "Variant Image", "Variant Weight Unit", "Variant Tax Code", "Cost per item", "Included / United Kingdom", "Price / United Kingdom", "Compare At Price / United Kingdom", "Included / International", "Price / International", "Compare At Price / International", "Status"

  const cardData = [];

  const allSets = Object.values(JSON.parse(fs.readFileSync('./src/api-data/sets.json', 'utf8'))) as {
    language: string;
    name: string;
    prefix: string;
  }[];

  const parseSet = (currentSet: typeof allSets[0], options: {
    baseSetCode?: string;
    cardData?: any;
    generateType?: boolean;
    setCode?: string;
    setName?: string;
  } = {}) => {
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
          element: card.element,
          name: card.name,
          number: cardEdition.formattedCollectorNumber ?? `${cardEditionSet.language}-${cardEdition.collector_number}`,
          rarity: getRarityCodeFromRarityId(cardEdition.rarity),
          slug: cardEdition.slug,
          set: cardEdition.set.prefix,
          setName: cardEdition.set.name,
          nonFoil: !!cardCirculations.find(entry => entry.foil !== true),
          foil: !!cardCirculations.find(entry => entry.foil === true),
        };

        cardData.push(setCardDataObj);
      }
    }
  }

  for (let i = 0; i < allSets.length; i++) {
    if (allSets[i].prefix === 'DOApSP') {
      // Ignore this set as it was only released for playing on TTS.
      continue;
    }

    parseSet(allSets[i]);
  }

  console.log(cardData.length);

  for (let i = 0; i < allSets.length; i++) {
    const prefix = allSets[i].prefix;

    if (prefix === 'DOApSP') {
      // Ignore this set as it was only released for playing on TTS.
      continue;
    }

    console.log(prefix);

    const cards = cardData.filter(entry => entry.set === prefix);

    if (!cards.length) {
      return;
    }
      
    const output: string[] = [
      `"Handle", "Title", "Body (HTML)", "Vendor", "Product Category", "Type", "Tags", "Published", "Image Src", "Image Position", "Image Alt Text"`,
    ]

    for (let j = 0; j < cards.length; j++) {
      const card = cards[j];

      const rarity = Rarity[card.rarity]

      const baseCardData = {
        handle: card.slug, // Handle
        title: `${card.number} ${card.name} (${card.rarity})`, // Title
        body: `<p>${card.name} is a ${rarity.toLowerCase()} card in Grand Archive's ${card.setName} set.<p>`, // Body (HTML)
        vendor: 'Weebs of the Shore', // Vendor
        category: 'Arts & Entertainment > Hobbies & Creative Arts > Collectibles > Collectible Trading Cards', // Product Category
        type: 'Trading Card', // Type
        tags: `Set: ${card.set}, Rarity: ${rarity}`, // Tags,
        published: 'FALSE', // Published
        imageSrc: `https://img.silvie.org/cdn/cards/${card.set}/${card.rarity}/${card.number}.jpg`, // Image Src
        imagePosition: '1', // Image Position
        imageAlt: card.name // Image Alt Text
      };

      if (card.nonFoil) {
        output.push([
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
        ].map(entry => `"${entry}"`).join(','));
      }

      if (card.foil) {
        output.push([
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
        ].map(entry => `"${entry}"`).join(','));
      }
    }
  

    fs.writeFileSync(`${stocklistDataPath}/stocklist/${prefix}-shopify.csv`, output.join('\n'), 'utf-8');
  }
}

try {
  generateProductImport();
} catch (e) {
  console.error(e);
}