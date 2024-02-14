"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const types_1 = require("../data/types");
const card_1 = require("../utils/card");
const options = require("../api-data/options.json");
const pricing_1 = require("../utils/pricing");
const dayjs = require("dayjs");
const relativeTimePlugin = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTimePlugin);
const indexEmbed = async (card, edition, config) => {
    const { collector_number, set, } = edition;
    const embed = new discord_js_1.MessageEmbed()
        .setTitle(card.name)
        .setImage(`https://img.silvie.org/api-data/${edition.uuid}.jpg`)
        .setColor((0, card_1.getEmbedColorFromElement)(types_1.IndexCardElement[card.element]));
    if (config?.imageOnly) {
        embed.setDescription(`${set.name}\n${set.prefix} · ${set.language} — ${collector_number ?? 'Unnumbered'}${edition.rarity ? ` · ${options.rarity.find(entry => `${entry.value}` === `${edition.rarity}`).text}` : '-'}`);
        return embed;
    }
    embed.setDescription(`**[${set.name}](https://index.gatcg.com/cards?prefix=${encodeURIComponent(set.prefix)})**\n${set.prefix} · ${set.language} — ${collector_number ?? 'Unnumbered'}${edition.rarity ? ` · ${options.rarity.find(entry => `${entry.value}` === `${edition.rarity}`).text}` : '-'}${edition.flavor || card.flavor ? (`\n\n*${edition.flavor || card.flavor}*`) : ''}`);
    embed.setURL(`https://index.gatcg.com/edition/${edition.slug}`);
    embed.setAuthor({ name: 'Grand Archive Index', url: 'https://index.gatcg.com' });
    const pricingData = await (0, pricing_1.getPricingData)(edition.uuid, true);
    const foilCirculation = [...edition.circulationTemplates, ...edition.circulations].find(entry => entry.foil);
    const nonFoilCirculation = [...edition.circulationTemplates, ...edition.circulations].find(entry => !entry.foil);
    if (!!nonFoilCirculation) {
        embed.addField('Non-foil', `Population: ${nonFoilCirculation.population_operator ?? ''} ${nonFoilCirculation.population.toLocaleString()}${nonFoilCirculation.printing ? ' (printing)' : ''}${pricingData.nonFoil ? (`\n${pricingData.nonFoil}`) : ''}`);
    }
    if (!!foilCirculation) {
        embed.addField('Foil', `Population: ${foilCirculation.population_operator ?? ''} ${foilCirculation.population.toLocaleString()}${foilCirculation.printing ? ' (printing)' : ''}${pricingData.foil ? (`\n${pricingData.foil}`) : ''}`);
    }
    embed.addField('Illustrator', `${edition.illustrator ? `[${edition.illustrator}](https://index.gatcg.com/cards?illustrator=${encodeURIComponent(edition.illustrator)})` : '-'}`);
    if (Array.isArray(card.rule)) {
        embed.addField('Rules', card.rule.map(({ date_added, description, title }) => (`*${date_added}*${title ? ` · ${title}` : ''}\n${description}`)).join('\n\n'));
    }
    if (!!pricingData.nonFoil || !!pricingData.foil) {
        embed.setFooter({
            text: `${!!edition.last_update ? `Card updated on Index ${dayjs(edition.last_update).fromNow()}` : `Card has no last update date on Index`}.\nPrices ${pricingData.updated.toLowerCase()}\nUse '/silvie pricing' for detailed market informaiton.`,
        });
    }
    return embed;
};
exports.default = indexEmbed;
