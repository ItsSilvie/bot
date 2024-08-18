import * as sets from '../api-data/sets.json';
import { AutocompleteInteraction, CacheType } from "discord.js";

export const unauthenticatedMessage = 'This command requires your Discord account to be linked to your Silvie.org account. You can link your Discord account at https://portal.silvie.org.';

export const API_URL = 'https://api.silvie.org';

export const handleSetAutocomplete = async (interaction:  AutocompleteInteraction<CacheType>, setListOverride?: {
  [key: string]: {
    name: string;
    prefix: string;
  }
}) => {
  const focusedOption = interaction.options.getFocused(true);
  const choices = [...Object.values(setListOverride ?? sets)].sort(({ name: aName }, { name: bName }) => {
    return aName < bName ? -1 : 1;
  });

  const filtered = choices.filter(choice => choice.name.toLowerCase().includes(`${focusedOption.value}`.toLowerCase()) || choice.prefix.toLowerCase().includes(`${focusedOption.value}`.toLowerCase()));
  
  return await interaction.respond(
    filtered.map(choice => ({ name: choice.name, value: choice.prefix })),
  );
}