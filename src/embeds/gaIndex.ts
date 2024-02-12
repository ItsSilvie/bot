import { MessageEmbed } from "discord.js";
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { IndexCardElement } from "../data/types";
import { getEmbedColorFromElement } from "../utils/card";
import { IndexEmbed } from "./types";
import * as options from '../api-data/options.json';
import { PricingData } from "../types";
import { API_URL } from "../utils/commands";
import * as dayjs from 'dayjs';
import * as relativeTimePlugin from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTimePlugin);

const indexEmbed: IndexEmbed = async (card, edition, circulationTemplate) => {
  let pricingData: PricingData | undefined = undefined;

  try {				
    const queryParams = new URLSearchParams({
      id: edition.uuid,
    });

    const apiPricingData = await fetch(`${API_URL}/api/pricing?${queryParams.toString()}`)
      .then(res => res.json())

    if (apiPricingData && !apiPricingData.error && Object.keys(apiPricingData).length > 0) {
      pricingData = apiPricingData;
    }
  } catch (e) {
    console.log(e);
  }

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
  embed.addField('Population', circulationTemplate.uuid = 'none' ? 'UNKNOWN' : `${circulationTemplate.population_operator ?? ''} ${circulationTemplate.population.toLocaleString()}` ?? '-', true);


  embed.addField('Illustrator', `${edition.illustrator ? `[${edition.illustrator}](https://index.gatcg.com/cards?illustrator=${encodeURIComponent(edition.illustrator)})` : '-'}`);

  if (Array.isArray(card.rule)) {
    embed.addField('Rules', card.rule.map(({ date_added, description, title }) => (
      `*${date_added}*${title ? ` · ${title}` : ''}\n${description}`
    )).join('\n\n'));
  }

  const variantPricing = pricingData?.prices[circulationTemplate.foil ? 'foil' : 'nonFoil'];
  const pricingUpdated = !!pricingData ? `*Updated ${dayjs(pricingData.updated).fromNow()}*` : undefined;
  const pricingLabel = 'TCGplayer market data';

  if (variantPricing) {
    const {
      highPrice,
      lowPrice,
      marketPrice,
    } = variantPricing;

    const productURL = `${pricingData.url}${encodeURIComponent(`${pricingData.url.includes(encodeURIComponent('?')) ? '&' : '?'}Printing=${circulationTemplate.foil ? 'Foil' : 'Normal'}`)}`;
    
    embed.addField(pricingLabel, `${marketPrice ? `Recent average: [$${marketPrice.toFixed(2)}](${productURL})` : 'No recent sales'}
${lowPrice ? (
  `Available range: [$${lowPrice.toFixed(2)}](${productURL})${highPrice && highPrice ? ` to [$${highPrice.toFixed(2)}](${productURL})` : ''}`
) : 'None available ([check](${productURL})'}
${pricingUpdated}`);
  } else if (pricingData) {
    embed.addField(pricingLabel, `This card has no ${circulationTemplate.foil ? 'foil' : 'non-foil'} market data available.
${pricingUpdated}`);
  } else {
    embed.addField(pricingLabel, 'This card is not yet available on TCGplayer.');
  }

  if (edition.flavor || card.flavor) {
    embed.setFooter({
      text: edition.flavor || card.flavor,
    });
  }

  return embed;
}

export default indexEmbed;