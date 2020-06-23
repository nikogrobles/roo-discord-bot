
const ARG_SPLIT_REGEX = / +/;

export default class DiscordCommand {
  static get prefix() {
    return process.env.DISCORD_COMMAND_PREFIX || '/';
  } 

  static isCommand(message) {
    return message.content.startsWith(DiscordCommand.prefix);
  }

  static parseCommand(message) {
    const commandTokens = message.content.slice(DiscordCommand.prefix.length).split(ARG_SPLIT_REGEX);
    const [commandName, ...commandArgs] = commandTokens;
    return { name: commandName, args: commandArgs };
  }

  constructor(message, options = {}) {
      const { name, args } = DiscordCommand.parseCommand(message);
      const {
        discordClient
      } = options;
      this.message = message;
      this.invokedCommand = name;
      this.args = args;
      this.discordClient = discordClient;
  }

  get member() {
    return this.message.member;
  }

  get hasChannelMentions() {
    return this.message.mentions.channels.size > 0;
  }

  get hasRoleMentions() {
    return this.message.mentions.roles.size > 0;
  }

  get hasUserMentions() {
    return this.message.mentions.users.size > 0;
  }

  get channelMentions() {
    return this.message.mentions.channels;
  }

  get roleMentions() {
    return this.message.mentions.roles;
  }

  get userMentions() {
    return this.message.mentions.members;
  }

  get channel() {
    return this.message.channel;
  }

  get emojis() {
    return this.discordClient.emojis.cache || this.discordClient.emojis;
  }

  getEmojiByName(name) {
    return this.emojis.find(emoji => emoji.name === name);
  }

  send(message) {
    this.message.channel.send(message);
  }

  async execute() {
    throw new Error('you must define execute on the command class');
  }
}