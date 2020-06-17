const Discord = require('discord.js');
const { owners } = require('./../config.json');

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
     * Trunicates a string.
     * @param {string} string 
     * @param {number} length 
     * @return {String}
     */
    static trunicate(string, length) {
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

};
module.exports = Util;