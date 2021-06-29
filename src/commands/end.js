const bot = require("../bot");
const config = require("../config");

const end = bot.registerCommand("end", (msg) => {
    msg.channel.createMessage("Extinction des feux! ");
    bot.disconnect();
}, {
    aliases: ["stop"],
    requirements: {
        permissions: {
            administrator: true,
        }
    }
});