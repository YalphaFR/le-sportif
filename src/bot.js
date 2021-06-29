const config = require("./config");

const Eris = require("eris");
const bot = new Eris.CommandClient(config.token, {

}, {
    caseInsensitive: true,
    guildOnly: true,
});

module.exports = bot;