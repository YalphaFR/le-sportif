// CODE SOURCE

const config = require("./config");
const bot = require("./bot");

// COMMANDES

const end = require("./commands/end");

// EVENTS

const requestSportSystem = require("./events/requestSportSystem");
const newsroulette = require("./commands/newsroulette");

bot.on("ready", () => {
    console.log("Initialisation du statut");
    bot.editStatus(config.status, config.game);
    console.log("Bot prêt à l'emploi!");
});

bot.on("disconnect", () => {
    console.log("Bot déconnecté!");
});

module.exports = {
    start() {
        bot.connect();
        console.log("bot connecté");
    }
}
