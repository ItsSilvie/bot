import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { CacheType, CommandInteraction } from "discord.js";

export type BotCommand = {
  name: string
  generator: (subcommand: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder
  handler: (interaction: CommandInteraction<CacheType>) => void
}