const bot = require("../bot");
const config = require("../config");
const utils = require("../utils");

const reactionUnicode = "BlobYes:853634195939262464"

bot.on("messageCreate", (msg) => {
    if (msg.channel.id !== config.propositionSportChannelID) return;
    if (msg.author.bot) return;
    if (msg.content.length > 25) return;
    
    msg.delete();
    msg.channel.createMessage({embed: {
        author: {
            name: `${msg.author.username}#${msg.author.discriminator}`,
            icon_url: msg.author.avatarURL,
        },
        color: utils.getMainRole(msg.member).color,
        title: "Proposition d'ajout de sport",
        description: msg.content.toUpperCase(),
        footer: {
            text: `MemberID: ${msg.author.id}`,
        }
    }}).then(msg => msg.addReaction(reactionUnicode));
});


bot.on("messageReactionAdd", async (msg, emoji, reactor) => {
    if (!msg.channel.id === config.propositionSportChannelID) return;
    if (reactor.id === bot.user.id) return;
    const msgReactionUnicode = `${emoji.name}:${emoji.id}`;
    if (msgReactionUnicode !== reactionUnicode) return;
    const msgCatched = await msg.channel.getMessage(msg.id);
    if (!msgCatched || msgCatched.author.id !== bot.user.id || msgCatched.embeds.length === 0) return;
    const reactions = msgCatched.reactions;
    const limitReactions = reactions[reactionUnicode].me ? 8 : 7;
    if (reactions[reactionUnicode].count < limitReactions) return;

    msgCatched.delete();
    const sportName = msgCatched.embeds[0].description.toLowerCase();
    const categorySport = await msgCatched.channel.guild.createChannel(sportName, 4, {reason: "auto", permissionOverwrites: [{id: msgCatched.channel.guild.id, type: 0, deny: "1024"}]});
    
    const generateChannelNames = ["général", "bienfaits", "histoire", "organisations"];
    const generateChannels = generateChannelNames.map(n => {
        msgCatched.channel.guild.createChannel(`${n}-${sportName}`, 0, {reason: "auto", parentID: categorySport.id});
    });
    await Promise.all([generateChannels]);
    
    const sportQueueChannelLog = msgCatched.channel.guild.channels.find(c => c.id === config.sportQueueChannelLogID);
    if (!sportQueueChannelLog) return;

    const footerContent = msgCatched.embeds[0].footer.text.split(" ");
    const propositionAuthorID = footerContent[1];
    await sportQueueChannelLog.createMessage({content: `<:greentick:848980063089328168> Sport ajouté : ${sportName}, proposition soumise par <@${propositionAuthorID}>`, allowedMentions: {users: false}});

    const propositionMember = msgCatched.channel.guild.members.get(propositionAuthorID);
    const memberIsStaff = utils.isStaff(propositionMember); 
    const memberIsBenevole = utils.isBenevole(propositionMember);
    if (!propositionMember || memberIsStaff || memberIsBenevole) return;
    
    const dmChannel = await propositionMember.user.getDMChannel();
    if (!dmChannel) return;

    const message = `Message provenant du serveur [${msgCatched.channel.guild.name}](https://discord.com/channels/${msgCatched.channel.guild.id}).\n\nBonjour, votre proposition de sport (**${sportName}**) soumise le \`${utils.date()}\` a été acceptée par la communauté! Votre sport se verra donc être disponible pour la communauté sous peu! 
    Pour l'instant, la catégorie de ce sport ne possède aucun bénévole affectée à elle au moment de l'envoi de ce message. Nous avons donc penser à vous dès la création de celle-ci. Si vous souhaitez gérer la catégorie ce sport sur notre serveur, n'hésitez pas à contacter directement un administrateur en message privé.
    
    Liens pratiques : (ces liens ne sont pas dangereux!)
    [Cliquez pour plus d'informations sur le rôle de bénévole](https://discord.com/channels/848623623254310912/848629633908736020/859404023671947275).
    [Cliquez pour plus d'informations sur les modalités du rôle bénévole.](https://discord.com/channels/848623623254310912/848629633908736020/859404061447028746)`;
    dmChannel.createMessage({embed: {
        color: config.color,
        description: message,
    }});
});