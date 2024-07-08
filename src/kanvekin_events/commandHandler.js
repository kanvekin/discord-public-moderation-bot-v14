const client = global.client;
const { EmbedBuilder, Events,codeBlock } = require("discord.js");
const kanvekin_config = require("../../kanvekin_config");
const ms = require('ms');
const db = client.db;
module.exports = async (message) => {
    let chatChannel = await db.get("kanvekin-channel-chat");
    let unregisterRoles = await db.get("kanvekin-unregister-roles") || [];
    let jailRoles = await db.get("kanvekin-jail-roles") || [];
    if (kanvekin_config.prefix && !message.content.startsWith(kanvekin_config.prefix) || message.guild.id !== kanvekin_config.guildID)return;
    if(unregisterRoles.length > 0 && jailRoles.length > 0 && unregisterRoles.some(kanvekin => message.member.roles.cache.has(kanvekin)) && jailRoles.some(kanvekin => message.member.roles.cache.has(kanvekin)))return client.false(message);
    const args = message.content.slice(1).trim().split(/ +/g);
    const commands = args.shift().toLowerCase();
    const cmd = client.commands.get(commands) || [...client.commands.values()].find((e) => e.aliases && e.aliases.includes(commands));
    if(chatChannel && message.channel.id == chatChannel && !["snipe","tag","afk"].some(kanvekin => cmd.name == kanvekin)) return client.false(message);
    const kanvekin_embed = new EmbedBuilder()
    .setColor(`#2b2d31`)
    .setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
    .setFooter({ text: kanvekin_config.footer ? kanvekin_config.footer : `kanvekin Was Here`, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })

    if (cmd) {
        cmd.execute(client, message, args, kanvekin_embed);
        if(client.kanalbul("command-log")){
            client.kanalbul("command-log").send({
                embeds: [new EmbedBuilder().setColor(`#2b2d31`).setDescription(`> **${message.member} Kullanıcısı <t:${Math.floor(Date.now()/1000)}:R> Önce ${message.channel} Kanalında \`${cmd.name}\` Komudunu Kullandı!**`).addFields(
                    { name: `Kullanılan Komut`, value: `${codeBlock("fix",kanvekin_config.prefix+cmd.name)}`, inline: false },
                    { name: `Kullanan Kişi`, value: `${codeBlock("fix", message.author.tag + " / " + message.author.id)}`, inline: false },
                    { name: `Tarih / Zaman`, value: `**<t:${Math.floor(Date.now()/1000)}> (<t:${Math.floor(Date.now()/1000)}:R>)**`, inline: false }
                )]
            })
        }
    }
}
module.exports.conf = { name: Events.MessageCreate }
