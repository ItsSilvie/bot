import { MessageEmbed } from "discord.js";
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { IndexCardElement } from "../data/types";
import { getEmbedColorFromElement } from "../utils/card";
import { IndexEmbed } from "./types";
import * as options from '../api-data/options.json';
import { getPricingData } from "../utils/pricing";

const indexEmbed: IndexEmbed = async (card, edition, circulationTemplate, config) => {
  const {
    collector_number,
    set,
  } = edition;
  
  const embed = new MessageEmbed()
    .setTitle(card.name)
    .setImage(`https://img.silvie.org/api-data/${edition.uuid}.jpg`)
    .setColor(getEmbedColorFromElement(IndexCardElement[card.element]));

  if (config?.imageOnly) {
    embed.setDescription(`${set.name}\n${set.prefix} · ${set.language} — ${collector_number ?? 'Unnumbered'}${edition.rarity ? ` · ${options.rarity.find(entry => `${entry.value}` === `${edition.rarity}`).text}` : '-'}`)
    return embed;
  }

  embed.setDescription(`**[${set.name}](https://index.gatcg.com/cards?prefix=${encodeURIComponent(set.prefix)})**\n${set.prefix} · ${set.language} — ${collector_number ?? 'Unnumbered'}`)
  embed.setURL(`https://index.gatcg.com/edition/${edition.slug}`)
  embed.setAuthor({ name: 'Grand Archive Index', url: 'https://index.gatcg.com' })
  embed.setThumbnail(`https://img.silvie.org/ga-logo.png`)

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

  embed.addField('Rarity', edition.rarity ? options.rarity.find(entry => `${entry.value}` === `${edition.rarity}`).text : '-', true);
  embed.addField('Variant', circulationTemplate.foil ? 'Foil' : '-', true);
  embed.addField('Population', circulationTemplate.uuid === 'none' ? 'UNKNOWN' : `${circulationTemplate.population_operator ?? ''} ${circulationTemplate.population.toLocaleString()}` ?? '-', true);


  embed.addField('Illustrator', `${edition.illustrator ? `[${edition.illustrator}](https://index.gatcg.com/cards?illustrator=${encodeURIComponent(edition.illustrator)})` : '-'}`);

  if (Array.isArray(card.rule)) {
    embed.addField('Rules', card.rule.map(({ date_added, description, title }) => (
      `*${date_added}*${title ? ` · ${title}` : ''}\n${description}`
    )).join('\n\n'));
  }

  const pricingData = await getPricingData(edition.uuid, circulationTemplate.foil ?? false);
  const pricingLabel = `TCGplayer market data (${circulationTemplate.foil ? 'foil' : 'non-foil'})`;

  if ("formattedReply" in pricingData) {
    embed.addField(pricingLabel, pricingData.formattedReply);
  }

  if (edition.flavor || card.flavor) {
    embed.setFooter({
      text: edition.flavor || card.flavor,
    });
  }

  return embed;
}

export default indexEmbed;