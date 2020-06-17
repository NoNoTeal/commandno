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
const child_process = require('child_process');
class restart extends Command {
    constructor(client) {
        super(client, {
            name: 'restart',
            group: 'Util',
            cooldown: 5,
            description: 'Restart the bot',
            details: 'Kills, reinstalls packages, and launches bot. You may not be able to see console messages.',

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
        console.log(`Bot was Restarted by ${message.author.tag} (${message.author.id})`);
        message.channel.send('🔁 Restarting bot...');
        message.client.destroy();
        child_process.exec('npm install', (err, stdo, stde) => {
            if(err) {
                console.log(err);
                process.exit(1);
            }
            if(stdo) {
                console.log(stdo);
            }
            if(stde) {
                console.log(stde);
            }
            child_process.exec('node main.js', (err1, stdo1, stde1) => {
                if(err1) {
                    console.log(err1);
                    process.exit(1);
                }
                if(stdo1) {
                    console.log(stdo1);
                }
                if(stde1) {
                    console.log(stde1);
            }})
        })
    }
}
module.exports = restart;