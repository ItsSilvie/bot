import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { AutocompleteInteraction, CacheType, Client, CommandInteraction } from "discord.js";

export type BotCommand = {
  name: string;
  generator: (subcommand: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder;
  handler: (interaction: CommandInteraction<CacheType>, client: Client<boolean>) => void;
  handleAutocomplete?: (interaction: AutocompleteInteraction<CacheType>, client: Client<boolean>) => Promise<BotAutocompleteResponse[] | void>;
}

export type BotAutocompleteResponse = {
  name: string;
  value: string
}