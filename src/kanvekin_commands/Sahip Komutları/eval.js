const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Modal, TextInputBuilder, OAuth2Scopes, Partials, resolveColor, Client, Collection, GatewayIntentBits, SelectMenuBuilder, ActivityType } = require("discord.js");
const moment = require("moment");
const ms = require("ms");
const kanvekin_config = require("../../../kanvekin_config")
module.exports = {
    name: "eval", 
    category:"sahip",
    usage:"eval",
    aliases: [], execute: async (client, message, args, kanvekin_embed) => {
        if (!kanvekin_config.botOwners.some(kanvekin => message.author.id == kanvekin)) return;
        if (!args[0]) return message.reply({ content: `> **Kod Nerede Canımın İçi!**` });
        let code = args.join(" ");
        if (code.includes(client.token)) return message.reply({ content: "> **Sen kendini komikmi sandın kanks**" });
        try {
            var sonuç = eval_kanvekin(await eval(code));
            if (sonuç.includes(client.token))
                return message.reply({ content: "> **Sen kendini komikmi sandın kanks**" });
        } catch (err) { }
    },
}; function eval_kanvekin(kanvekin) { if (typeof text !== "string") kanvekin = require("util").inspect(kanvekin, { depth: 0 }); kanvekin = kanvekin.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203)); return kanvekin; }