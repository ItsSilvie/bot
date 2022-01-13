import { MessageEmbed } from "discord.js";
import { Card, Set } from "../data/types";

export type CardEmbed = (card: Card, set: Set) => MessageEmbed