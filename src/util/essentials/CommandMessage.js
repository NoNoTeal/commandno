const { prefixes, srcDirname } = require('./../config.json');
const Discord = require('discord.js');
const Command = require('./Command');
const Util = require('./Util');
/**
 * @param {Discord.Message} message
 */
module.exports = async (message) => {
  var client = message.client
  if(message.guild) {
    if(client.getGuildPrefix.get(`${message.guild.id}`)) {
      prefixes.push(client.getGuildPrefix.get(`${message.guild.id}`).prefix);
    };
  };
    if (!prefixes.some(prefix => message.content.toLowerCase().startsWith(prefix.toLowerCase())) || message.author.bot) return;
    var prefix = prefixes.filter(p => message.content.toLowerCase().startsWith(p.toLowerCase()))[0];
    var args = message.content.slice(prefix.length).split(/\s+/);
    var commandName = args.shift().toLowerCase();
    var command = client.path.load.get(commandName) || client.path.load.find(cmd => Array.isArray(cmd.aliases) && cmd.aliases.some(alias => alias.toLowerCase() == commandName));
    if (!command) {
    if(!client.path.load.array().some(c => c.fallback === true)) return Util.automsg(`That's not a command, see \`${prefix}help\`.`, message, 10);
    for(var cmd of client.path.load.array()) {
      if(cmd.fallback !== true) continue;
      CommandRun(cmd);
    }} else {
      CommandRun(command)};
  
/**
 * @param {Command} command
 */
function CommandRun(command){    
    if(command.executable(message) !== 'finished') return;
    command.throttle(message.author);
    var args = message.content.split(/\s+/).slice(1);

  try {
    command.run(message, args, message.guild);
  } catch (error) {
      console.error(error);
    message.react(`⚠️`);
  };
  
}; //END OF THE COMMANDRUN FUNCTION



}; //END OF THE FILE