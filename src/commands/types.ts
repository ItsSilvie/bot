import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CacheType, Client, CommandInteraction } from "discord.js";

export type BotCommand = {
  name: string
  generator: (subcommand: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder
  handler: (interaction: CommandInteraction<CacheType>, client: Client<boolean>) => void
}