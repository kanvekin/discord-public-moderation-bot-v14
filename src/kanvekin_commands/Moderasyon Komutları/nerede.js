const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "nerede",
    usage: "nerede [@kanvekin / ID]",
    category:"moderasyon",
    aliases: ["n", "nerde", "where"],
    execute: async (client, message, args, kanvekin_embed) => {
        let staffData = await db.get("kanvekin-ban-staff") || [];
        if(!staffData.length > 0)console.error("Ban Yetkilisi Ayarlı Değil!");
        if(!staffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers))return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] }).sil(5);
        let kanal = user.voice.channel;
        if (!kanal) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Belirtilen Kullanıcı Bir Ses Kanalında Bulunmamakta!**`)] }).sil(5);
        let microphone = user.voice.selfMute ? "Kapalı" : "Açık";
        let headphones = user.voice.selfDeaf ? "Kapalı" : "Açık";
        let sestekiler = message.guild.channels.cache.get(kanal.id).members.size >= 20 ? "Kanalda 20 Kişiden Fazla User Bulunmakta!" : message.guild.channels.cache.get(kanal.id).members.map(x => x.user).join(",");
        let davet = await kanal.createInvite();
        client.true(message)
        message.reply({ embeds: [kanvekin_embed.setDescription(`> **${user} Kullanıcısı ${kanal} Adlı Kanalda!**\n> **Mikrofon; \`${microphone}\`**\n> **Kulaklık; \`${headphones}\`**\n> **Sesteki Kullanıcılar; ${sestekiler}**\n\n> **[Kanala Katıl!](https://discord.gg/${davet.code})**`).setThumbnail(user.user.avatarURL({ dynamic: true }))] });
    }
}
