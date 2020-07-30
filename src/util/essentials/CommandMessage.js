const { prefixes, owners } = require('./../config.json');
const Discord = require('discord.js');
const Command = require('./Command');
const Util = require('./Util');
class CommandMessage { 
      /**
     * Constructor Information
     * @param {Client} client The client that instantiated this. (shortcut)
     * @param {Discord.Message} message The message that triggered this
     */
    constructor(client, message) {
      var status = this.constructor.verify(client, message);
      if(status.toLowerCase() !== "ok") return console.log(status); 
      this.constructor.run(client, message)
      /**
       * The client that instantiated this (shortcut)
       * @name Discord.Client
       * @type {Discord.Client}
       * @readonly
       */
      Object.defineProperty(this, 'client', { value: client });
      Object.defineProperty(this, 'message', { value: message });

      /**
	     * The client that instantiated this. (shortcut)
       * @type {Discord.Client}
       */
      this._client = client;
      /**
       * Message that triggered this
       * @type {Discord.Message} 
       */
      this._message = message;
    }

    /**
     * Runs a command
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     */
    static run(client, message) {
      if(client.path.util.maintenance) {
        if(!owners.includes(message.author.id)) return;
      }
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
          this.CommandRun(cmd, message);
        }} else {
          this.CommandRun(command, message)};
    }

    /**
     * Runs a command
     * @param {Command} command
     * @param {Discord.Message} message
     * @private
     */
    static CommandRun(command, message){    
      if(command instanceof Command) {
      if(command.executable(message) !== 'finished') return;
      command.throttle(message.author);
      var args = message.content.split(/\s+/).slice(1);
    try {
      command.run(message, args, message.guild);
    } catch (error) {
      console.error(error);
      message.react(`⚠️`);
    }} else return;};

    /**
     * Verifies supplied parameters are correct.
     * @param {Discord.Client} client 
     * @param {Discord.Message} message 
     * @returns {String}
     */
    static verify(client, message) {
      if(client instanceof Discord.Client) {
        if(message instanceof Discord.Message) {
          return 'OK';
        } else return 'Message is not a D.JS Message.';
      } else return 'Client is not a D.JS Client.';
    }
};
module.exports = CommandMessage;