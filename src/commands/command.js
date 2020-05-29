
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

  constructor(message) {
      const { name, args } = DiscordCommand.parseCommand(message);
      this.message = message;
      this.invokedCommand = name;
      this.args = args;
  }

  async execute() {
    throw new Error('you must define execute on the command class');
  }
}