import DiscordCommand from './command.js';

export default class PartyCommand extends DiscordCommand {

    get count() {
        return parseInt(this.args[0], 10);
    }

    get hasCount() {
        return !isNaN(this.count);
    }

    async execute() {
        if (this.hasUserMentions) {
            const deletePromises = this.message.mentions.users.map(user => {
                return this.bulkDeleteByUser(user.id);
            });

            return Promise.all(deletePromises);
        } else if (this.hasCount) {
            await this.bulkDeleteLastMessages(this.count + 1);   
        }
    }

    async bulkDeleteLastMessages(count) {
        if (count > 99) {
            this.message.reply(`Sorry! we only support purging less than 100 msessages at a time!`);
        } else {
            return await this.channel.bulkDelete(count);
        }
    }

    async bulkDeleteByUser(userMentionID) {
        const messages = await this.channel.messages.fetch();
        const messagesToDelete = messages.filter(msg => msg.author.id === userMentionID);
        const deletePromises = messagesToDelete.map(msg => msg.delete());
        return Promise.all(deletePromises);
    }

}