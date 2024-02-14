import { MessageEmbed } from "discord.js";
import { IndexCardElement } from "../data/types";
import { getEmbedColorFromElement } from "../utils/card";
import { IndexEmbed } from "./types";
import * as options from '../api-data/options.json';
import { getPricingData } from "../utils/pricing";
import * as dayjs from 'dayjs';
import * as relativeTimePlugin from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTimePlugin);

const indexEmbed: IndexEmbed = async (card, edition, config) => {
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

  embed.setDescription(`**[${set.name}](https://index.gatcg.com/cards?prefix=${encodeURIComponent(set.prefix)})**\n${set.prefix} · ${set.language} — ${collector_number ?? 'Unnumbered'}${edition.rarity ? ` · ${options.rarity.find(entry => `${entry.value}` === `${edition.rarity}`).text}` : '-'}${edition.flavor || card.flavor ? (
    `\n\n*${edition.flavor || card.flavor}*`
  ) : ''}`)
  embed.setURL(`https://index.gatcg.com/edition/${edition.slug}`)
  embed.setAuthor({ name: 'Grand Archive Index', url: 'https://index.gatcg.com' })

  const pricingData = await getPricingData(edition.uuid, true);

  const foilCirculation = [...edition.circulationTemplates, ...edition.circulations].find(entry => entry.foil);
  const nonFoilCirculation = [...edition.circulationTemplates, ...edition.circulations].find(entry => !entry.foil);

  if (!!nonFoilCirculation) {
    embed.addField('Non-foil', `Population: ${nonFoilCirculation.population_operator ?? ''} ${nonFoilCirculation.population.toLocaleString()}${nonFoilCirculation.printing ? ' (printing)' : ''}${pricingData.nonFoil ? (
      `\n${pricingData.nonFoil}`
    ) : ''}`);
  }

  if (!!foilCirculation) {
    embed.addField('Foil', `Population: ${foilCirculation.population_operator ?? ''} ${foilCirculation.population.toLocaleString()}${foilCirculation.printing ? ' (printing)' : ''}${pricingData.foil ? (
      `\n${pricingData.foil}`
    ) : ''}`);
  }

  embed.addField('Illustrator', `${edition.illustrator ? `[${edition.illustrator}](https://index.gatcg.com/cards?illustrator=${encodeURIComponent(edition.illustrator)})` : '-'}`);

  if (Array.isArray(card.rule)) {
    embed.addField('Rules', card.rule.map(({ date_added, description, title }) => (
      `*${date_added}*${title ? ` · ${title}` : ''}\n${description}`
    )).join('\n\n'));
  }


  if (!!pricingData.nonFoil || !!pricingData.foil) {
    embed.setFooter({
      text: `${!!edition.last_update ? `Card updated on Index ${dayjs(edition.last_update).fromNow()}` : `Card has no last update date on Index`}.\nPrices ${pricingData.updated.toLowerCase()}\nUse '/silvie pricing' for detailed market informaiton.`,
    });
  }

  return embed;
}

export default indexEmbed;