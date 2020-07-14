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
class presence extends Command {
    constructor(client) {
        super(client, {
            name: 'presence',
            group: 'ef',
            syntax: 'presence <user resolvable>',
            cooldown: 5,
            description: 'Gets detailed presence info about a user.',
            details: 'Lists all presence a user has, involving status, activities, etc.',
            requires: ['EMBED_LINKS'],
        })
    }
    /**
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {Discord.Guild} guild
     */
    async run(message, args, guild) {
    var member = message.mentions.members.first() || message.guild.members.resolve(args[0]) || message.member
    var activities = member.presence.activities
    var status = 'Offline / Invisible'
    var device = []
    switch(member.presence.status) {
        case 'online':
            status = 'Online'
    break;
    case 'idle':
        status = 'Idle'
break;
case 'dnd':
    status = 'DND'
break;
    }
    for(var v in Object.keys(member.presence.clientStatus)) {
    switch(Object.keys(member.presence.clientStatus)[v]) {
        case 'web':
        device.push('Web 🌐')
        break;
        case 'mobile':
            device.push('Mobile 📱')
            break;
            case 'desktop':
                device.push('Desktop 🖥️')
                break;
    }}
    var device = device.join(' ||•|| ')
    var st = [];
    function padder(num) {
        var a = num
        if(num.toString().length == 1) {
            a = `0${num}`
        }
        if(parseInt(a) < 0 && parseInt(num) < 0) {
            a = `--`
        }
        return a;
    }
        for(var activity in activities) {      
            switch(activities[activity].type) {
            case 'PLAYING':
                if(activities[activity].assets) {
                var large = null
                activities[activity].assets.largeImageURL() ? large = activities[activity].assets.largeImageURL() : ''
                var small = null
                activities[activity].assets.smallImageURL() ? small = activities[activity].assets.smallImageURL() : ''

                var largeText = null
                activities[activity].assets.largeText.length ? largeText = activities[activity].assets.largeText : ''
                var smallText = null
                activities[activity].assets.smallText.length ? smallText = activities[activity].assets.smallText : ''
                }

                if(activities[activity].timestamps) {
                var timestamp = undefined;
                var diffMs = (activities[activity].timestamps.end - activities[activity].timestamps.start);
                var diffHrs = padder(Math.floor((diffMs % 86400000) / 3600000)); // hours
                var diffMins = padder(Math.floor(((diffMs % 86400000) % 3600000) / 60000)); // minutes
                var diffSecs = padder(Math.floor((((diffMs % 86400000) % 3600000) % 60000) / 1000)); // seconds

                var proMs = new Date() - activities[activity].timestamps.start; 
                var proHrs = padder(Math.floor((proMs % 86400000) / 3600000)); // hours
                var proMins = padder(Math.floor(((proMs % 86400000) % 3600000) / 60000)); // minutes
                var proSecs = padder(Math.floor((((proMs % 86400000) % 3600000) % 60000) / 1000)); // seconds
                activities[activity].timestamps.end ? timestamp = `${proHrs}:${proMins}:${proSecs}/${diffHrs}:${diffMins}:${diffSecs}` : timestamp = `${proHrs}:${proMins}:${proSecs} elapsed`;
                }
                st.push(`**Playing**: **${activities[activity].name}** 
                ${activities[activity].details ? `**Details**: *${activities[activity].details}*` : ``}
                ${activities[activity].state ? `**State**: *${activities[activity].state}*` : ``}
                ${activities[activity].party ? `**Party**: ${activities[activity].party.size}` : ``}
                ${large ? ` [Large Image](${large}) ${largeText ? `- "${largeText}"` : ``}` : ``} 
                ${small ? ` [Small Image](${small}) ${smallText ? `- "${smallText}"` : ``}` : ``}
                ${timestamp ? timestamp : ''}`)
            break;
            case 'LISTENING':
                if(activities[activity].assets) {
                var preview = null
                activities[activity].assets.largeImageURL() ? preview = `${activities[activity].assets.largeImageURL()}` : ''
                }
                if(activities[activity].timestamps) {
                var diffMs = (activities[activity].timestamps.end - activities[activity].timestamps.start);
                var diffHrs = padder(Math.floor((diffMs % 86400000) / 3600000)); // hours
                var diffMins = padder(Math.floor(((diffMs % 86400000) % 3600000) / 60000)); // minutes
                var diffSecs = padder(Math.floor((((diffMs % 86400000) % 3600000) % 60000) / 1000)); // seconds

                var proMs = new Date() - activities[activity].timestamps.start; 
                var proHrs = padder(Math.floor((proMs % 86400000) / 3600000)); // hours
                var proMins = padder(Math.floor(((proMs % 86400000) % 3600000) / 60000)); // minutes
                var proSecs = padder(Math.floor((((proMs % 86400000) % 3600000) % 60000) / 1000)); // seconds
                if(`${diffHrs}${diffMins}${diffSecs}` < `${proHrs}${proMins}${proSecs}`) {
                    proHrs = diffHrs
                    proMins = diffMins
                    proSecs = diffSecs
                }}
                st.push(`**Listening to ${activities[activity].name}**
                
                ${activities[activity].details ? `**${activities[activity].details}** on **${activities[activity].assets.largeText}** by **${activities[activity].state}**, 
                ${ activities[activity].timestamps ? `${proHrs}:${proMins}:${proSecs}/${diffHrs}:${diffMins}:${diffSecs}` : ``}
                ${preview ? `[Album Art](${preview})` : ``}` : ''}`)
            break;
            case 'STREAMING':
                if(activities[activity].assets) {
                var large = null
                activities[activity].assets.largeImageURL() ? large = activities[activity].assets.largeImageURL() : ''
                var small = null
                activities[activity].assets.smallImageURL() ? small = activities[activity].assets.smallImageURL() : ''
            
                var largeText = null
                activities[activity].assets.largeText.length ? largeText = activities[activity].assets.largeText : ''
                var smallText = null
                activities[activity].assets.smallText.length ? smallText = activities[activity].assets.smallText : ''
                }
                st.push(`**Streaming ${activities[activity].name}**: 
                [Watch stream](${activities[activity].url}) 
                ${activities[activity].details ? `*${activities[activity].details}* `: ``} 
                ${activities[activity].state ? `on *${activities[activity].state}* ` : ``}
                ${large ? ` [Large Image](${large}) ${largeText ? `- "${largeText}"` : ``}` : ``}
                ${small ? ` [Small Image](${small}) ${smallText ? `- "${smallText}"` : ``}` : ``}`)
            break;
            case 'WATCHING':
                var selfbot = ''
                if(!member.user.bot) {
                    selfbot = '**User is selfbotting** '
                }
                if(activities[activity].assets) {
                var large = null
                activities[activity].assets.largeImageURL() ? large = activities[activity].assets.largeImageURL() : ''
                var small = null
                activities[activity].assets.smallImageURL() ? small = activities[activity].assets.smallImageURL() : ''

                var largeText = null
                activities[activity].assets.largeText.length ? largeText = activities[activity].assets.largeText : ''
                var smallText = null
                activities[activity].assets.smallText.length ? smallText = activities[activity].assets.smallText : ''
                }
                st.push(`${selfbot.length ? selfbot : selfbot}**Watching**: **${activities[activity].name}**
                ${large ? ` [Large Image](${large}) ${largeText ? `- "${largeText}"` : ``}` : ``} 
                ${small ? ` [Small Image](${small}) ${smallText ? `- "${smallText}"` : ``}` : ``}`)
            break;
            case 'CUSTOM_STATUS':
                st.push(`**Custom Status**: ${activities[activity].emoji ? activities[activity].emoji : ''} ${activities[activity].state ? activities[activity].state : ''}`)
            break;
            }
        }
        st.join(`\n`)
        if(st.length < 2020) {
        var embed = new Discord.MessageEmbed()
        .setTitle(`Presence for ${member.user.username}${(member.id == message.guild.ownerID) ? ` Server Owner` : ``} ${member.premiumSince ? ` Nitro Booster` : ``}`)
        .setAuthor(`${member.user.tag}`, member.user.avatarURL() ? member.user.avatarURL() : 'https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png')
        .setDescription(`**Activities**\n${st.length ? st.join(`\n`) : `-`}`)
        .addField(`Status`,`${status} ${member.presence.activities.some(a => a.type == 'STREAMING') ? `<:streaming:698663883795071026>` : ``}`, true)
        .addField(`Device`, device, true)
        .setTimestamp()
        .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL() ? message.author.avatarURL() : 'https://upload.wikimedia.org/wikipedia/commons/c/ca/1x1.png')
        message.channel.send(embed)
        } else {
            message.channel.send(`Activity list is too long.`)
        }
    }
}
module.exports = presence;