import Command from "../commands/command";

export default class MessagesRouter {
    commandPrefix = Command.prefix;

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
        const routingStruct = this.#createRoutingStruct(executor, options);
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
        const routingStruct = this.#createRoutingStruct(executor, options);
        this.#regexRegistry.set(regex, routingStruct)
    }
    
    matchExtact(str, executor, options = {}) {
        const routingStruct = this.#createRoutingStruct(executor, options);
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
            const { name } = Command.parseCommand(message.content)
            const commandKey = this.#findMatchingCommand(commandName);
            routingStruct = this.#commandRegistry.get(commandKey);
        } else {
            const stringAction = this.#findMatchingString(message.content);
            routingStruct = this.#stringRegistry.get(stringAction);

            if (!routingStruct) {
                const regex = this.#findMatchingRegex(message.content);
                routingStruct = this.#regexRegistry.get(regex);
            }            
        }

        if (routingStruct) {
            return await this.#execute(message, routingStruct);
        } else {
            return false;
        }
    }

    async #execute(message, routingStruct) {
        const { executor, options, isCommandClass } = routingStruct;

        try {
            if (isCommandClass) {
                const command = new executor(message, options);
                await command.execute();
            } else {
                await executor(message, options);
            }
            return true;
        } catch (err) {
            console.error(`
            Error while trying to execute action.
            message content: ${message.content}`);
        }

        return false;
    }

    #findMatchingCommand(commandName) {
        let match;

        for ([commandStr, _] of this.#commandRegistry) {
            let wasMatch = commandName === commandStr;
            if (wasMatch) {
                match = commandStr;
                break;
            }
        }

        return match;
    }

    #findMatchingString(str) {
        let match;

        for ([registeredString, _] of this.#stringRegistry) {
            let wasMatch = str === registeredString;
            if (wasMatch) {
                match = str;
                break;
            }
        }

        return match;
    }

    #findMatchingRegex(str) {
        let match;

        for ([regex, _] of this.#regexRegistry) {
            let wasMatch = regex.test(str);
            if (wasMatch) {
                match = regex;
                break;
            }
        }

        return match;
    }
    
    #createRoutingStruct(executor, options) {
        const isCommandClass = commandExecutor.prototype instanceof Command || commandExecutor === Command;
        const routingStruct = {
            executor,
            isCommandClass,
            options,
        };
        return routingStruct;
    }
}
