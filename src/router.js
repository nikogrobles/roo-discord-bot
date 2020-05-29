import MessagesRouter from './routers/messages.js';
import HugCommand from './commands/hug.js';

const messagesRouter = MessagesRouter.createRoutes(function() {

    this.matchCommand('hug', HugCommand);

    this.matchExtact('ping', async (message) => {
        message.reply("Pong!");
    });

    this.matchSubstring('fuck niko', async (message) => {
        message.reply("Fuck you :)");
    });
});

export { messagesRouter };