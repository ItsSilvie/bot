import { MessageEmbed } from "discord.js";
import { CardCost } from "../data/types";
import { getCardBody, getEmbedColorFromElement } from "../utils/card";
import { CardEmbed } from "./types";

const cardEmbed: CardEmbed = (card, set) => {
  const embed = new MessageEmbed()
    .setTitle(`${card.name}`)
    .setDescription(`**${set.year} ${set.name}** · ${card.number ?? 'Unnumbered'}`)
    .setColor(getEmbedColorFromElement(card.element));

  if (card.image) {
    const imageBase = `https://img.silvie.org/sets/${encodeURIComponent(set.filename)}/`;
    const imageExtension = '.png';

    embed.setThumbnail(`${imageBase}${typeof card.image === 'string' ? encodeURIComponent(card.image) : encodeURIComponent(card.name)}${imageExtension}`);
  }

  if (card.effects) {
    embed.addField('\u200B', `${getCardBody(card)}\n\u200B`)
  }

  const costSymbol = card.costType === CardCost.Memory ? '🔵' : '🟡';

  embed.addField(`Cost ${costSymbol}`, `${card.cost}x ${card.costType.toLowerCase()}`, true);
  embed.addField('Element', card.element, true);
  embed.addField('Speed', card.speed ?? '-', true);

  embed.addField('Type', card.type, true);
  embed.addField('Supertype', card.supertype ?? '-', true);
  embed.addField('Subtype', card.subtype ?? '-', true);

  if (card.stats) {
    // @ts-ignore
    embed.addField('Attack', `${card.stats?.attack ?? '-'}`, true);
    // @ts-ignore
    embed.addField('Durability', `${card.stats?.durability ?? '-'}`, true);
    // @ts-ignore
    embed.addField('Health', `${card.stats?.health ?? '-'}`, true);
  }

  if (card.level !== undefined || card.lineage) {
    embed.addField('Level', `${card.level ?? '-'}`, true);
    embed.addField('Lineage', card.lineage ?? '-', true);
    embed.addField('Variant', card.variant ?? '-', true);
  }
  
  if (card.quote) {
    embed.addField('\u200B', `*${card.quote}*\n`);
  }

  let notes = [];

  if (card.notes) {
    notes = [
      ...notes,
      ...(Array.isArray(card.notes) ? card.notes : [card.notes])
    ];
  }

  if (set.notes) {
    notes = [
      ...notes,
      ...(Array.isArray(set.notes) ? set.notes : [set.notes])
    ]
  }

  if (notes.length) {
    embed.setFooter({
      text: notes.join('\n'),
    });
  }

  return embed;
}

export default cardEmbed;