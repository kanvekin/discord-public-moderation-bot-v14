const client = global.client;
const db = client.db;
const { EmbedBuilder, Events } = require("discord.js");
const kanvekin_config = require("../../kanvekin_config");
const ms = require('ms');
module.exports = async (oldUser,newUser) => {
    let familyRoles = await db.get("kanvekin-family-roles") || [];
    let tagData = await db.get("kanvekin-tags") || [];
    let chatChannel = await db.get("kanvekin-channel-chat");
    if (!tagData.length > 0 || !familyRoles.length > 0 || !chatChannel) return;
    if (oldUser.displayName == newUser.displayName || oldUser.bot || newUser.bot) return;

    let log = client.kanalbul("family-log")
    let chat = client.channels.cache.get(chatChannel)

    let Guild = client.guilds.cache.get(kanvekin_config.guildID)
    let Member = Guild.members.cache.get(oldUser.id)
    if (tagData && tagData.some(tag => oldUser.displayName.includes(tag)) && !tagData.some(tag => newUser.displayName.includes(tag))) {
        if(log)log.send({ embeds: [new EmbedBuilder().setDescription(`> **${newUser} İsminden \`Tagımızı\` Çıkarttı Ailemizden Ayrıldı!**\n\n> **Önceki Kullanıcı Adı: \`${oldUser.displayName}\`**\n> **Sonraki Kullanıcı Adı: \`${newUser.displayName}\`**`).setColor(`#ff0000`)] })
       if(Member.displayName.includes(kanvekin_config.tagSymbol) && Member.manageable) await Member.setNickname(Member.displayName.replace(kanvekin_config.tagSymbol,kanvekin_config.normalSymbol)) 
        let role = Guild.roles.cache.get(familyRoles[0]);
        let roles = Member.roles.cache.clone().filter(e => e.managed || e.position < role.position);
        await Member.roles.set(roles).catch();
    }
    if (tagData && !tagData.some(tag => oldUser.displayName.includes(tag)) && tagData.some(tag => newUser.displayName.includes(tag))) {
        Member.roles.add(familyRoles[0])
        if(Member.displayName.includes(kanvekin_config.normalSymbol) && Member.manageable) await Member.setNickname(Member.displayName.replace(kanvekin_config.normalSymbol,kanvekin_config.tagSymbol)) 
        if(log)log.send({ embeds: [new EmbedBuilder().setDescription(`> **${newUser} İsmine \`Tagımızı\` Alarak Ailemize Katıldı!**\n\n> **Önceki Kullanıcı Adı: \`${oldUser.displayName}\`**\n> **Sonraki Kullanıcı Adı: \`${newUser.displayName}\`**`).setColor(`#00ff00`)] })
        if(chat)chat.send(`> **🎉 Tebrikler, ${newUser} Tag Alarak Ailemize Katıldı! Hoşgeldin.**`)
    }
    

}
module.exports.conf = { name: Events.UserUpdate }
