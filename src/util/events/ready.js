var config = require('./../config.json')
module.exports = bot => {
setInterval(() => {

    var randomprefix = config.prefixes[Math.floor(Math.random() * config.prefixes.length)]

    var presences = [
        `for prefix: ${randomprefix} & Use ${randomprefix}help`,
    ]

    bot.presence.set({
        afk: false,
        activity: {
            application: {id: bot.user.id},
            type: 3,
            name: presences[Math.floor(Math.random() * presences.length)],
            url: 'https://github.com/nonoteal/',
        }
    })
}, 10000);
}
