import { MessageEmbed } from "discord.js";
import { IndexCardElement } from "../data/types";
import { getEmbedColorFromElement } from "../utils/card";
import { IndexEmbed } from "./types";
import { getPricingData } from "../utils/pricing";
import * as options from '../api-data/options.json';

const pricingEmbed: IndexEmbed = async (card, edition, circulationTemplate) => {
  const {
    collector_number,
    set,
  } = edition;

  const pricingData = await getPricingData(edition.uuid, undefined) as {
    nonFoil?: string;
    foil?: string;
    url: string;
    updated: string;
  };
  
  const embed = new MessageEmbed()
    .setTitle(card.name)
    .setURL(pricingData.url)
    .setDescription(`**${set.name}**\n${set.prefix} · ${set.language} — ${collector_number ?? 'Unnumbered'}${edition.rarity ? ` · ${options.rarity.find(entry => `${entry.value}` === `${edition.rarity}`).text}` : '-'}`)
    .setColor(getEmbedColorFromElement(IndexCardElement[card.element]))
    .setAuthor({ name: 'Grand Archive Index', url: 'https://index.gatcg.com' })
    .setThumbnail(`https://img.silvie.org/web/tcgplayer-logo.png`)
    .setFooter({
      text: 'Affiliate links are used to help keep Silvie.org online.',
    });

  if (pricingData.nonFoil) {
    embed.addField(`Non-foil`, pricingData.nonFoil);
  }

  if (pricingData.foil) {
    embed.addField(`Foil`, pricingData.foil);
  }

  return embed;
}

export default pricingEmbed;