import MessagesRouter from './routers/messages';
import { HugCommand } from './commands';

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