var Command = require('../../../util/essentials/Command.js')

class a extends Command {
    constructor(client) {
        super(client, {
            name: 'hello-world',
        })
    }
    async run(message) {
        message.channel.send('Hello World!')
    }
}
module.exports = a;