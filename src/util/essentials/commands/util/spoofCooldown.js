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
class spoofCooldown extends Command {
    constructor(client) {
        super(client, {
            name: 'spoofCooldown',
            group: 'Util',
            syntax: 'spoofCooldown <user> <command> <?time>',
            cooldown: 5,
            description: 'Set a user cooldown',
            details: 'Set or clear a user cooldown.',

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
        var user = message.client.users.cache.get(args[0]) || message.mentions.users.first() || message.author;
        if(!user) return message.channel.send(`User not found`)
        if(user.bot) return message.channel.send(`Cannot set cooldown for a bot user.`)
        var check = message.client.path.load.get(args[1].toLowerCase()) || message.client.path.load.find(cmd => Array.isArray(cmd.aliases) && cmd.aliases.some(alias => alias.toLowerCase() === args[1].toLowerCase()));
        if(!check) return message.channel.send(`Command / alias \`${args[1]}\` couldn't be found.`);
        var command = require(message.client.path.filename.get(check.name.toLowerCase()).replace('src', '../../../..'));
        if(command.prototype instanceof Command) {
            command = new command(message.client);
            command.throttle(user, args[2] ? parseInt(args[2]) : Date.now());
            message.channel.send(`Throttled ${user}`, {allowedMentions:{parse:[],users:[],roles:[]}});
        }
    }
}
module.exports = spoofCooldown;