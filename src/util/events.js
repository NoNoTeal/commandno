const reqEvent = (event) => require (`./events/${event}`)

module.exports = bot => {
    //bot stuff
    bot.on("ready", function() {reqEvent("ready")(bot)});
    bot.on("reconnecting", () => reqEvent("reconnecting"))
    bot.on("disconnect", () => reqEvent("disconnecting"))
    bot.on("warn", reqEvent("warn"))
    bot.on("error", reqEvent("error"))
    bot.on('message', function(msg) {const CommandMessage = require('./essentials/CommandMessage.js'); new CommandMessage(msg.client, msg)})
}
