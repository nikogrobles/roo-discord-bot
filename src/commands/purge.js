import DiscordCommand from './command.js';

export default class PartyCommand extends DiscordCommand {

    get channel() {
        return this.message.channel;
    }

    get count() {
        return parseInt(this.args[0], 10);
    }

    get hasCount() {
        return !isNaN(this.count);
    }

    async execute() {
        if (this.hasCount) {
            await this.bulkDeleteLastMessages(this.count);   
        }
    }

    bulkDeleteLastMessages(count) {
        return this.channel.bulkDelete(count);
    }

    bulkDeleteByUser(userMention) {

    }

}