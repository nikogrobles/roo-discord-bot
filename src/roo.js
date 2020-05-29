import Discord from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

export default class RooBot {
    discordClient = new Discord.Client();

    constructor(options) {
        this.discordClient = new Discord.Client(options);
        this.#attachEvents();
    }

    onReady() {
        console.log(`Logged in as ${this.discordClient.user.tag}!`)
    }

    login(token) {
        return this.discordClient.login(token);
    }

    #attachEvents() {
        this.discordClient.on('ready', () => this.onReady());
        this.discordClient.on('message', msg => this.messagesRouter.routeMessage(msg));
    }

    #routeMessage() {
        this.messagesRouter
    }
}