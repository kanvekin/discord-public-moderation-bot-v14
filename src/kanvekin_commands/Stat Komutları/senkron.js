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
const taggeds = require("../../kanvekin_schemas/taggedsSchema")
module.exports = {
    name: "senkron",
    usage: "senkron [@kanvekin / ID",
    category: "stat",
    aliases: ["senkron","senkronize"],
    execute: async (client, message, args, kanvekin_embed) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!kanvekin_config.staffs.some(kanvekin => message.member.roles.cache.has(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers))return message.reply({embeds:[kanvekin_embed.setDescription(`> **Yeterli Yetki Bulunmamakta!**`)]}).sil(5);
        if(!member)return message.reply({embeds:[kanvekin_embed.setDescription(`> **Geçerli Bir User Belirt!**`)]}).sil(5);
	if (client.ranks.some((x) => member.hasRole(x.role))) {
				let rank = client.ranks.filter((x) => member.hasRole(x.role));
				rank = rank[rank.length - 1];
				await point.updateOne({ guildId: message.guild.id, userId: member.user.id }, { $set: { point: rank.point } }, { upsert: true });
				message.reply({
					embeds: [
						kanvekin_embed.setDescription(
							`> **${member.toString()} Üyesinde ${Array.isArray(rank.role) ? rank.role.map((x) => `<@&${x}>`).join(", ") : `<@&${rank.role}>`} Rolü Bulundu Ve Soul'u ${rank.point} Olarak Değiştirildi!**`
						)
					]
				});
			} else return message.reply({ embeds: [kanvekin_embed.setDescription(`> **${member.toString()} Üyesinde Sistemde Ayarlı Bir Rol Bulunamadı!**`)] });
    }
}
