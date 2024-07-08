const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const canvafy = require('canvafy');
const db = client.db;
module.exports = {
    name: "ship",
    usage: "ship [@kanvekin / ID / Random]",
    category:"genel",
    aliases: ["ships", "kalp"],
    execute: async (client, message, args, kanvekin_embed) => {
        if(!["ship","bot","commands","command","komut"].some(kanvekin => message.channel.name.includes(kanvekin))) return message.channel.send({ embeds: [kanvekin_embed.setDescription(`> **Ship Komudunu Sadece Adında "ship","bot","commands","command","komut" İçeren Kanallarda Kullanabilirsin!**`)] }).sil(5);
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.random();
        if(!user) return message.channel.send({ embeds: [kanvekin_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] }).sil(5);
            const ship = await new canvafy.Ship()
            .setAvatars(message.author.displayAvatarURL({ dynamic: true, extension: "png" }),user.user.displayAvatarURL({ dynamic: true, extension: "png" }))
            .setBackground("image", `${message.guild.bannerURL({extension:"png",size:2048}) !== null ? message.guild.bannerURL({extension:"png",size:2048}) : kanvekin_config.shipArkaplan}`)
            .setBorder("#f0f0f0")
            .setOverlayOpacity(0.5)
            .build();
        
            client.true(message)

            message.reply({
              content:`> **     ${message.author.tag} ❓ ${user.user.tag}**`,
              files: [{
                attachment: ship,
                name: `ship-${message.member.id}.png`
              }]
            });
    }
}
