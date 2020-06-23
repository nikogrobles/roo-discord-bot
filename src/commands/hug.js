import axios from 'axios';
import Discord from 'discord.js';
import DiscordCommand from './command.js';

export default class HugCommand extends DiscordCommand {

  async execute() {
    if (!this.member) {
      this.send("You must be in a Roo Bot enabled Discord server to use this command");
      return;
    }

    const hug = this.getEmojiByName('HugSpin');
    this.message.react(hug);

    let receivers = "";
    const mentionedUsernames = [];

    if (this.hasRoleMentions || this.hasChannelMentions) {
      this.send(`Please use \`\`\`${DiscordCommand.prefix}hug @user @user...\`\`\``);
      return;
    }

    if (this.hasUserMentions) {
      if (this.args.length == this.userMentions.size) {
        this.userMentions.each(user => {
          if (user.displayName == this.member.displayName) {
            mentionedUsernames.push("themself");
          } else {
            mentionedUsernames.push(user.displayName);
          }
        });
        receivers = [
          mentionedUsernames.slice(0, -1).join(', '),
          mentionedUsernames.slice(-1)[0]
        ].join(mentionedUsernames.length < 2 ? '' : ' and ');
      } else {
        this.send(`Please use \`\`\`${this.prefix}hug @user @user...\`\`\``);
        return;
      }
    } else {
      receivers = "themself";
    }

    let searchQuery = "";
    if (mentionedUsernames.length == 0 || mentionedUsernames.length == 1 && mentionedUsernames[0] == "themself") {
      searchQuery = "self+hug";
    }
    else if (mentionedUsernames.length > 1) {
      searchQuery = "group+hug";
    } else {
      searchQuery = "hug";
    }
    axios.get(
      `http://api.giphy.com/v1/gifs/translate?s=${searchQuery}&api_key=${process.env.GIPHY_API_KEY}`
    ).then(response => {
      const hugEmbed = new Discord.MessageEmbed()
        .setColor(this.member.displayHexColor || '#FFF')
        .setAuthor(`${this.member.displayName} gave ${receivers} a hug!`, this.member.user.avatarURL())
        .setThumbnail(hug.url)
        .setImage(`https://media.giphy.com/media/${response.data.data.id}/giphy.gif`);

      this.send(hugEmbed);
    });
  }
}