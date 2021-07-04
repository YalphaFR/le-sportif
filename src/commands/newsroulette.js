const bot = require("../bot");
const config = require("../config");
const utils = require("../utils");

const newsroulette = bot.registerCommand("newsroulette", async (msg) => {
    const roleIDs = [config.benevoleRoleID, "848624672249348116"];
    const guildMembers = await utils.getRESTMembers(msg.channel.guild);
    const membersHaveRoles = [];
 
    for (const id of roleIDs) {
        for (const m of guildMembers) {
            if (!membersHaveRoles.includes(m) && m.roles.includes(id) && !m.bot) {
                membersHaveRoles.push(m);
            }
        }
    }

    const randomInt = utils.randomInt(0, membersHaveRoles.length - 1);
    const designedMember = membersHaveRoles[randomInt];

    try {
        const timeToTimeout = 10; // secondes
        const sendMessage = await msg.channel.createMessage(`La personne qui doit rédiger l'information du jour est : ${timeToTimeout}sec`);

        for (let i = 0; i < (timeToTimeout); i++) {
            await utils.sleep(1000);
            await sendMessage.edit({content: `La personne qui doit rédiger l'information du jour est : ${timeToTimeout - (i + 1)}sec`});
        }

        sendMessage.edit({content: `La personne qui doit rédiger l'information du jour est : **${designedMember.username}**`});
    } catch (_) {}

    const dmChannel = await designedMember.user.getDMChannel();
    if (dmChannel) {
        dmChannel.createMessage("<:psychokwak:859526166029271090> Tu as été choisi pour rédiger l'information d'aujourd'hui! Bonne chance! ");
    }
}, {
    aliases: ["nr"],
    requirements: {
        permissions: {
            administrator: false,
        }
    }
});