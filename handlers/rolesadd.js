module.exports = (client, Discord) => {
    client.on("messageReactionAdd", async (reaction, user) => {
        const message = await reaction.message

        if(message.id === "842700533638496256") {
            reaction.users.remove(user)

            const member = message.guild.member(user)

            switch (reaction.emoji.name) {
                case "1️⃣":
                    member.roles.add("842697937359470602")
                    break;
            }
        }
    })
}