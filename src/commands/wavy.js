import axios from 'axios'
import DiscordCommand from './command.js';
import { MessageEmbed }from 'discord.js'

export default class WavyCommand extends DiscordCommand {
  async execute() {
    if (!this.member) {
      await this.send("You must be in a Roo Bot enabled Discord server to use this command");
      return;
    }

    const wavy = this.getEmojiByName('wavy');
    await this.message.react(wavy);

    try {
      const response = await axios.get(
        `http://api.giphy.com/v1/gifs/translate?s=wavy&api_key=${process.env.GIPHY_API_KEY}`
      );
      const wavyEmbed = new MessageEmbed()
        .setColor(this.member.displayHexColor || '#FFF')
        .setAuthor(`${this.member.displayName} be hella wavy`, this.member.user.avatarURL())
        .setThumbnail(wavy.url)
        .setImage(`https://media.giphy.com/media/${response.data.data.id}/giphy.gif`);

      await this.send(wavyEmbed);
    } catch (error) {
      console.log(error);
    }
  }
}