import DiscordCommand from './command.js';

export default class HugCommand extends DiscordCommand {
    async execute() {
        const hug = this.getEmojiByName('HugSpin');
        this.message.channel.send(`${hug}`);
    }
}