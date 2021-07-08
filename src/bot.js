const config = require("./config");

const Eris = require("eris");
const bot = new Eris.CommandClient(config.token, {
    intents: Object.keys(Eris.Constants.Intents),
    restMode: true
    }, 
    {
    caseInsensitive: true,
    guildOnly: true,
});

module.exports = bot;
