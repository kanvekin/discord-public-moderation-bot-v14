const {PermissionFlagsBits, ChannelType} = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "dağıt",
    usage:"dağıt [Kategori ID]",
    category:"moderasyon",
    aliases: ["boşalt","dağıt","topludağıt"],
    execute: async (client, message, args, kanvekin_embed) => {
        let staffData = await db.get("kanvekin-ban-staff") || [];
        if(!staffData.length > 0)console.error("Ban Yetkilisi Ayarlı Değil!");
        if(!staffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers))return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        if (!message.member.voice.channel) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Bir Ses Kanalında Değilsin!**`)] }).sil(5);
        if (!args[0] || !message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.get(args[0]).type !== ChannelType.GuildCategory) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Geçerli Bir Kategori ID'si Belirt!**`)] }).sil(5);
        if(!message.member.voice.channel.members.filter(kanvekin => !kanvekin.user.bot && kanvekin.id !== message.author.id).size > 0)return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Kanalda Dağıtılabilinecek Kullanıcı Yok!**`)] }).sil(5);
        let kanal = message.guild.channels.cache.filter(kanvekin => kanvekin.parentId == args[0] && kanvekin.type == ChannelType.GuildVoice);
       message.member.voice.channel.members.filter(kanvekin => !kanvekin.user.bot && kanvekin.id !== message.author.id).array().forEach((kanvekin, index) => {
        setTimeout(() => {
           if (kanvekin.voice.channel.id !== message.member.voice.channel.id) return;
           kanvekin.voice.setChannel(kanal.random());
        }, index*1000);
      });

        client.true(message)
        return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Sesteki \`${message.member.voice.channel.members.filter(kanvekin => !kanvekin.user.bot && kanvekin.id !== message.author.id).size}\` Adet Kullanıcı __<#${args[0]}>__ Kategorisindeki Ses Kanallarına Dağıtılıyor!**`)] });
    }
}