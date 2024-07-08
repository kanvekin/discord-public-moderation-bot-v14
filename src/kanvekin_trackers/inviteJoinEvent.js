const { Events, EmbedBuilder, Collection } = require("discord.js")
const client = global.client;
const kanvekin_config = require("../../kanvekin_config");
const inviteDatas = require("../kanvekin_schemas/invitesSchema")
module.exports = async (member) => {
const kanvekin = new Collection();
 member.guild.invites.fetch().then((kanvekin) => {
kanvekin.map((x) => {kanvekin.set(x.code, {uses: x.uses, inviter: x.inviter, code: x.code });
});
client.invites.set(member.guild.id, kanvekin);
});

const fetchInvites = client.invites.get(member.guild.id) || new Collection();
const invites = await member.guild.invites.fetch();
const invite = invites.find((kanvekin) => fetchInvites.has(kanvekin.code) && kanvekin.uses > fetchInvites.get(kanvekin.code).uses) || fetchInvites.find((kanvekin) => !invites.has(kanvekin.code)) || member.guild.vanityURLCode;
let createTime = (Date.now() - member.user.createdTimestamp) >= 7*24*60*60*1000;
let url = member.guild.premiumTier == 3 ? await member.guild.fetchVanityData().then(kanvekin => kanvekin.uses) : 1;

if (invite == null || invite == undefined || !invite ) {
kanvekinSender(`**${member.user.tag} Adlı Kullanıcı <t:${Math.floor(Date.now()/1000)}:R> Sunucuya Katıldı!**\n> **\`Davet Eden;\` Bulunamadı**`)
}else if(invite == member.guild.vanityURLCode){
await inviteDatas.findOneAndUpdate({guildId: member.guild.id, userId: member.id }, { $set: { inviter: member.guild.id } }, { upsert: true });
kanvekinSender(`**${member.user.tag} Adlı Kullanıcı <t:${Math.floor(Date.now()/1000)}:R> Sunucuya Katıldı!**\n> **\`Davet Eden;\` Özel URL ( Toplam Daveti ${client.sayıEmoji(url)} )**`)
}else {
if(invite.inviter.id == member.user.id){
return kanvekinSender(`**${member.user.tag} Adlı Kullanıcı <t:${Math.floor(Date.now()/1000)}:R> Sunucuya Katıldı!**\n> **\`Davet Eden;\` Kendi Daveti**`)
}
if(createTime){
await inviteDatas.findOneAndUpdate({guildId: member.guild.id, userId: invite.inviter.id }, { $inc: { Regular: 1 } }, { upsert: true });
await inviteDatas.findOneAndUpdate({guildId: member.guild.id, userId: member.id }, { $set: { inviter: invite.inviter.id } }, { upsert: true });
let data = await inviteDatas.findOne({ guildId: member.guild.id, userId: invite.inviter.id });
let toplam = data ? data.Regular : 0;
kanvekinSender(`**${member.user.tag} Adlı Kullanıcı <t:${Math.floor(Date.now()/1000)}:R> Sunucuya Katıldı!**\n> **\`Davet Eden;\` ${invite.inviter.tag} ${toplam > 0 ? `( Toplam Daveti ${client.sayıEmoji(parseInt(toplam))} )` : " "}**`)
member.guild.members.cache.get(invite.inviter.id).updateTask(member.guild.id, "invite", 1, client.kanalbul("invite-log"));
}else {
await inviteDatas.findOneAndUpdate({guildId: member.guild.id, userId: invite.inviter.id }, { $inc: { Fake: 1 } }, { upsert: true });
await inviteDatas.findOneAndUpdate({guildId: member.guild.id, userId: member.id }, { $set: { inviter: invite.inviter.id } }, { upsert: true });
let data = await inviteDatas.findOne({ guildId: member.guild.id, userId: invite.inviter.id });
let toplam = data ? data.Regular : 0;
kanvekinSender(`**${member.user.tag} Adlı Kullanıcı <t:${Math.floor(Date.now()/1000)}:R> Sunucuya Katıldı!**\n> **\`Davet Eden;\` ${invite.inviter.tag} ${toplam > 0 ? `( Toplam Daveti ${client.sayıEmoji(parseInt(toplam))} )` : " "}**`,1)
}}

}
module.exports.conf = { name: Events.GuildMemberAdd }

function kanvekinSender(message,kanvekin = 0) {
    let log = client.kanalbul("invite-log");
    if (!log) return console.error("Sunucuda invite-log Adında Kanal Bulunmadığı İçin Davet Mesajı Gönderemedim!");
    let embed = new EmbedBuilder()
        .setColor("#00ff00")
        .setDescription(`> ${kanvekin == 0 ? client.emoji("emote_true") ? client.emoji("emote_true") : "✅" : client.emoji("emote_warn") ? client.emoji("emote_warn") : "⚠️"} ${message}`)
    log.send({ embeds: [embed] })
}
