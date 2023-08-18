import { MessageEmbed } from "discord.js";
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { IndexCardElement } from "../data/types";
import { getEmbedColorFromElement } from "../utils/card";
import { IndexEmbed } from "./types";
import * as options from '../api-data/options.json';

const indexEmbed: IndexEmbed = (card, edition, circulationTemplate) => {
  const {
    collector_number,
    set,
  } = edition;
  
  const embed = new MessageEmbed()
    .setTitle(card.name)
    .setURL(`https://index.gatcg.com/edition/${edition.slug}`)
    .setDescription(`**[${set.name}](https://index.gatcg.com/cards?prefix=${encodeURIComponent(set.prefix)})**\n${set.prefix} · ${set.language} — ${collector_number ?? 'Unnumbered'}`)
    .setColor(getEmbedColorFromElement(IndexCardElement[card.element]))
    .setAuthor({ name: 'Grand Archive Index', url: 'https://index.gatcg.com' })
    .setThumbnail(`https://img.silvie.org/ga-logo.png`)
    .setImage(`https://img.silvie.org/api-data/${edition.uuid}.jpg`);

  if (edition.effect || card.effect_raw) {
    embed.addField('\u200B', `${edition.effect ? NodeHtmlMarkdown.translate(edition.effect) : card.effect_raw}\n\u200B`)
  }

  const cardCostIsMemory = card.cost_memory !== null;
  const costSymbol = cardCostIsMemory ? '🔵' : '🟡';

  embed.addField(`Cost ${costSymbol}`, `${cardCostIsMemory ? card.cost_memory : card.cost_reserve}x ${cardCostIsMemory ? 'memory' : 'reserve'}`, true);
  embed.addField('Element', IndexCardElement[card.element] ?? '-', true);
  embed.addField('Speed', typeof card.speed === 'boolean' ? (card.speed ? 'Fast' : 'Slow') : (card.speed ?? '-'), true);

  embed.addField(`Type${!card.types || card.types.length === 1 ? '' : 's'}`, card.types?.join(' ') ?? '-', true);
  embed.addField(`Class${card.classes.length === 1 ? '' : 'es'}`, card.classes?.join(' ') ?? '-', true);
  embed.addField(`Subtype${card.subtypes.length === 1 ? '' : 's'}`, card.subtypes.join(' ') ?? '-', true);

  if (card.power || card.durability || card.life) {
    // @ts-ignore
    embed.addField('Attack', `${card.power ?? '-'}`, true);
    // @ts-ignore
    embed.addField('Durability', `${card.durability ?? '-'}`, true);
    // @ts-ignore
    embed.addField('Life ', `${card.life ?? '-'}`, true);
  }

  embed.addField('Rarity', edition.rarity ? options.rarity.find(entry => `${entry.value}` === `${edition.rarity}`).text: '-', true);
  embed.addField('Variant', circulationTemplate.foil ? 'Foil' : '-', true);
  embed.addField('Population', `${circulationTemplate.population_operator ?? ''} ${circulationTemplate.population.toLocaleString()}` ?? '-', true);


  embed.addField('Illustrator', `${edition.illustrator ? `[${edition.illustrator}](https://index.gatcg.com/cards?illustrator=${encodeURIComponent(edition.illustrator)})` : '-'}`);

  if (Array.isArray(card.rule)) {
    embed.addField('Rules', card.rule.map(({ date_added, description, title }) => (
      `*${date_added}*${title ? ` · ${title}` : ''}\n${description}`
    )).join('\n\n'));
  }
  
  if (edition.flavor || card.flavor) {
    embed.setFooter({
      text: edition.flavor || card.flavor,
    });
  }

  return embed;
}

export default indexEmbed;