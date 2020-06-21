import DiscordCommand from './command.js';

export default class WavyCommand extends DiscordCommand {
    async execute() {
        const wavy = this.getEmojiByName('wavy');
        const wavyLeft = this.getEmojiByName('wavyLeft');
        this.message.channel.send(`${wavy} ${wavyLeft}`);
    }
}