import { MessageEmbed } from "discord.js";
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { IndexCardElement } from "../data/types";
import { getEmbedColorFromElement } from "../utils/card";
import { IndexEmbed } from "./types";

const indexEmbed: IndexEmbed = (card, edition, circulationTemplate) => {
  const {
    collector_number,
    set,
  } = edition;
  
  const embed = new MessageEmbed()
    .setTitle(card.name)
    .setDescription(`**${set.name}** · ${circulationTemplate.name ? `${circulationTemplate.name} ` : ''}${collector_number ?? 'Unnumbered'}`)
    .setColor(getEmbedColorFromElement(IndexCardElement[card.element]));

  embed.setThumbnail(`https://img.silvie.org/api-data/${edition.uuid}.jpg`);

  if (edition.effect || card.effect_raw) {
    embed.addField('\u200B', `${edition.effect ? NodeHtmlMarkdown.translate(edition.effect) : card.effect_raw}\n\u200B`)
  }

  const cardCostIsMemory = card.cost_memory !== null;
  const costSymbol = cardCostIsMemory ? '🔵' : '🟡';

  embed.addField(`Cost ${costSymbol}`, `${cardCostIsMemory ? card.cost_memory : card.cost_reserve}x ${cardCostIsMemory ? 'memory' : 'reserve'}`, true);
  embed.addField('Element', IndexCardElement[card.element] ?? '-', true);
  embed.addField('Speed', typeof card.speed === 'boolean' ? (card.speed ? 'Fast' : 'Slow') : (card.speed ?? '-'), true);

  embed.addField('Type', card.types?.join(' ') ?? '-', true);
  embed.addField('Supertype', card.classes?.join(' ') ?? '-', true);
  embed.addField('Subtype', card.subtypes.join(' ') ?? '-', true);

  if (card.attack || card.durability || card.life) {
    // @ts-ignore
    embed.addField('Attack', `${card.attack ?? '-'}`, true);
    // @ts-ignore
    embed.addField('Durability', `${card.durability ?? '-'}`, true);
    // @ts-ignore
    embed.addField('Life ', `${card.life ?? '-'}`, true);
  }

  embed.addField('Variant', circulationTemplate.foil ? 'Foil' : '-', true);
  embed.addField('Population', `${circulationTemplate.population_operator ?? ''} ${circulationTemplate.population.toLocaleString()}` ?? '-', true);
  embed.addField('Illustrator', `${edition.illustrator ?? '-'}`, true);
  
  if (edition.flavor || card.flavor) {
    embed.addField('\u200B', `*${edition.flavor || card.flavor}*\n`);
  }

  embed.setFooter({
    text: 'This is from Grand Archive\'s Index, available at https://index.gatcg.com.',
  });

  return embed;
}

export default indexEmbed;