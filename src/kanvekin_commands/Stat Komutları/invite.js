const { PermissionFlagsBits, ButtonStyle, ButtonBuilder, ActionRowBuilder, Events, EmbedBuilder, StringSelectMenuBuilder, ComponentType, codeBlock } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr");
const messageUserChannel = require("../../kanvekin_schemas/messageChannelsSchema");
const voiceUserChannel = require("../../kanvekin_schemas/voiceChannelsSchema");
const messageUser = require("../../kanvekin_schemas/messagesSchema");
const voiceUser = require("../../kanvekin_schemas/voicesSchema");
const voiceUserParent = require("../../kanvekin_schemas/voiceParentsSchema");
const invite = require("../../kanvekin_schemas/invitesSchema");
module.exports = {
    name: "invite",
    usage: "invite [@kanvekin / ID]",
    category: "stat",
    aliases: ["davet", "davetim", "invites", "davetlerim"],
    execute: async (client, message, args, kanvekin_embed) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        let davet = await invite.findOne({ guildId: message.guild.id, userId: member.user.id });
      kanvekin_embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
      kanvekin_embed.setDescription(`> **${member.user.toString()} Kullanıcısının Davet Verileri;**\n \n`)
      .addFields(
      { name: `${client.emoji("emote_invite") !== null ? client.emoji("emote_invite"):"📩"} • **Toplam Davet**`,  value: codeBlock("js",`Gerçek: ${davet ? davet.Regular : 0}, Sahte: ${davet ? davet.Fake :0}, Ayrılan: ${davet ? davet.Left : 0}, Bonus: ${davet ? davet.Bonus : 0}`)}
      )
      return message.reply({embeds: [kanvekin_embed]})

    }
}
