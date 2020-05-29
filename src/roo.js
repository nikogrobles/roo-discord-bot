import Discord from 'discord.js';
import dotenv from 'dotenv';
import * as routers from './router.js';
import MessagesRouter from './routers/messages.js';

dotenv.config();

const EVENT_ROUTER_MAP = {
    message: 'message'
};

export default class RooBot {
    discordClient = new Discord.Client();

    #routerRegistry = new Map();

    constructor(options) {
        this.discordClient = new Discord.Client(options);
        this._attachEvents();
    }

    registerRouters(routers) {
        Object.keys(routers).forEach(routerName => {
            const router = routers[routerName];
            this._registerRouter(router);
        });
    }

    onReady() {
        console.log(`Logged in as ${this.discordClient.user.tag}!`)
    }

    login(token) {
        return this.discordClient.login(token);
    }

    _registerRouter(router) {
        const routerType = router.type;
        const routers = this.#routerRegistry.get(routerType) || [];

        if (!routers.includes(router)) {
            this.#routerRegistry.set(routerType, [...routers, router]);
        }
    }

    _attachEvents() {
        this.discordClient.on('ready', () => this.onReady());

        Object.keys(EVENT_ROUTER_MAP).forEach(eventName => {
            this.discordClient.on(eventName, (...args) => {
                const routerType = EVENT_ROUTER_MAP[eventName];
                const routers = this.#routerRegistry.get(routerType) || [];
                routers.forEach(router => router.dispatch(...args));
            });
        });
    }
}

export function run() {
    const rooBot = new RooBot();
    rooBot.registerRouters(routers);
    rooBot.login(process.env.DISCORD_BOT_TOKEN);      
}