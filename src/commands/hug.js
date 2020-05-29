import DiscordCommand from './command.js';

export default class HugCommand extends DiscordCommand {
    async execute() {
        const emojis = this.discordClient.emojis.cache || this.discordClient.emojis;
        const hug = emojis.find(emoji => emoji.name === "HugSpin");
        this.message.channel.send(`${hug}`);
    }
}