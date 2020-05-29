import DiscordCommand from './command.js';

export default class PartyCommand extends DiscordCommand {
    async execute() {
        const party = this.getEmojiByName('PepeHypeDance');
        this.message.channel.send(`${party}${party}${party}`);
    }
}