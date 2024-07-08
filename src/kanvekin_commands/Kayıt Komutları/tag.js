const {PermissionFlagsBits} = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "tag",
    usage:"tag",
    category:"kayıt",
    aliases: ["tags","taglar"],
    execute: async (client, message, args, kanvekin_embed) => {
    let tagData = await db.get("kanvekin-tags") || [];
    if(!tagData.length > 0) return message.reply({ embeds:[kanvekin_embed.setDescription(`> **Bu Sunucuda Tag Bulunmamakta!**`)]}).sil(5);
    return message.reply({content:`> ${tagData.map((kanvekin) => `**${kanvekin}**`).join(",")}`});
    }
}