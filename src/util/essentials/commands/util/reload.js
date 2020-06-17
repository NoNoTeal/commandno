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
class reload extends Command {
    constructor(client) {
        super(client, {
            name: 'reload',
            group: 'Util',
            syntax: 'reload <command (aliases supported!)>',
            cooldown: 5,
            description: 'Reload a (or every) command',
            details: 'Reload a command that is unloaded. Guild owners cannot do this.',

            ownerOnly: true,
            private: true,
            admin: true,
        })
    }
    /**
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Guild} guild
     */
    async run(message, args, guild) {
        if(args.join(' ')) {
        var path = message.client.path.deleted.get(args.join(' ').toLowerCase()) || message.client.path.deleted.find(cmd => Array.isArray(cmd.aliases) && cmd.aliases.some(alias => alias.toLowerCase() === args.join(' ').toLowerCase()));
        var check = message.client.path.load.get(args.join(' ').toLowerCase())  || message.client.path.load.find(cmd => Array.isArray(cmd.aliases) && cmd.aliases.some(alias => alias.toLowerCase() === args.join(' ').toLowerCase()));
        if(path) return message.channel.send(`Command / alias \`${args.join(' ')}\` has to be loaded.`);
        if(!check) return message.channel.send(`Command / alias \`${args.join(' ')}\` can't be found.`);
        var command = require(message.client.path.filename.get(check.name.toLowerCase()).replace('src', '../../../..'));
        Command.reload(message, command);
        } else {
            try{
            let count = 0;
            let t = 0;
            for(var c of message.client.path.load.array()) {
                if(c instanceof Command) {
                    if(c.admin) continue;
                    t++;
                    delete require.cache[require.resolve(message.client.path.filename.get(c.name.toLowerCase()).replace('src', '../../../..'))];
                    message.client.path.deleted.set(c.name.toLowerCase(), c);
                    message.client.path.load.delete(c.name.toLowerCase());
                    c = require(message.client.path.filename.get(c.name.toLowerCase()).replace('src', '../../../..'));
                    if(c.prototype instanceof Command) {
                        c = new c(message.client);
                        message.client.path.load.set(c.name.toLowerCase(), c);
                        message.client.path.deleted.delete(c.name.toLowerCase());
                        count++;
                }} continue;
            }
            message.channel.send(`Reloaded \`${count}/${t}\` commands.`);
            } catch (e) {console.error(e); message.channel.send(`An error has occurred. Check \`console\` for details.`)}
        }
    }
}
module.exports = reload;