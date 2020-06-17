var djs = require('discord.js')
var config = require('./src/util/config.json')
var client = new djs.Client();
var Constants = require('discord.js/src/util/Constants.js')
/**
 * KJP12
 * @type {'Discord.JS'|'Discord iOS'|'Discord Android'|'Discord Browser'}
 */
Constants.DefaultOptions.ws.properties.$browser = 'Discord iOS';
client.login(config.token)
require('./src/util/essentials/Verify.js')(client)