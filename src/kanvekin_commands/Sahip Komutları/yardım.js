const { PermissionFlagsBits, ActionRowBuilder, Events,StringSelectMenuBuilder, codeBlock } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const canvafy = require('canvafy');
const db = client.db;
module.exports = {
    name: "yardım",
    usage: "yardım",
    category:"sahip",
    aliases: ["help", "h"],
    execute: async (client, message, args, kanvekin_embed) => {
        let staffData = await db.get("kanvekin-ban-staff") || [];
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        client.true(message)
        let menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
            .setOptions([
            {value:`genelkomutlar`,description:`Genel Komutları Gösterir`,label:`Genel Komutlar`,emoji:`${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "⚕️"}`},
            {value:`statkomutlar`,description:`Stat Komutlarını Gösterir`,label:`Stat Komutları`,emoji:`${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "⚕️"}`},
            {value:`kayıtkomutlar`,description:`Kayıt Komutlarını Gösterir`,label:`Kayıt Komutları`,emoji:`${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "⚕️"}`},
            {value:`moderasyonkomutlar`,description:`Moderasyon Komutlarını Gösterir`,label:`Moderasyon Komutları`,emoji:`${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "⚕️"}`},
            {value:`rolkomutlar`,description:`Rol Komutlarını Gösterir`,label:`Rol Komutlarını`,emoji:`${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "⚕️"}`},
            {value:`sahipkomutlar`,description:`Sahip Komutlarını Gösterir`,label:`Sahip Komutları`,emoji:`${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "⚕️"}`},
            {value:`üstytkomutlar`,description:`Üst Yetkili Komutlarını Gösterir`,label:`Üst Yetkili Komutlarını`,emoji:`${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "⚕️"}`},
            ])
            .setCustomId("yardım")
            .setPlaceholder(`❓ | ${client.commands.size} Adet Komut Bulunmakta!`)
            )
      message.channel.send({components:[menu]});
    }
}


client.on(Events.InteractionCreate,async(kanvekin) => {
if(!kanvekin.isStringSelectMenu())return;
let value = kanvekin.values[0];
if(kanvekin.customId == "yardım"){
switch (value) {
    case "genelkomutlar":
        let cmd = commandShow("genel");
        kanvekin.reply({ephemeral:true,content:codeBlock("fix",`${cmd.map(kanvekin => `${kanvekin_config.prefix}${kanvekin.usage}`).join("\n")}`)})
        break;
        case "kayıtkomutlar":
        let cmd2 = commandShow("kayıt");
        kanvekin.reply({ephemeral:true,content:codeBlock("fix",`${cmd2.map(kanvekin => `${kanvekin_config.prefix}${kanvekin.usage}`).join("\n")}`)})
        break;
        case "moderasyonkomutlar":
        let cmd3 = commandShow("moderasyon");
        kanvekin.reply({ephemeral:true,content:codeBlock("fix",`${cmd3.map(kanvekin => `${kanvekin_config.prefix}${kanvekin.usage}`).join("\n")}`)})
        break;
        case "rolkomutlar":
        let cmd4 = commandShow("rol");
        kanvekin.reply({ephemeral:true,content:codeBlock("fix",`${cmd4.map(kanvekin => `${kanvekin_config.prefix}${kanvekin.usage}`).join("\n")}`)})
        break;
        case "sahipkomutlar":
        if (!kanvekin_config.botOwners.some(kanvekin => kanvekin.user.id == kanvekin)) return kanvekin.reply({content:`> **Bot Sahibi Değilsin!**`,ephemeral:true});
        let cmd5 = commandShow("sahip");
        kanvekin.reply({ephemeral:true,content:codeBlock("fix",`${cmd5.map(kanvekin => `${kanvekin_config.prefix}${kanvekin.usage}`).join("\n")}`)})
        break;
        case "üstytkomutlar":
        let cmd6 = commandShow("üstyt");
        kanvekin.reply({ephemeral:true,content:codeBlock("fix",`${cmd6.map(kanvekin => `${kanvekin_config.prefix}${kanvekin.usage}`).join("\n")}`)})
        break;
        case "statkomutlar":
        let cmd7 = commandShow("stat");
        kanvekin.reply({ephemeral:true,content:codeBlock("fix",`${cmd7.map(kanvekin => `${kanvekin_config.prefix}${kanvekin.usage}`).join("\n")}`)})
        break;
}
}
})


function commandShow(name){
let cmd = client.commands.filter(kanvekin => kanvekin.category && kanvekin.category == name.toLowerCase())
return cmd ? cmd : null;
}