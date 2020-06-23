import axios from 'axios';
import Discord from 'discord.js';
import DiscordCommand from './command.js';

export default class PartyCommand extends DiscordCommand {
  async execute() {
    if (!this.member) {
      this.send("You must be in a Roo Bot enabled Discord server to use this command");
      return;
    }

    const party = this.getEmojiByName('PepeHypeDance');
    this.message.react(party);

    axios.get(
      `http://api.giphy.com/v1/gifs/translate?s=party&api_key=${process.env.GIPHY_API_KEY}`
    ).then(response => {
      const partyEmbed = new Discord.MessageEmbed()
        .setColor(this.member.displayHexColor || '#FFF')
        .setAuthor(`${this.member.displayName} is starting the party!`, this.member.user.avatarURL())
        .setThumbnail(party.url)
        .setImage(`https://media.giphy.com/media/${response.data.data.id}/giphy.gif`);

      this.send(partyEmbed);
    });
  }
}