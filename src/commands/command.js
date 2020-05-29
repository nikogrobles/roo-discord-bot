export default class DiscordCommand {
  constructor(message) {
      this.message = message;
  }

  async execute() {
    throw new Error('you must define execute on the command class');
  }
}