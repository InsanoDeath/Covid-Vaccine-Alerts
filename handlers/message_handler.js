const fs = require("fs")
const config = require("../config.json")

module.exports = (client, Discord, db) => {
  client.commands = new Discord.Collection()
  client.cooldowns = new Discord.Collection()

  let commandFolders = fs.readdirSync("./commands")
  for (let folder of commandFolders) {
    let commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"))
    for (let file of commandFiles) {
      let command = require(`../commands/${folder}/${file}`)

      client.commands.set(command.name, command)
    }
  }

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  client.on("message", async message => {
    if(message.author.bot || !message.guild) return
    let PREFIX = config.prefix

    let prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);

    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    if (!message.content.startsWith(matchedPrefix)) return;

    if (message.content.startsWith(matchedPrefix)) {
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    if(!commandName) return

    const command =
      client.commands.get(commandName) ||
      client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    let reply = "There was an error executing this command";

    try {
      command.execute(message, args, client, Discord, db);
    } catch (error) {
      console.error(error);
      message.reply(reply);
      message.delete();
      }
    }
  })
}