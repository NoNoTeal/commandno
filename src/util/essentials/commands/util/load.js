/* 
 * I see you found my secret command stash! Or so called "secret"
 * stash. You can delete these commands, they're not required,
 * but I would recommend you keep them in. Feel free to change the
 * code as well! Also feel free to use these files as a reference
 * point when you want to make your own commands. If you think you
 * found a bug, report it on the issues tracker or make a pull rq.
 * 
 * (If you are getting rid of these, get rid of the following code
 * in Verify.js):     Command.globalReload(bot, 'util/essentials');
 */
"use strict";
const Command = require('./../../Command.js');
const Discord = require('discord.js');
class load extends Command {
    constructor(client) {
        super(client, {
            name: 'load',
            group: 'Util',
            syntax: 'load <command (aliases supported!)>',
            cooldown: 5,
            description: 'Loads a command',
            details: 'Loads a command that is unloaded. Guild owners cannot do this.',

            ownerOnly: true,
            private: true,
            admin: true,
            reqArgs: true,
        })
    }
    /**
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Guild} guild
     */
    async run(message, args, guild) {
        var path = message.client.path.deleted.get(args.join(' ').toLowerCase()) || message.client.path.deleted.find(cmd => Array.isArray(cmd.aliases) && cmd.aliases.some(alias => alias.toLowerCase() === args.join(' ').toLowerCase()));
        var check = message.client.path.load.get(args.join(' ').toLowerCase()) || message.client.path.load.find(cmd => Array.isArray(cmd.aliases) && cmd.aliases.some(alias => alias.toLowerCase() === args.join(' ').toLowerCase()));
        if(check) return message.channel.send(`Command / alias \`${args.join(' ')}\` is already loaded.`);
        if(!path) return message.channel.send(`Command / alias \`${args.join(' ')}\` couldn't be found.`);
        var command = require(message.client.path.filename.get(path.name.toLowerCase()).replace('src', '../../../..'));
        Command.load(message, command);
    }
}
module.exports = load;