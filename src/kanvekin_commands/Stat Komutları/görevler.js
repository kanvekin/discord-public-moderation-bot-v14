const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder, StringSelectMenuBuilder, ComponentType, codeBlock, Embed } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr");
const canvafy = require("canvafy");
const messageGuild = require("../../kanvekin_schemas/messageGuildSchema");
const messageGuildChannel = require("../../kanvekin_schemas/messageGuildChannelsSchema");
const voiceGuild = require("../../kanvekin_schemas/voiceGuildSchema");
const voiceGuildChannel = require("../../kanvekin_schemas/voiceGuildChannelsSchema");
const messageUser = require("../../kanvekin_schemas/messagesSchema");
const voiceUser = require("../../kanvekin_schemas/voicesSchema");
const point = require("../../kanvekin_schemas/staffsSchema");
const invite = require("../../kanvekin_schemas/invitesSchema");
const task = require("../../kanvekin_schemas/tasksSchema");
module.exports = {
    name: "görevler",
    usage: "görevler",
    category: "stat",
    aliases: ["tasks", "görevlerim", "görevlers"],
    execute: async (client, message, args, kanvekin_embed) => {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if(!kanvekin_config.staffs.some(kanvekin => message.member.roles.cache.has(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers))return message.reply({embeds:[kanvekin_embed.setDescription(`> **Yeterli Yetki Bulunmamakta!**`)]}).sil(5);
        if(!kanvekin_config.staffs.some(kanvekin => member.roles.cache.has(kanvekin)))return message.reply({embeds:[kanvekin_embed.setDescription(`> **Yeterli Yetkisi Bulunmamakta!**`)]}).sil(5);


       const tasks = await task.find({ guildId: message.guild.id, userId: member.id });
       //if(tasks.length == 0)return message.reply({embeds:[kanvekin_embed.setDescription(`> **Datada Hiç Görev Bulunmamakta!**`)]}).sil(5);


        kanvekin_embed.setTitle(`Yetkili Görev Sistemi`).setURL(`https://discord.gg/82`).setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

        message.reply({
            embeds: [
                kanvekin_embed.setDescription(`> **${member.user.toString()} Kullanıcısının Görev Bilgileri;**\n\n> **Toplam Görev; ${client.sayıEmoji(tasks.length)} Adet**\n> **Tamamlanmış Görev; ${client.sayıEmoji(tasks.filter((x) => x.completed).length)} Adet**\n> **Tamamlanmamış Görev; ${client.sayıEmoji(tasks.filter((x) => !x.completed).length)} Adet**\n> **Aktif Görev; ${client.sayıEmoji(tasks.filter((x) => x.active).length)} Adet**\n\n${tasks
                    .filter((x) => x.active)
                    .map(
                        (x) =>
                            `\`#${x.id}\` ${x.message} \n${x.completedCount >= x.count
                                ? conf.emojis.coin + " **Tamamlandı!**"
                                : `> ${client.progressBar(x.completedCount, x.count, 7)} \`${x.type === "ses"
                                    ? `${moment.duration(x.completedCount).format("H [Saat], m [Dk], s [Sn]")} / ${moment.duration(x.count).format("H [Saat], m [Dk], s [Sn]")}`
                                    : `${x.completedCount} / ${x.count}`
                                }\` \n> **Kalan Süre: \`${x.finishDate - Date.now() > 0 ? moment.duration(x.finishDate - Date.now()).format("H [Saat], m [Dakika] s [Saniye]") : "Süresiz (Sınırsız)"}\`**\n> **Ödül:  \`${x.prizeCount} Puan\`**`
                            }`
                    )
                    .join("\n\n")}
                   `)
            ]
        });



    }
}
