// CODE SOURCE

const config = require("./config");
const bot = require("./bot");

// COMMANDES

const end = require("./commands/end");
const newsroulette = require("./commands/newsroulette");
const eval = require("./commands/eval");

// EVENTS

const requestSportSystem = require("./events/requestSportSystem");

bot.on("ready", () => {
    console.log("Initialisation du statut");
    bot.editStatus(config.status, config.game);
    console.log("Bot prêt à l'emploi!");
});

bot.once("disconnect", () => {
    console.log("Bot déconnecté!");
});

module.exports = {
    start() {
        bot.connect();
        console.log("bot connecté");
    }
}
