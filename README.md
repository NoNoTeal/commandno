# Commandno

Commandno is a crappy version of Discord.JS-Commando but simplified. This is a template for bots if you're way too lazy.

## Bugs

Go to the issues tracker

## Contributing

Pull Request Shit

## Support

you dont


## How to Make a command

```js
var Command = require('../../../util/essentials/Command.js'); //require command

class helloworld extends Command {
    constructor(client) {
        super(client, {
            name: 'helloworld', //jsdoc support will help you
        })
    }
    async run(message) {
        message.channel.send('Hello World!')
    }
}
module.exports = helloworld;
```

## What Options the Command Has
```js
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
```


#### K, enjoy, also /src/util/config.json