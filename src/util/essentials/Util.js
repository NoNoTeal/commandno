const Discord = require('discord.js');
const fs = require('fs');
const { owners, prefixes } = require('./../config.json');

/**
 * A various collection of mostly non-D.JS related things. These functions are used in Command.js, don't delete.
 */
class Util {
    /**
     * @param {Discord.Client} client 
     */
    /**
     * @typedef {number} Second
     */
    constructor(client) {
      /**
       * The client that instantiated this (shortcut)
       * @name Discord.Client
       * @type {Discord.Client}
       * @readonly
       */
      Object.defineProperty(this, 'client', { value: client });
    };
    /**
     * Automatically sends and deletes a message for you.
     * @param {string} content
     * @param {Discord.Message} msg
     * @param {Second} time
     * @static
     */
    static automsg(content, msg, time) {
        if(!time || isNaN(time) || time < 1) {
            time = 10;
        };
        msg.channel.send(content.length ? content : '*No AutoMessage Content Sent*').then(m => {
            m.delete({timeout: time * 1000});
            if(m.guild) {
                if(!m.guild.me.hasPermission('MANAGE_MESSAGES')) return;
                else msg.delete({reason: 'Automatically Deleted Message from Triggering Bot.'});
            }
        });
    };

    /**
     * Checks if provided ID is an owner.
     * @param {Discord.Snowflake} id 
     * @static
     */
    static isOwner(id) {
        return owners.includes(id);
    };

    /**
     * Random chance based on number you input, chance.
     * @param {number} number 
     * @returns {boolean}
     */
    static chance(number) {
        if(isNaN(number)) number = 500;
        if(number < 1 && number > 1000) number = 500;
        return Math.random() >= number / 1000 ? true : false;
    };

    /**
     * Pick a random item from an array.
     * @param {array} array 
     */
    static randomEqualArray(array) {
        if(!Array.isArray(array)) return 'Not an Array';
        return array[Math.floor(Math.random() * array.length)];
    };

    /**
     * Pick a random key/value from an object.
     * @param {object} object 
     * @returns {any}
     */
    static randomEqualObject(object) {
        if(object.constructor !== Object) return 'Not an Object';
        return Object.keys(object)[Math.floor(Math.random() * Object.keys(object).length)];
    };

    /**
     * Weighted RNG Array, the heavier the more chance it'll appear.
     * @typedef {number} weight
     * @typedef {[weight, any]} weightedelement
     * @param {weightedelement[]} warray The weighted array.
     * @param {number} runAmount The amount of items to generate.
     */
    static randomWeighted(warray, runAmount) {
        if(!Array.isArray(warray)) return 'Not an Array';
        const totalWeight = warray.reduce((a, [weight]) => a + weight, 0);
        const weightObj = {};
        let weightUsed = 0;
        for (const item of warray) {
          weightUsed += item[0];
          weightObj[weightUsed] = item;
        }
        const keys = Object.keys(weightObj);
        const generate = () => {
          const rand = Math.floor(Math.random() * totalWeight);
          const key = keys.find(key => rand < key);
          return weightObj[key][1];
        };
        const gen = [];
        if(isNaN(runAmount)) runAmount = 10;
        if(runAmount < 1 && runAmount > 1000) runAmount = 10;
        for(i = 0; i < runAmount; i++) {
            gen.push(generate());
        };
        return gen;
    };

    /**
     * Shortens a string.
     * @param {string} string 
     * @param {number} length 
     * @return {String}
     */
    static shorten(string, length) {
        if(!isNaN(length)) {
        if(string.length > length) {
            string.slice(0, length - 3);
            return `${string}...`;
        }} else return string;
    };

    /**
     * https://stackoverflow.com/a/7228322/10974240
     * @param {number} min 
     * @param {number} max 
     * @returns {Number}
     */
    static randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    /**
     * Sends a message if it's silent or not.
     * @param {Discord.Message} msg 
     * @param {String} content 
     * @param {Boolean} silent 
     * @param {automsg} automsg 
     * 
     * @typedef {[Boolean, Second]} automsg
     *
     */
    static silentMessage(msg, content, silent, automsg = [null]) {
        if(!silent) {
            if(automsg[0]) {
                return Util.automsg(content, msg, automsg[1]);
            } else return msg.channel.send(content);
        } else return;
    };

    /**
     * Gets a layer of files.
     * @param {String} dirPath 
     * @param {String[]} arrayOfFiles 
     */
    static getLayerOfFiles(dirPath, arrayOfFiles, extension) {
        dirPath = dirPath.split('/').filter(s=>s.length).join('/');
        var files = fs.readdirSync(dirPath)
       
        arrayOfFiles = arrayOfFiles || []
       
        files.forEach(function(file) {
            if(!file.endsWith(extension || "") || file.endsWith(".DS_Store") && !fs.statSync(dirPath + "/" + file).isFile()) return;
            arrayOfFiles.push(dirPath + '/' + file)
        })
        return arrayOfFiles;
    };

    /**
     * @param {Array} array 
     * @param {any} value 
     * @returns {number}
     * @static
     */
    static countInArray(array, value) {
        return array.reduce((n, x) => n + (x === value), 0);
    }

    /**
     * Gets all files in a folder.
     * @param {String} dirPath 
     * @param {String[]} arrayOfFiles 
     * @param {String} extension
     */
    static getAllFiles(dirPath, arrayOfFiles, extension) {
        dirPath = dirPath.split('/').filter(s=>s.length).join('/');
        var files = fs.readdirSync(dirPath)
       
        arrayOfFiles = arrayOfFiles || []
       
        files.forEach(function(file) {
          if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = Util.getAllFiles(dirPath + "/" + file, arrayOfFiles, extension)
          } else {
            if(!file.endsWith(extension || "") || file.endsWith(".DS_Store") && !fs.statSync(dirPath + "/" + file).isFile()) return;
            arrayOfFiles.push(dirPath + '/' + file)
          }
        })
        return arrayOfFiles;
    };

    /**
     * Adds all file sizes to get one large one.
     * @param {String} directory 
     */
    static getCombinedSize(arrayOfFiles) {
        let totalSize = 0

        arrayOfFiles.forEach(function(filePath) {
          totalSize += fs.statSync(filePath).size;
        })
      
        return totalSize;
    }

    /**
     * If variable equals undefined or null.
     * @param {any} variable 
     */
    static isNull(variable) {
        return variable == null;
    };

    /**
     * If variable equals a boolean
     * @param {any} variable 
     */
    static isBoolean(variable) {
        return typeof variable === "boolean";
    };

    /**
     * Escapes any RegExp string.
     * @param {String} string 
     */
    static escapeRegex(string) {
        return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    /**
     * Generates a RegEx for handling messages to trigger the bot.
     * @param {Discord.Message} msg
     * @returns {RegExp}
     */
    static generateRegex(msg) {
        if(msg.guild) {
            if(msg.client.getGuildPrefix.get(`${msg.guild.id}`)) {
                prefixes.push(client.getGuildPrefix.get(`${msg.guild.id}`).prefix);
            };
        };
            var newPrefixes = [];
            prefixes.forEach(function(prefix, i){newPrefixes[i] = Util.escapeRegex(prefix)});
            return new RegExp(`^(?<prefix>(${newPrefixes.join('|')}))(?<command>\\w+)\\s?(?<arguments>.*)?`, 'is');
    }

    /**
     * Abbreviate a number
     * @param {Number} number 
     * @param {Number} maxPlaces 
     * @param {Boolena} forcePlaces 
     * @param {'T','B','M','K'} forceLetter 
     */
    static abbreviate(number, maxPlaces, forcePlaces, forceLetter) {
        number = Number(number)
        forceLetter = forceLetter || false
        if(forceLetter !== false) {
          return Util.annotate(number, maxPlaces, forcePlaces, forceLetter)
        }
        var abbr
        if(number >= 1e12) {
          abbr = 'T'
        }
        else if(number >= 1e9) {
          abbr = 'B'
        }
        else if(number >= 1e6) {
          abbr = 'M'
        }
        else if(number >= 1e3) {
          abbr = 'K'
        }
        else {
          abbr = ''
        }
        return Util.annotate(number, maxPlaces, forcePlaces, abbr)
      }
      
    /**
     * @param {Number} number 
     * @param {Number} maxPlaces 
     * @param {Boolean} forcePlaces 
     * @param {String} abbr 
     * @private
     */
    static annotate(number, maxPlaces, forcePlaces, abbr) {

        var rounded = 0
        switch(abbr) {
          case 'T':
            rounded = number / 1e12
            break
          case 'B':
            rounded = number / 1e9
            break
          case 'M':
            rounded = number / 1e6
            break
          case 'K':
            rounded = number / 1e3
            break
          case '':
            rounded = number
            break
        }
        if(maxPlaces !== false) {
          var test = new RegExp('\\.\\d{' + (maxPlaces + 1) + ',}$')
          if(test.test(('' + rounded))) {
            rounded = rounded.toFixed(maxPlaces)
          }
        }
        if(forcePlaces !== false) {
          rounded = Number(rounded).toFixed(forcePlaces)
        }
        return rounded + abbr
    }
};
module.exports = Util;