import { ButtonInteraction, CommandInteraction, MessageAttachment, MessageEmbed } from "discord.js";
import deckEmbed from '../embeds/deck';
import { API_URL } from '../utils/commands';

export const embedDeck = async (interaction: ButtonInteraction | CommandInteraction, url: string, urlType: 'builder') => {
  const urlParts = url.split('/');
  let attachment: MessageAttachment | undefined = undefined;
  let embed: MessageEmbed | undefined = undefined;

  // if (urlType === 'builder') {
    const [,,, creator, deckId, revision] = urlParts;

    const queryParams = new URLSearchParams({
      creator,
      id: deckId,
    });

    if (revision) {
      queryParams.append('revision', revision);
    }

    const deckData = await fetch(`${API_URL}/api/build/v2/deck?${queryParams.toString()}`)
      .then(res => res.json())

    if (!deckData || deckData.error) {
      return interaction.reply({
        content: 'The requested deck failed to load.',
        ephemeral: true,
      });
    }

    if (deckData.private) {
      return interaction.reply({
        content: 'Private decks cannot be shared here.',
        ephemeral: true,
      });
    }

    const deckImage = await fetch(`${API_URL}/api/build/v2/deck/image?${queryParams.toString()}`).then(response => response.blob());

    if (!deckImage || !deckImage.size) {
      return interaction.reply({
        content: 'The requested deck preview failed to load.',
        ephemeral: true,
      });
    }
  
    await interaction.deferReply();

    const deckEmbedData = await deckEmbed(deckData, deckId, deckImage, revision ? Number(revision) : undefined);
    attachment = deckEmbedData.attachment;
    embed = deckEmbedData.embed;
  // }
  
  return interaction.editReply({
    files: [attachment],
    embeds: [embed],
    content: `<@${interaction.member.user.id}> here you go!`,
  });
}