import axios from 'axios';
import DiscordCommand from './command.js';
import { MessageEmbed }from 'discord.js'

export default class PartyCommand extends DiscordCommand {
  async execute() {
    if (!this.member) {
      await this.send("You must be in a Roo Bot enabled Discord server to use this command");
      return;
    }

    const party = this.getEmojiByName('PepeHypeDance');
    await this.message.react(party);

    try {
      const response = await axios.get(
        `http://api.giphy.com/v1/gifs/translate?s=party&api_key=${process.env.GIPHY_API_KEY}`
      );
      const partyEmbed = new MessageEmbed()
        .setColor(this.member.displayHexColor || '#FFF')
        .setAuthor(`${this.member.displayName} is starting the party!`, this.member.user.avatarURL())
        .setThumbnail(party.url)
        .setImage(`https://media.giphy.com/media/${response.data.data.id}/giphy.gif`);

      await this.send(partyEmbed);
    } catch (error) {
      console.log(error);
    }
  }
}