const Discord = require("discord.js")
const client = new Discord.Client({
    restTimeOffset: 0,
    partials: ["CHANNEL", "MESSAGE", "REACTION", "USER"]
})
const fs = require("fs")
const config = require("./config.json")
const db = require("croxydb")



const handlers = fs.readdirSync("./handlers").filter(h => h.endsWith(".js"))
for (let handler of handlers) {
    require(`./handlers/${handler}`)(client, Discord, db)
}


client.on("ready", () => {
    console.log("READY!!")
    client.user.setActivity("InsanoDeath#1972 Commands", { type: "LISTENING" })
})


client.login(config.token)