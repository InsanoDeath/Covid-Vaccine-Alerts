const config = require("../../config.json")

module.exports = {
    name: "test",
    execute(message, args, client, Discord, db) {
        if(message.author.id === config.BOT_OWNER) {
            message.reply("Test")
        }
    }
}