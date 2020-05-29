import DiscordCommand from './command.js';

export default class PartyCommand extends DiscordCommand {
    async execute() {
        const emojis = this.discordClient.emojis.cache || this.discordClient.emojis;
        const party = emojis.find(emoji => emoji.name === "PepeHypeDance");
        this.message.channel.send(`${party}${party}${party}`);
    }
}