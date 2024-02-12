import { MessageEmbed } from "discord.js";
import { IndexCardElement } from "../data/types";
import { getEmbedColorFromElement } from "../utils/card";
import { IndexEmbed } from "./types";
import { getPricingData } from "../utils/pricing";

const pricingEmbed: IndexEmbed = async (card, edition, circulationTemplate) => {
  const {
    collector_number,
    set,
  } = edition;

  const pricingData = await getPricingData(edition.uuid, circulationTemplate.foil);
  const pricingLabel = 'TCGplayer market data';
  
  const embed = new MessageEmbed()
    .setTitle(card.name)
    .setURL(pricingData.data.url)
    .setDescription(`**${set.name}**\n${set.prefix} · ${set.language} — ${collector_number ?? 'Unnumbered'}`)
    .setColor(getEmbedColorFromElement(IndexCardElement[card.element]))
    .setAuthor({ name: 'Grand Archive Index', url: 'https://index.gatcg.com' })
    .setThumbnail(`https://img.silvie.org/web/tcgplayer-logo.png`);

  embed.addField(pricingLabel, pricingData.formattedReply);

  return embed;
}

export default pricingEmbed;