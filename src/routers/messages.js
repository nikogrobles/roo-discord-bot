import Command from '../commands/command.js';

export default class MessagesRouter {
    type = 'message';
    
    commandPrefix = Command.prefix;

    discordClient = null;

    #commandRegistry = new Map();

    #regexRegistry = new Map();

    #stringRegistry = new Map();

    static createRoutes(callback, options = {}) {
        const instance = new MessagesRouter(options);
        callback.call(instance, instance);
        return instance;
    }

    constructor(options = {}) {
        const {
            prefix
        } = options;
        
        // TODO support multiple command prefixes at the same time
        this.commandPrefix = prefix || this.commandPrefix;
    }

    matchCommand(command, executor, options = {}) {
        const commandString = `${command.toLowerCase()}`;
        const routingStruct = this._createRoutingStruct(executor, options);
        this.#commandRegistry.set(commandString, routingStruct);
    }

    matchSubstring(substring, executor, options={}) {
        const {
            regexOptions = 'gi'
        } = options;
        const forwardedOptions = Object.assign({}, options);
        delete options.regexOptions;
        const regex = new RegExp(`${substring}`, regexOptions);
        this.matchRegex(regex, executor, forwardedOptions);
    }

    matchRegex(regex, executor, options) {
        const routingStruct = this._createRoutingStruct(executor, options);
        this.#regexRegistry.set(regex, routingStruct)
    }
    
    matchExtact(str, executor, options = {}) {
        const routingStruct = this._createRoutingStruct(executor, options);
        this.#stringRegistry.set(str, routingStruct);
    }

    async dispatch(message) {
        const isCommand = Command.isCommand(message)
        const isBot = message.author.bot;

        // maybe we will do something for fun later /shrug
        if (isBot) {
            return false;
        }

        let routingStruct;

        if (isCommand) {
            const { name } = Command.parseCommand(message);
            const commandKey = this._findMatchingCommand(name);
            routingStruct = this.#commandRegistry.get(commandKey);
        } else {
            const stringAction = this._findMatchingString(message.content);
            routingStruct = this.#stringRegistry.get(stringAction);

            if (!routingStruct) {
                const regex = this._findMatchingRegex(message.content);
                routingStruct = this.#regexRegistry.get(regex);
            }            
        }

        if (routingStruct) {
            return await this._execute(message, routingStruct);
        } else {
            return false;
        }
    }

    async _execute(message, routingStruct) {
        const { executor, options, isCommandClass } = routingStruct;
        const exeOpt = Object.assign({}, options, { discordClient: this.discordClient });

        try {
            if (isCommandClass) {

                const command = new executor(message, exeOpt);
                await command.execute();
            } else {
                await executor(message, exeOpt);
            }
            return true;
        } catch (err) {
            console.error(`
            Error while trying to execute action.
            message content: ${message.content}
            Error Message: ${err.message}`);
        }

        return false;
    }

    _findMatchingCommand(commandName) {
        let match;

        for (let [commandStr, _] of this.#commandRegistry) {
            let wasMatch = commandName === commandStr;
            if (wasMatch) {
                match = commandStr;
                break;
            }
        }

        return match;
    }

    _findMatchingString(str) {
        let match;

        for (let [registeredString, _] of this.#stringRegistry) {
            let wasMatch = str === registeredString;
            if (wasMatch) {
                match = str;
                break;
            }
        }

        return match;
    }

    _findMatchingRegex(str) {
        let match;

        for (let [regex, _] of this.#regexRegistry) {
            let wasMatch = regex.test(str);
            if (wasMatch) {
                match = regex;
                break;
            }
        }

        return match;
    }
    
    _createRoutingStruct(executor, options) {
        const isCommandClass = executor.prototype instanceof Command;
        const routingStruct = {
            executor,
            isCommandClass,
            options,
        };
        return routingStruct;
    }
}
