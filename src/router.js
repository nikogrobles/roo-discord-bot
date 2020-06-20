import MessagesRouter from './routers/messages.js';
import HugCommand from './commands/hug.js';
import PartyCommand from './commands/party.js';
import PurgeCommand from './commands/purge.js';
import WavyCommand from './commands/wavy.js';

const messagesRouter = MessagesRouter.createRoutes(function() {

    this.matchCommand('hug', HugCommand);
    this.matchCommand('party', PartyCommand);
    this.matchCommand('purge', PurgeCommand);
    this.matchCommand('wavy', WavyCommand);

    this.matchExtact('ping', async (message) => {
        message.reply("Pong!");
    });

    this.matchSubstring('fuck niko', async (message) => {
        message.reply("Fuck you :)");
    });
});

export { messagesRouter };