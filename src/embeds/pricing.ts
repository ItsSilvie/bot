import { MessageEmbed } from "discord.js";
import { IndexCardElement } from "../data/types";
import { getEmbedColorFromElement } from "../utils/card";
import { IndexEmbed } from "./types";
import { getPricingData } from "../utils/pricing";
import * as options from '../api-data/options.json';
import { PricingData } from "../types";

const pricingEmbed: IndexEmbed = async (card, edition) => {
  const {
    collector_number,
    set,
  } = edition;

  const pricingData = await getPricingData(edition.uuid, undefined) as {
    change?: {
      nonFoil?: {
        directLowPrice: number | null;
        highPrice: number | null;
        lowPrice: number | null;
        marketPrice: number | null;
        midPrice: number | null;
      };
      foil?: {
        directLowPrice: number | null;
        highPrice: number | null;
        lowPrice: number | null;
        marketPrice: number | null;
        midPrice: number | null;
      };
      type: string;
    }
    lowestPrice?: PricingData["lowestPrice"];
    nonFoil?: string;
    foil?: string;
    similar?: PricingData["similar"];
    url: string;
    updated: string;
  };
  
  const embed = new MessageEmbed()
    .setTitle(card.name)
    .setURL(pricingData?.url)
    .setDescription(`**${set.name}**\n${set.prefix} · ${set.language} — ${collector_number ?? 'Unnumbered'}${edition.rarity ? ` · ${options.rarity.find(entry => `${entry.value}` === `${edition.rarity}`).text}` : '-'}`)
    .setColor(getEmbedColorFromElement(IndexCardElement[card.element]))
    .setAuthor({ name: 'TCGplayer Market Data', url: `https://tcgplayer.pxf.io/KjAXg9?u=${encodeURIComponent('https://www.tcgplayer.com/search/grand-archive/product?productLineName=grand-archive&view=grid')}` });

  if (pricingData?.nonFoil) {
    embed.addField(`Non-foil`, pricingData.nonFoil);
  }

  if (pricingData?.foil) {
    embed.addField(`Foil`, pricingData.foil);
  }

  if (pricingData?.similar) {
    if (pricingData.similar.quantity === 1) {
      // This is the only edition of this card.
      embed.addField('Insights', `This is [the only version](${pricingData.similar.url}) on TCGplayer.`);
    } else {
      embed.addField('Insights', `TCGplayer lists [${pricingData.similar.quantity} versions](${pricingData.similar.url}) of this card.
${pricingData.lowestPrice ? (
        `Cheapest: [$${pricingData.lowestPrice.price.toFixed(2)}](${pricingData.lowestPrice.url})`
      ) : (
        `This one has the lowest price`
      )}.`);
    }
  }

  if (!pricingData?.nonFoil && !pricingData?.foil) {
    embed.addField('Pricing data unavailable', 'This card does not appear to be available on TCGplayer.');
  } else {
    embed.setImage(`https://img.silvie.org/web/powered-by-tcgplayer.png`);
    embed.setFooter({
      text: `${pricingData?.updated}\nAffiliate links help keep Silvie.org online.`,
    });
  }

  return embed;
}

export default pricingEmbed;