import { MessageAttachment, MessageEmbed } from "discord.js";
import { API_URL } from "../utils/commands";
import * as dayjs from 'dayjs';
import * as relativeTimePlugin from 'dayjs/plugin/relativeTime';
import * as advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);
dayjs.extend(relativeTimePlugin);

const deckEmbed = async (deckData, deckId: string, image: Blob, revision?: number) => {
  const embed = new MessageEmbed()
    .setTitle(deckData.name)
    .setURL(`https://build-v2.silvie.org/@${encodeURIComponent(deckData.creator.displayName)}/${deckId}${revision ? `/${revision}` : ''}`)
    .setDescription(`Last updated: ${dayjs(deckData.updated ?? deckData.created).format('Do MMMM YYYY')}.`)
    .setAuthor({ name: `@${deckData.creator.displayName} on the Silvie.org Deck Builder`, url: `https://build-v2.silvie.org/@${encodeURIComponent(deckData.creator.displayName)}` });

  const queryParams = new URLSearchParams({
    creator: `@${deckData.creator.displayName}`,
    id: deckId,
  });

  if (revision) {
    queryParams.append('revision', `${revision}`);
  }

  const buffer = Buffer.from(await image.arrayBuffer());
  const attachment = new MessageAttachment(buffer, 'img.png');
  embed.setImage(`attachment://img.png`);

  embed.setFooter({
    text: 'This command is mostly a work in progress.',
  })

  return {
    attachment,
    embed,
  };
}

export default deckEmbed;