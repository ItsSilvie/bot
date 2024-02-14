import { MessageEmbed } from "discord.js";
import { IndexCardElement } from "../data/types";
import { getEmbedColorFromElement } from "../utils/card";
import { IndexEmbed } from "./types";
import { getPricingData } from "../utils/pricing";
import * as options from '../api-data/options.json';

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
    nonFoil?: string;
    foil?: string;
    url: string;
    updated: string;
  };
  
  const embed = new MessageEmbed()
    .setTitle(card.name)
    .setURL(pricingData?.url)
    .setDescription(`**${set.name}**\n${set.prefix} · ${set.language} — ${collector_number ?? 'Unnumbered'}${edition.rarity ? ` · ${options.rarity.find(entry => `${entry.value}` === `${edition.rarity}`).text}` : '-'}`)
    .setColor(getEmbedColorFromElement(IndexCardElement[card.element]))
    .setAuthor({ name: 'TCGplayer Market Data', url: `https://tcgplayer.pxf.io/KjAXg9?u=${encodeURIComponent('https://www.tcgplayer.com/search/grand-archive/product?productLineName=grand-archive&view=grid')}` })
    .setThumbnail(`https://img.silvie.org/web/tcgplayer-logo.png`);

  if (pricingData?.nonFoil) {
    embed.addField(`Non-foil`, pricingData.nonFoil);
  }

  if (pricingData?.foil) {
    embed.addField(`Foil`, pricingData.foil);
  }

  if (!pricingData?.nonFoil && !pricingData?.foil) {
    embed.addField('Pricing data unavailable', 'This card does not appear to be available on TCGplayer.');
  } else {
    embed.setFooter({
      text: `${pricingData?.updated}\nAffiliate links help keep Silvie.org online.`,
    });
  }

  return embed;
}

export default pricingEmbed;