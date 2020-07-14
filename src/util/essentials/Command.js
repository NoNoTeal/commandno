const Discord = require('discord.js');
const PermissionFlags = Object.keys(Discord.Permissions.FLAGS);
const { prefixes, owners } = require('./../config.json');
const fs = require('fs');
const Util = require('./Util');
class Command {
    /**
     * Client that this command was made under.
     * @typedef {Discord.Client} Client
     */

    /**
     * Channels this command is allowed in:
     * * guild
     * * direct
     * * text
     * * news
     * @typedef {'guild'|'direct'|'text'|'news'} channelType
     */

    /**
     * Permissions
     * @typedef {Discord.PermissionResolvable} PermissionType 
     */

    /**
     * @typedef {object} CommandInfo
     * @property {Discord.Client} _client Client that made the command (shortcut)
     * @property {string} name Name of the command
     * @property {string} group Group the command is in 
     * @property {string[]} aliases Names that link to this command
     * @property {string} syntax Syntax of the command
     * @property {number} cooldown Amount of seconds user needs to wait before executing command again
     * @property {boolean} nsfw If the command can only be used in nsfw channels or only outside of NSFW channels. `true` = only inside of NSFW channels, `false` = only outside of NSFW channels, `null` = can be used in either.
     * @property {boolean} reqArgs If the command requires arguments.
     * @property {channelType[]} channelOnly The types of channels this command can only be used in.
     * @property {string} description Short description of the command.
     * @property {string} details Long description of the command.
     * @property {PermissionType[]} requires Permissions the client requires. (Put "true" as the first item if the bot needs to have all permissions listed)
     * @property {PermissionType[]} userrequires Permissions the executor requires. (Put "true" as the first item if the user needs to have all permissions listed)
     * @property {boolean} private If the command is hidden from the help command,
     * @property {boolean} admin If the command cannot be disabled.
     * @property {boolean} fallback If the command is executed if a unknown command is sent,
     * @property {boolean} ownerOnly If the command can only be used by the bot owners in the botconfig.
     */

    /**
     * Constructor Information
     * @param {Client} client The client that instantiated this. (shortcut)
     * @param {CommandInfo} info Command info.
     */
    constructor(client, info) {
      this.constructor.validateCMD(client, info);
      /**
       * The client that instantiated this (shortcut)
       * @name Discord.Client
       * @type {Discord.Client}
       * @readonly
       */
      Object.defineProperty(this, 'client', { value: client });

   /**
	* The client that instantiated this. (shortcut)
    * @type {Discord.Client}
    * @private
    */
    this._client = client;

   /**
    * Name of command
    * @type {string}
    * @example helloworld
    */
   this.name = info.name;

   /**
    * Group the command is in
    * @type {string}
    * @example Test Group
    */
   this.group = info.group || 'None';

   /**
    * Aliases associated to the command
    * @type {?string[]}
    * @example ['hw', 'hiworld']
    */
   this.aliases = info.aliases;

   /**
    * Syntax of command
    * @type {?string}
    * @example helloworld
    */
   this.syntax = typeof info.syntax === 'string' && info.syntax.length ? info.syntax : 'No Syntax Provided';

   /**
    * Command's cooldown (in seconds, not milliseconds)
    * @type {number}
    * @example 5
    */
   this.cooldown = info.cooldown;

   /**
    * If the command should be used only inside or only outside of NSFW channels.
    * @type {boolean} True = Only in NSFW channels, False = Only outside of NSFW Channels. Null = Can be used in either.
    * @example false
    */
   this.nsfw = typeof info.nsfw === 'boolean' ? info.nsfw : null;

   /**
    * If the command always needs arguments
    * @type {boolean} 
    * @example false
    */
   this.reqArgs = info.reqArgs;

   /**
    * Supply a type of channel this can only be used in. Do not mistake this for a boolean, this is a array.
    * @type {?channelType[]}
    * @example ['guild', 'direct', 'text', 'news']
    */
   this.channelOnly = info.channelOnly;

   /**
    * A short description of the command
    * @type {string}
    * @example Prints "Hello world" in your console!
    */
   this.description = typeof info.description === 'string' ? info.description.length ? info.description.length < 100 ? info.description : '*No Description Provided*' : '*No Description Provided*' : '*No Description Provided*'

   /**
    * A long description of the command
    * @type {?string}
    */
   this.details = typeof info.details === 'string' ? info.details.length ? info.details.length < 100 ? info.details : '*No Details Provided*' : '*No Details Provided*' : '*No Details Provided*'

   /**
    * Permissions the bot needs in order to run
    * @type {?PermissionType[]}
    * @example ['SEND_MESSAGES'] (although bot checks beforehand if it can send messages, etc.)
    */
   this.requires = info.requires;

   /**
    * Permissions the user needs in order to run this command
    * @type {?PermissionType[]}
    * @example ['VIEW_CHANNEL'] (although bot checks beforehand if it can send messages, etc.)
    */
   this.userrequires = info.userrequires;

   /**
    * If command cannot be discovered from the help menu
    * @type {boolean}
    * @example false
    */
   this.private = info.private;

   /**
    * If this command is ranked admin (it cannot be unloaded or loaded.)
    * @type {boolean}
    * @example false
    */
   this.admin = info.admin;

   /**
    * If this command is a fallback command when a user executes a command that the bot doesn't have. Setting multiple fallback commands is possible but isn't recommended.
    * @type {boolean}
    * @example false
    */
   this.fallback = info.fallback;

   /**
    * If only the bot owners in the config can use this.
    * @type {boolean}
    * @example true
    */
   this.ownerOnly = info.ownerOnly;
	}

   /**
    * Runs the command
    * @param {Discord.Message} message 
    * @param {string[]} args 
    * @param {Discord.Guild} guild 
    */
    async run(message, args, guild) { // eslint-disable-line no-unused-vars, require-await
        message.channel.send(`Bot Error: \`${this.name}\` does not have a \`async run()\` method. Please let a bot owner fix this.`);
		throw new Error(`Command \`${this.name}\` doesn't have a run() method.`);
    }

   /**
    * Stops the command with a reason.
	* @param {Discord.Message} msg
    * @param {string} reason 
    * @param {object | string | boolean | number} response
    * @param {Command} info 
    * @returns {null}
    * @static
    * @private
    */
    static stop(msg, reason, response, info) {
      let c = []
        switch(reason) {
            case 'nsfw':
                Util.automsg(`Please use the \`${info.name}\` command ${response ? 'inside' : 'outside'} a \`NSFW\` channel.`, msg, 10);
            return;
            case 'reqArgs':
                Util.automsg(`This command requires args. Syntax: \`${info.syntax}\``, msg, 10);
            return;
            case 'channelOnly':
 
                for(var r of response) {
                    if(!['guild','direct','text','news'].includes(r.toLowerCase())) continue;
                    switch(r) {
                        case 'guild':
                            if(c.includes('Guild')) break;
                            c.push('Guild')
                        break;
                        case 'text':
                            if(c.includes('Text')) break;
                            c.push('Text')
                        break;
                        case 'direct':
                            if(c.includes('Direct Message')) break;
                            c.push('Direct Message')
                        break;
                        case 'news':
                            if(c.includes('News')) break;
                            c.push('News')
                        break;
                    }
                }
                Util.automsg(`Please use the \`${info.name}\` command in a \`${c.join('`, `')}\` channel.`, msg, 10);
            return;
            case 'requires':

                Util.automsg(`To use the \`${info.name}\` command, this bot needs more permissions to do this! ***Needs ${response[0] ? 'all' : 'some'} of the permissions: \`${response[1].join(', ').slice(0, 1500)}\`***`, msg, 20);
            return;
            case 'userrequires':
                Util.automsg(`To use the \`${info.name}\` command, you need more permissions to do this! ***Needs ${response[0] ? 'all' : 'some'} of the permissions: \`${response[1].join(', ').slice(0, 1500)}\`***`, msg, 20);
            return;
            case 'admin':
                Util.automsg(`The \`${info.name}\` command cannot be disabled.`, msg, 10);
            return;
            case 'ownerOnly':
                Util.automsg(`The \`${info.name}\` command is for bot owner use only.`, msg, 10);
			return;
			case 'cooldown':
				Util.automsg(`Please wait ${response} before running the \`${info.name}\` command again.`, msg, 10);
            return;
            case 'guildDisabled':
                Util.automsg(`The \`${info.name}\` command is currently disabled in this guild by \`${response}\`.`, msg, 10);
            return;

            case 'guildToggle-NoPerm':
                Util.automsg(`You cannot ${response == 0 ? 'disable' : 'enable'} commands in this guild. Needs \`MANAGE_MESSAGES\`, \`BAN_MEMBERS\`, \`MANAGE_GUILD\`.`, msg, 10);
            return;
            case 'guildToggle-Already':
                Util.automsg(`The \`${info.name}\` command is already ${response[0] == 0 ? 'disabled' : 'enabled'} in this guild ${response[1] ? `by user \`${response[1]}\`` : 'by default'}.`, msg, 10);
            return;
            case 'custom':
                Util.automsg(`${info[0]}`, msg, info[1]);
            return;
        };
    };
    /**
     * Unloads command
     * @param {Discord.Message} msg
     * @param {Command} command
     * @static
     */
    static unload(msg, command) {
        var client = msg.client;
        if(command.prototype instanceof Command) {
        command = new command(msg.client);
        if(command.admin) return msg.channel.send('Provided command cannot be unloaded.');
        try{
        delete require.cache[require.resolve(client.path.filename.get(command.name.toLowerCase()).replace('src', '../..'))];
        client.path.deleted.set(command.name.toLowerCase(), client.path.load.get(command.name.toLowerCase()));
        client.path.load.delete(command.name.toLowerCase());
        return msg.channel.send(`Command \`${command.name}\` was unloaded.`);
        } catch (e) {console.error(e); msg.channel.send(`An error has occurred. Check \`console\` for details.`)}
        } else return msg.channel.send('Provided command is not a command.');
    }
    /**
     * Loads command
     * @param {Discord.Message} msg
     * @param {Command} command
     * @static
     */
    static load(msg, command) {
        var client = msg.client;
        if(command.prototype instanceof Command) {
        command = new command(client);
        if(command.admin) return msg.channel.send('Provided command cannot be loaded.');
        try{
        client.path.load.set(command.name.toLowerCase(), client.path.deleted.get(command.name.toLowerCase()));
        client.path.deleted.delete(command.name.toLowerCase());
        return msg.channel.send(`Command \`${command.name}\` was loaded.`);
        } catch (e) {console.error(e); msg.channel.send(`An error has occurred. Check \`console\` for details.`)}
        } else return msg.channel.send('Provided command is not a command.');
    }
    /**
     * Reloads command
     * @param {Discord.Message} msg
     * @param {Command} command
     * @static
     */
    static reload(msg, command) {
        var client = msg.client;
        if(command.prototype instanceof Command) {
        command = new command(msg.client);
        if(command.admin) return msg.channel.send('Provided command cannot be reloaded.');
        try{
        var path = client.path.filename.get(command.name.toLowerCase()).replace('src', '../..');
        delete require.cache[require.resolve(path)];
        client.path.deleted.set(command.name.toLowerCase(), command);
        client.path.load.delete(command.name.toLowerCase());
        command = require(path);
        if(command.prototype instanceof Command) {
            command = new command(client);
            client.path.load.set(command.name.toLowerCase(), command);
            client.path.deleted.delete(command.name.toLowerCase());
            return msg.channel.send(`Command \`${command.name}\` was reloaded.`);
        } else return msg.channel.send('Command cache was deleted but new "command" is not a command.');
        } catch (e) {console.error(e); msg.channel.send(`An error has occurred. Check \`console\` for details.`)}
    }}
    /**
     * Loads command in a guild
     * @param {Discord.Message} msg
     * @param {Command} command
     * @returns {?Discord.Message} Discord Message
     */
    static guildLoad(msg, command) {
        if(msg.guild) {
            if(command.admin) return Command.stop(msg, [`\`${command.name}\` is an essential command and cannot be guild loaded.`, 10]);
        var getter = command._client.getGuildCommand.get(msg.guild.id, command.name.toLowerCase())
        if(!msg.member.hasPermission('MANAGE_MESSAGES') || !msg.member.hasPermission('BAN_MEMBERS') || !msg.member.hasPermission('MANAGE_GUILD')) return Command.stop(msg, 'guildToggle-NoPerm', 1, command);
        if(!getter) return Command.stop(msg, 'guildToggle-Already', [1], command);
        if(getter.disabled == 0) return Command.stop(msg, 'guildToggle-Already', [1, getter.user], command);
        command._client.setGuildCommand.run({id: `${msg.guild.id}-${command.name.toLowerCase()}`, guild: msg.guild.id, command: command.name.toLowerCase(), disabled: 0, user: `${msg.author.tag} (${msg.author.id})`});
        msg.channel.send(`The \`${command.name}\` command was guild loaded.`);
        } else return msg.channel.send(`**This command is meant for guilds only.**`);
    }
    
    /**
     * Unloads command in a guild
     * @param {Discord.Message} msg
     * @param {Command} command
     * @returns {?Discord.Message} Discord Message
     */
    static guildUnload(msg, command) {
        if(msg.guild) {
        if(command.admin) return Command.stop(msg, [`\`${command.name}\` is an essential command and cannot be guild unloaded.`, 10]);
        var getter = command._client.getGuildCommand.get(msg.guild.id, command.name.toLowerCase());
        if(!msg.member.hasPermission('MANAGE_MESSAGES') || !msg.member.hasPermission('BAN_MEMBERS') || !msg.member.hasPermission('MANAGE_GUILD')) return Command.stop(msg, 'guildToggle-NoPerm', 0, command);
        if(getter) {
        if(getter.disabled == 1) return Command.stop(msg, 'guildToggle-Already', [0, getter.user], command);
        }
        command._client.setGuildCommand.run({id: `${msg.guild.id}-${command.name.toLowerCase()}`, guild: msg.guild.id, command: command.name.toLowerCase(), disabled: 1, user: `${msg.author.tag} (${msg.author.id})`});
        msg.channel.send(`The \`${command.name}\` command was guild unloaded.`);
        } else return msg.channel.send(`**This command is meant for guilds only.**`);
    }

	/**
	 * Checks if the command is executable.
	 * @param {Discord.Message} msg 
	 * @returns {Discord.Message || boolean}
	 */
	executable(msg) {
        if(msg.guild) {
            if(this._client.getGuildCommand.get(msg.guild.id, this.name.toLowerCase())) {
            if(this._client.getGuildCommand.get(msg.guild.id, this.name.toLowerCase()).disabled == 1) return this.constructor.stop(msg, 'guildDisabled', this._client.getGuildCommand.get(msg.guild.id, this.name.toLowerCase()).user, this);
            };
        };
        if(typeof this.cooldown === 'number') {
        if(this._client.getCooldown.get(msg.author.id, this.name.toLowerCase())) {
            if(this._client.getCooldown.get(msg.author.id, this.name.toLowerCase()).timestamp > Date.now() - this.cooldown * 1000) {
            let ts = this._client.getCooldown.get(msg.author.id, this.name.toLowerCase()).timestamp
            let years = Math.trunc((ts - (Date.now() - this.cooldown * 1000)) / 1000 / 60 / 60 / 24 / 365) % 365;
            let weeks = Math.trunc((ts - (Date.now() - this.cooldown * 1000)) / 1000 / 60 / 60 / 24 / 7) % 7;
            let days = Math.trunc((ts - (Date.now() - this.cooldown * 1000)) / 1000 / 60 / 60 / 24) % 24;
            let hours = Math.trunc((ts - (Date.now() - this.cooldown * 1000)) / 1000 / 60 / 60) % 60;
            let minutes = Math.trunc((ts - (Date.now() - this.cooldown * 1000)) / 1000 / 60) % 60;
            let seconds = Math.trunc((ts - (Date.now() - this.cooldown * 1000)) / 1000) % 1000;
            let times = [
                `${years <= 0 ? `` : `\`${years}\` **year(s)**`}`,
                `${weeks <= 0 ? `` : `\`${weeks}\` **week(s)**`}`,
                `${days <= 0 ? `` : `\`${days}\` **day(s)**`}`,
                `${hours <= 0 ? `` : `\`${hours}\` **hour(s)**`}`,
                `${minutes <= 0 ? `` : `\`${minutes}\` **minute(s)**`}`,
                `${seconds <= 0 ? `` : `\`${seconds}\` **second(s)**`}`,
            ].filter(i => i.length).join(', ');
            times = times.length ? times : `a moment`;
            return this.constructor.stop(msg, 'cooldown', `${times}`, this)};
        }}
        if(this.ownerOnly === true) {
			if(!owners.includes(msg.author.id)) return this.constructor.stop(msg, 'ownerOnly', null, this)
		}
        if(msg.guild) {
            if(!msg.guild.me.hasPermission('SEND_MESSAGES') || 
            !msg.guild.me.hasPermission('READ_MESSAGE_HISTORY') || 
            !msg.guild.me.hasPermission('VIEW_CHANNEL') ||
            !msg.guild.me.hasPermission('ATTACH_FILES') || 
            !msg.guild.me.hasPermission('EMBED_LINKS')) return

            if(Array.isArray(this.requires)) {
                var needs = this.requires
                var per = [];
                  if(needs[0] == true) {
                    for(var n of needs) {
                        if(!PermissionFlags.includes(n)) continue;
                        if(per.includes(n)) continue;
                        per.push(n);
                    }
                    if(!per.every(p => msg.guild.me.hasPermission(p))) return this.constructor.stop(msg, 'requires', [true, per], this);
                  } else {
                      for(var n of needs) {
                          if(!PermissionFlags.includes(n)) continue;
                          if(per.includes(n)) continue;
                          per.push(n);
                      }
                    if(!per.some(p => msg.guild.me.hasPermission(p))) return this.constructor.stop(msg, 'requires', [false, per], this);
                  }
            }
            if(Array.isArray(this.userrequires)) {
                var permissions = this.userrequires
                var per = []
                if(permissions[0] == true) {
                    for(var p of permissions) {
                        if(!PermissionFlags.includes(p)) continue;
                        if(per.includes(p)) continue;
                        per.push(p);
                    }
                    if(!per.every(p => msg.member.hasPermission(p))) return this.constructor.stop(msg, 'userrequires', [true, per], this);
                } else {
                    for(var p of permissions) {
                        if(!PermissionFlags.includes(p)) continue;
                        if(per.includes(p)) continue;
                        per.push(p);
                    }
                    if(!per.some(p => msg.member.hasPermission(p))) return this.constructor.stop(msg, 'userrequires', [false, per], this);
                }
            }
        }
        if(Array.isArray(this.channelOnly)) {
            let verifiedchannels = false;
            let channels = [];
            for(var channel of this.channelOnly) {
                if(!['guild','direct','text','news'].includes(channel.toLowerCase())) continue;
                if(channels.includes(channel.toLowerCase())) continue;
                switch(channel.toLowerCase()) {
                    case 'guild':
                        if(msg.channel instanceof Discord.GuildChannel) verifiedchannels = true;
                    break;
                    case 'direct':
                        if(msg.channel instanceof Discord.DMChannel) verifiedchannels = true;
                    break;
                    case 'text':
                        if(msg.channel instanceof Discord.TextChannel) verifiedchannels = true;
                    break;
                    case 'news':
                        if(msg.channel instanceof Discord.NewsChannel) verifiedchannels = true;
                    break;
                };
                channels.push(channel.toLowerCase())
            }

            if(verifiedchannels !== true) return this.constructor.stop(msg, 'channelOnly', channels, this)

        }
        if(this.nsfw !== null) {
            switch(this.nsfw) {
                case true:
                    if(!msg.channel.nsfw) return this.constructor.stop(msg, 'nsfw', this.nsfw, this);
                break;
                case false:
                    if(msg.channel.nsfw) return this.constructor.stop(msg, 'nsfw', this.nsfw, this);
                break;
            }
        }
        if(this.reqArgs) {
            var prefix = prefixes.filter(p => msg.content.toLowerCase().startsWith(p.toLowerCase()))[0];
            var name = msg.content.slice(prefix.length).split(/\s+/).shift();
            if(!msg.content.split(`${prefix}${name}`).join(' ').split(/\s+/).slice(1)[0].length) return this.constructor.stop(msg, 'reqArgs', null, this)
        }

        return 'finished';

    }

    /**
     * Cooldown a user.
     * @param {Discord.User} author 
     * @param {Date} now 
     * @returns {void}
     * @private
     */
    throttle(author, now = Date.now()) {
        var cd = this._client.getCooldown.get(author.id, this.name.toLowerCase());
        if(!cd) {
            cd = {
                id: `${author.id}-${this.name.toLowerCase()}`,
                user: author.id,
                command: this.name.toLowerCase(),
                timestamp: now
            };
        } else {
            cd.timestamp = now
        }
        this._client.setCooldown.run(cd);
        return;
    } 

    /**
     * @param {Array} array 
     * @param {?} value 
     * @returns {number}
     * @static
     */
    static countInArray(array, value) {
        return array.reduce((n, x) => n + (x === value), 0);
    }

    /**
     * Fetches all commands and validates names.
     * @param {Discord.Client} bot 
     * @param {string} d folder name
     * @param {boolean} clearAll
     */
    static globalReload(bot, d, clearAll = false) {
    if(!fs.readdirSync(`./src/${d}/commands`)) return;
    if(clearAll) {
        bot.path.load.clear();
        bot.path.filename.clear();
    }
    function find(arr1, arr2) { 
        return arr1.some(r=> arr2.indexOf(r) >= 0);
    }
    function getAllFiles(dirPath, arrayOfFiles) {
        var files = fs.readdirSync(dirPath)
       
        arrayOfFiles = arrayOfFiles || []
       
        files.forEach(function(file) {
          if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
          } else {
            if(!file.endsWith('.js')) return;
            if(!fs.statSync(dirPath + "/" + file).isFile()) return;
            arrayOfFiles.push(dirPath + '/' + file)
          }
        })
        return arrayOfFiles;
      };
      var paths = getAllFiles(`./src/${d}/commands`);
      var names = [];
      var aliases = [];
      for(var path of paths) {
        var command = require(`${path.replace('src', '../..')}`);
        if(command.prototype instanceof Command) {
            command = new command(bot);
          bot.path.load.set(command.name.toLowerCase(), command);
          bot.path.filename.set(command.name.toLowerCase(), path)
          if(Array.isArray(command.aliases)) {
            command.aliases.forEach(a => {
                aliases.push(a.toLowerCase());
            });
          }
          names.push(command.name.toLowerCase());
        } else continue;
      };
      if(find(names, aliases)) throw new TypeError(`Command names or aliases cannot match each other.`);
      for(var name of names) {
        if(this.countInArray(names, name) > 1) throw new TypeError(`Command name ${name} cannot be used more than once.`);
      };
    };

    /**
     * Ensures the command is ready to run and is up to standards before running it.
     * @param {Discord.Client} client 
     * @param {CommandInfo} info 
     * @returns {void}
     * @static
     * @private
     */
    static validateCMD(client, info) {
        function hasWhiteSpace(s) {
            return /\s/g.test(s);
        }
        if(!client) throw new Error('Client wasn\'t specified.');
        if(typeof info !== 'object') throw new TypeError('Cannot get command info. (Needs to be an object)');
        if(!info.name.length) throw new TypeError('Command name is missing.');
        if(typeof info.name !== 'string') throw new TypeError('Command name is not a string.');
        if(info.name.length > 1000) throw new RangeError('Command name is too long.');
        if(hasWhiteSpace(info.name)) throw new TypeError('Command name cannot have spaces.');

        if(info.group) {
        if(typeof info.group !== 'string') throw new TypeError(`Command(${info.name})'s group is not a string.`);
        if(info.group.length > 20) throw new TypeError(`Command(${info.name})'s group is too long.`);
        }

        if(info.aliases) {
        if(typeof info.aliases !== 'object') throw new TypeError(`Command(${info.name})'s aliases is not a array.`); 
        if(!Array.isArray(info.aliases)) throw new TypeError(`Command(${info.name})'s aliases is not an array.`);
        if(info.aliases.length > 20) throw new TypeError(`Command(${info.name})'s aliases cannot be greater than 20.`);
        if(!info.aliases.every(alias => alias.length < 1000)) throw new RangeError(`Command(${info.name})'s aliases cannot contain an alias greater than a length of 1000 characters.`);
        if(!info.aliases.every(alias => typeof alias == 'string')) throw new TypeError(`All of command(${info.name})'s aliases has to be a string.`);
        if(!info.aliases.every(alias => !hasWhiteSpace(alias))) throw new TypeError(`All of command(${info.name})'s aliases cannot have spaces.`);
        }

        if(info.syntax) {
        if(typeof info.syntax !== 'string') throw new TypeError(`Command(${info.name})'s syntax is not a string.`);
        if(info.syntax.length > 100) throw new TypeError(`Command(${info.name})'s syntax is too long.`);
        }

        if(info.cooldown) {
            if(typeof info.cooldown !== 'number') throw new RangeError(`Command(${info.name})'s cooldown is not a number.`);
            if(info.cooldown < 1) throw new RangeError(`Command(${info.name})'s cooldown is less than required 1 second.`);
            if(info.cooldown > Number.MAX_SAFE_INTEGER) throw new RangeError(`Command(${info.name})'s cooldown is greater than the safest integer.`);
        }

        if(info.nsfw) {
            if(![true, false, null].includes(info.nsfw)) throw new TypeError(`Command(${info.name})'s option nsfw is not a boolean or null.`);
        }

        if(info.reqArgs) {
            if(![true, false].includes(info.reqArgs)) throw new TypeError(`Command(${info.name})'s option reqArgs is not a boolean.`);
        }

        if(info.channelOnly) {
            if(!Array.isArray(info.channelOnly)) throw new TypeError(`Command(${info.name})'s channelOnly is not an array.`);
            if(!info.channelOnly.every(c => typeof c == 'string')) throw new TypeError(`All of command(${info.name})'s channelOnly types have to be a string.`);
            if(!info.channelOnly.every(c => ['guild','direct','text','news'].includes(c.toLowerCase()))) throw new TypeError(`Command(${info.name})'s channelOnly does not contain proper channel-types. Use: ` + ['guild','direct','text','news']);
            if(info.channelOnly.length > 4) throw new RangeError(`Command(${info.name})'s channelOnly is too long.`);
        }

        if(info.description) {
        if(typeof info.description !== 'string') throw new TypeError(`Command(${info.name})'s description is not a string.`);
        if(info.description.length > 128) throw new RangeError(`Command(${info.name})'s description is too long.`);
        }

        if(info.details) {
        if(typeof info.details !== 'string') throw new TypeError(`Command(${info.name})'s details is not a string.`);
        if(info.details.length > 1500) throw new RangeError(`Command(${info.name})'s details is too long.`);
        }

        if(info.requires) {
            if(!Array.isArray(info.requires)) throw new TypeError(`Command(${info.name})'s requires is not a array.`);
            if(info.requires.length > PermissionFlags.length + 1) throw new TypeError(`Command(${info.name})'s requires cannot be longer than the Permission Flags.`);
        }

        if(info.userrequires) {
            if(!Array.isArray(info.userrequires)) throw new TypeError(`Command(${info.name})'s userrequires is not a array.`);
            if(info.userrequires.length > PermissionFlags.length + 1) throw new TypeError(`Command(${info.name})'s userrequires cannot be longer than the Permission Flags.`);
        }

        if(info.private) {
            if(![true, false].includes(info.private)) throw new TypeError(`Command(${info.name})'s private is not a boolean.`);
        }
        
        if(info.admin) {
            if(![true, false].includes(info.admin)) throw new TypeError(`Command(${info.name})'s admin is not a boolean.`);
        }
                
        if(info.fallback) {
            if(![true, false].includes(info.fallback)) throw new TypeError(`Command(${info.name})'s fallback is not a boolean.`);
        }
                
        if(info.ownerOnly) {
            if(![true, false].includes(info.ownerOnly)) throw new TypeError(`Command(${info.name})'s ownerOnly is not a boolean.`);
        }
    }

}

module.exports = Command;