import { MessageEmbed } from "discord.js";
import { Card, IndexCard, IndexCirculation, IndexEdition, Set } from "../data/types";

export type CardEmbed = (card: Card, set: Set) => MessageEmbed

export type IndexEmbed = (card: IndexCard, edition: IndexEdition, circulationTemplate: IndexCirculation) => MessageEmbed