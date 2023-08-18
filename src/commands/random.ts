import * as path from 'path';
import { Card, IndexCard, IndexCirculation, IndexEdition } from '../data/types';
import cardEmbed from '../embeds/card';
import { shuffleArray } from '../utils/array';
import { BotCommand } from './types';
import * as sets from '../api-data/sets.json';
import indexEmbed from '../embeds/gaIndex';

const command = <BotCommand>{
  name: 'random',
  generator: (subcommand) => {
    return subcommand
      .setName(command.name)
      .setDescription('Reveals a Grand Archive card at random.')
      .addStringOption(option => {
        [...Object.values(sets)].sort(({ name: aName }, { name: bName }) => {
          return aName < bName ? -1 : 1;
        }).forEach(({ name, prefix }) => {
          option.addChoice(name, prefix)
        });
  
        return option
          .setName('set')
          .setDescription('Only include cards from a certain set?')
          .setRequired(false);
      })
  },
  handler: async (interaction, client) => {
    let messages = [];

    if (interaction.guild.me.permissions.has('USE_EXTERNAL_EMOJIS')) {
      messages = [
        "<:wow_silvie:918934079435583519>",
        "<:shocked_silvie:918934079104245851>",
        "<:cry_silvie:918934079481712690>",
      ];
    } else {
      messages = [
        'Here you go!',
        'Check this out!',
        'Look what I found!'
      ];
    }

    const filename = interaction.options.getString('set');
    let set;

    if (filename) {
      set = sets[filename];

      if (!filename || !set) {
        return interaction.reply({
          content: 'I can\'t find that set.',
        });
      }
    } else {
      set = sets[shuffleArray([...Object.keys(sets)])[0]];
    }
  
    const cards = await import(path.resolve(__dirname, `../api-data/${set.prefix}.json`));

    if (!cards) {
      return interaction.reply({
        content: 'Something went wrong, please try again!',
      });
    }

    const match = shuffleArray([...cards])[0] as IndexCard;
    const edition = shuffleArray([...match.editions.filter(edition => edition.set.prefix === set.prefix)])[0] as IndexEdition;
    const circulation = shuffleArray([...edition.circulationTemplates, ...edition.circulations])[0] as IndexCirculation;

    return interaction.reply({
      embeds: [indexEmbed(match, edition, circulation)],
      content: shuffleArray([...messages])[0],
    });
  },
}

export default command;