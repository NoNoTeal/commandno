var { ShardingManager } = require('discord.js')
var { token } = require('./src/xteal/util/config.json')
var shards = new ShardingManager('./main.js', { token: token, totalShards: 1})

shards.spawn("auto");
shards.on('shardCreate', shard => {console.log('New shard: ' + shard.id)})