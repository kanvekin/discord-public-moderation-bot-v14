const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const moment = require("moment");
require("moment-duration-format");
const db = client.db;
module.exports = {
    name: "uptime",
    usage: "uptime",
    category:"sahip",
    aliases: ["upt", "aktiflik","client-stat","status","clientstatus"],
    execute: async (client, message, args, kanvekin_embed) => {
        let staffData = await db.get("kanvekin-ban-staff") || [];
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        client.true(message)
        message.reply({ embeds: [kanvekin_embed.setDescription(`> **Client Uptime; \`${moment.duration(client.uptime).format('D [gün], H [saat], m [dakika], s [saniye]')}\`**`)] });
    }
}
