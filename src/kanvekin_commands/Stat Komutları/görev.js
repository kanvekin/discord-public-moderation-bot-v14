const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder, StringSelectMenuBuilder, ComponentType, codeBlock, Embed } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
const ms = require("ms")
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
    name: "görev",
    usage: "görev",
    category: "stat",
    aliases: ["task", "görev-al", "göreval", "gettask", "taskget"],
    execute: async (client, message, args, kanvekin_embed) => {
        if(!kanvekin_config.staffs.some(kanvekin => message.member.roles.cache.has(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers))return message.reply({embeds:[kanvekin_embed.setDescription(`> **Yeterli Yetki Bulunmamakta!**`)]}).sil(5);

        let member = message.member;
        let buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Mesaj Görevi")
                .setCustomId("task-chat")
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`${client.emoji("emote_chat") !== null ? client.emoji("emote_chat") : "💭"}`),
            new ButtonBuilder()
                .setLabel("Ses Görevi")
                .setCustomId("task-voice")
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`${client.emoji("emote_voice") !== null ? client.emoji("emote_voice") : "🔉"}`),
            new ButtonBuilder()
                .setLabel("Davet Görevi")
                .setCustomId("task-invite")
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`${client.emoji("emote_invite") !== null ? client.emoji("emote_invite") : "📩"}`),
            new ButtonBuilder()
                .setLabel("Taglı Görevi")
                .setCustomId("task-tag")
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`${client.emoji("emote_others") !== null ? client.emoji("emote_others") : "🔹"}`),
            new ButtonBuilder()
                .setLabel("Kayıt Görevi")
                .setCustomId("task-reg")
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`${client.emoji("emote_others") !== null ? client.emoji("emote_others") : "🖋️"}`),
        )
        const tasks = await task.find({ guildId: message.guild.id, userId: message.author.id });
       if(tasks.filter((x) => x.active).length >= 3)return message.reply({embeds:[kanvekin_embed.setDescription(`> **En Fazla 3 Aktif Görevin Bulunabilir, Yeni Görev Almak İçin Eski Görevlerini Bitirmelisin!**`)]}).sil(5);

        let mesaj = await message.reply({ components: [buttons], embeds: [kanvekin_embed.setDescription(`> **${message.member} Aşağıdaki Görev Tiplerinden Birini Seçiniz.**\n> **Seçtiğiniz Tipe Göre Rastgele Adetli Görev Verilecek!**\n\n> **${client.emoji("emote_chat") !== null ? client.emoji("emote_chat") : "💭"} Mesaj Görevi;** *Sunucudaki ${db.has("kanvekin-channel-chat") ? message.guild.channels.cache.get(db.get("kanvekin-channel-chat")) : "Genel Sohbet"} Kanalında Mesaj Yazma Görevi.*\n\n> **${client.emoji("emote_voice") !== null ? client.emoji("emote_voice") : "🔉"} Ses Görevi;** *Sunucu Sesli Kanallarında Bulunma / Vakit Geçirme Görevi.*\n\n> **${client.emoji("emote_invite") !== null ? client.emoji("emote_invite") : "📩"} Davet Görevi;** *Sunucumuza Yeni Üyeler Davet(Invite) Etme Görevi.*\n\n> **${client.emoji("emote_others") !== null ? client.emoji("emote_others") : "🔹"} Taglı Görevi;** *Üyelere / Kullanıcılara Tag Aldırma Görevi.*\n\n> **${client.emoji("emote_others") !== null ? client.emoji("emote_others") : "🖋️"} Kayıt Görevi;** *Sunucumuza Yeni Gelen Üyeleri Karşılama / Kayıt Etme Görevi.*`).setThumbnail(message.author.displayAvatarURL({ dynamic: true }))] })

        const filter = i => i.user.id === message.member.id;
        const collector = mesaj.createMessageComponentCollector({ componentType: ComponentType.Button, filter: filter, time: 30000 });

        collector.on('end', async b => {
            buttons.components[0].setDisabled(true);
            buttons.components[1].setDisabled(true);
            buttons.components[2].setDisabled(true);
            buttons.components[3].setDisabled(true);
            buttons.components[4].setDisabled(true);
            mesaj.edit({ content: `> **Menü Zaman Aşımına Uğradı..**`, components: [buttons] })
        })

        collector.on('collect', async b => {
            if (!b.isButton()) return;
            const value = b.customId;

            if (value == "task-chat") {
                let task = client.tasks.filter(kanvekin => kanvekin.type == "mesaj").random();
                await member.giveTask(message.guild.id, task.type, task.count, task.prizeCount, true, task.duration);
                b.update({ components: [], embeds: [kanvekin_embed.setDescription(`> **Görev Tipi: \`${task.type}\`**\n> **Görev Süresi: \`${ms(task.duration).replace(/s/, ' Saniye').replace(/m/, ' Dakika').replace(/h/, ' Saat').replace(/d/, ' Gün')}\`**\n> **Görev Tamamlama Sayısı: \`${task.type === "ses" ? task.count / 1000 / 60 + " dakika" : task.count}\`**\n> **Görev Ödülü: \`${task.prizeCount} Puan\`**`)] })
            }

            if (value == "task-voice") {
                let task = client.tasks.filter(kanvekin => kanvekin.type == "ses").random();
                await member.giveTask(message.guild.id, task.type, task.count, task.prizeCount, true, task.duration);
                b.update({ components: [], embeds: [kanvekin_embed.setDescription(`> **Görev Tipi: \`${task.type}\`**\n> **Görev Süresi: \`${ms(task.duration).replace(/s/, ' Saniye').replace(/m/, ' Dakika').replace(/h/, ' Saat').replace(/d/, ' Gün')}\`**\n> **Görev Tamamlama Sayısı: \`${task.type === "ses" ? task.count / 1000 / 60 + " dakika" : task.count}\`**\n> **Görev Ödülü: \`${task.prizeCount} Puan\`**`)] })
            }

            if (value == "task-invite") {
                let task = client.tasks.filter(kanvekin => kanvekin.type == "invite").random();
                await member.giveTask(message.guild.id, task.type, task.count, task.prizeCount, true, task.duration);
                b.update({ components: [], embeds: [kanvekin_embed.setDescription(`> **Görev Tipi: \`${task.type}\`**\n> **Görev Süresi: \`${ms(task.duration).replace(/s/, ' Saniye').replace(/m/, ' Dakika').replace(/h/, ' Saat').replace(/d/, ' Gün')}\`**\n> **Görev Tamamlama Sayısı: \`${task.type === "ses" ? task.count / 1000 / 60 + " dakika" : task.count}\`**\n> **Görev Ödülü: \`${task.prizeCount} Puan\`**`)] })
            }

            if (value == "task-tag") {
                let task = client.tasks.filter(kanvekin => kanvekin.type == "taglı").random();
                await member.giveTask(message.guild.id, task.type, task.count, task.prizeCount, true, task.duration);
                b.update({ components: [], embeds: [kanvekin_embed.setDescription(`> **Görev Tipi: \`${task.type}\`**\n> **Görev Süresi: \`${ms(task.duration).replace(/s/, ' Saniye').replace(/m/, ' Dakika').replace(/h/, ' Saat').replace(/d/, ' Gün')}\`**\n> **Görev Tamamlama Sayısı: \`${task.type === "ses" ? task.count / 1000 / 60 + " dakika" : task.count}\`**\n> **Görev Ödülü: \`${task.prizeCount} Puan\`**`)] })
            }

            if (value == "task-reg") {
                let task = client.tasks.filter(kanvekin => kanvekin.type == "kayıt").random();
                await member.giveTask(message.guild.id, task.type, task.count, task.prizeCount, true, task.duration);
                b.update({ components: [], embeds: [kanvekin_embed.setDescription(`> **Görev Tipi: \`${task.type}\`**\n> **Görev Süresi: \`${ms(task.duration).replace(/s/, ' Saniye').replace(/m/, ' Dakika').replace(/h/, ' Saat').replace(/d/, ' Gün')}\`**\n> **Görev Tamamlama Sayısı: \`${task.type === "ses" ? task.count / 1000 / 60 + " dakika" : task.count}\`**\n> **Görev Ödülü: \`${task.prizeCount} Puan\`**`)] })
            }
        })



    }
}
