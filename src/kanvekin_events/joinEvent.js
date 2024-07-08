const kanvekin_config = require("../../kanvekin_config");
const { Events } = require('discord.js');
const client = global.client;
const db = client.db;
const canvafy = require("canvafy");
module.exports = async (member) => {
if(member.guild.id !== kanvekin_config.guildID || member.user.bot)return;
let staffData = await db.get("kanvekin-register-staff") || [];
let unregisterRoles = await db.get("kanvekin-unregister-roles") || [];
let kanvekinImage = await db.get("kanvekin-welcome-image");
let kanvekinMentions = await db.get("kanvekin-welcome-mentions");
let tagData = await db.get("kanvekin-tags") || [];
let welcomeChannel = await db.get("kanvekin-channel-welcome");
let jailRoles = await db.get("kanvekin-jail-roles") || [];
let forcedata = await db.get(`forcebans`) || [];
let aktifPunish =  await db.get(`aktifceza-${member.id}`)
if(!staffData.length > 0)return console.error("Kayıt Yetkilisi Ayarlı Değil!");
if(!unregisterRoles.length > 0)return console.error("Kayıtsız Rolleri Ayarlı Değil!");
if(!jailRoles.length > 0)return console.error("Jail Rolleri Ayarlı Değil!");
if(!welcomeChannel)return console.error("Welcome / Hoşgeldin Kanalı Ayarlı Değil!");

if(!member.guild.channels.cache.get(welcomeChannel)){
console.log(`[ 🚨 ] Welcome / Hoşgeldin Kanalı Bulunamadı,Kanalın Varlığını Kontrol Edin; ${member.user.tag} Kullanıcısı Sunucuya Katıldı`)
return;
}
var kurulus = (Date.now() - member.user.createdTimestamp);

let kanvekinWelcomeMessage = `**${client.emoji("emote_hi") !== null ? client.emoji("emote_hi"):"🎉"} Merhabalar ${member}, Seninle Beraber Sunucumuz ${client.sayıEmoji(member.guild.memberCount)} Üye Sayısına Ulaştı!**\n\n **Hesabın <t:${Math.floor(member.user.createdTimestamp / 1000)}> Tarihinde (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) Önce Oluşturulmuş,Sunucumuza <t:${Math.floor(Date.now() / 1000)}:R> Giriş Yaptın!**\n\n **Kayıt Olduktan Sonra Kurallar Kanalını Okuduğunuzu Kabul Edeceğiz Ve İçeride Yapılacak Cezalandırma İşlemlerini Bunu Göz Önünde Bulundurarak Yapacağız.**\n\n **${tagData.length > 0 ? `Tagımız: \`\`${tagData ? tagData.map((kanvekin) => `${kanvekin}`).join(",") : "kanvekin_Error"}\`\`'ı Alarak Bize Destek Olabilirsin, ` : ""}İyi Sohbetler Dileriz.**${kanvekinMentions ? `\n${staffData.length > 0 ? `||${staffData.map((kanvekin) => `<@&${kanvekin}>`).join(",")}||`:""}`:""}`;

if(forcedata.includes(member.id)){
    member.guild.members.ban(member.id,{reason:`FORCEBAN Cezası Almış, Geri Banlandı!`});
   return member.guild.channels.cache.get(welcomeChannel).send({content:`> **${client.emoji("emote_warn") !== null ? client.emoji("emote_warn") : "⚠️"} ${member} Kullanıcısının Forceban Cezası Olmasına Rağmen Sunucuya Girdi, Üye Tekrardan Sunucudan Banlandı!**`})
}else if(aktifPunish && aktifPunish == "JAIL"){
    if(jailRoles.length > 0)member.roles.set([...jailRoles]);
    member.setNickname("[JAILED]");
    return member.guild.channels.cache.get(welcomeChannel).send({content:`> **${client.emoji("emote_warn") !== null ? client.emoji("emote_warn") : "⚠️"} ${member} Kullanıcısının Jail Cezası Olmasına Rağmen Sunucuya Girdi, Üye Tekrardan Jail'e Atıldı!**`})
}else if(aktifPunish && aktifPunish == "CMUTE" || aktifPunish == "VMUTE"){
    member.timeout(1200000,'Aktif Mute Cezasından Kaçma!')
    return member.guild.channels.cache.get(welcomeChannel).send({content:`> **${client.emoji("emote_warn") !== null ? client.emoji("emote_warn") : "⚠️"} ${member} Kullanıcısının Mute Cezası Olmasına Rağmen Sunucuya Girdi, Üyeye Bir Süreliğine Timeout Uygulandı!**`})
}

if (kurulus > 604800000) {
if(!member.user.bot && unregisterRoles.length > 0)member.roles.set([...unregisterRoles])

member.setNickname(kanvekin_config.kayitsizHesapIsim);
if(kanvekinImage){
const welcome = await new canvafy.WelcomeLeave()
.setAvatar(member.user.avatarURL({forceStatic:true,extension:"png"}))
.setBackground("image", kanvekin_config.welcomeResimURL)
.setTitle(`${member.user.username}`)
.setDescription("Sunucumuza Hoşgeldin!")
.setBorder(kanvekin_config.welcomeResimRenk)
.setAvatarBorder(kanvekin_config.welcomeResimRenk)
.setOverlayOpacity(0.65)
.build();
member.guild.channels.cache.get(welcomeChannel).send({files:[{attachment: welcome,name: `kanvekin_welcome_${member.id}.png`}],content:kanvekinWelcomeMessage});
}else{
member.guild.channels.cache.get(welcomeChannel).send({content:kanvekinWelcomeMessage});
}
} else {
if(jailRoles.length > 0)member.roles.set([...jailRoles]);
member.setNickname(kanvekin_config.supheliHesapIsim);
member.guild.channels.cache.get(welcomeChannel).send({ content: `**⚠ ${member}, Kullanıcısı Sunucuya Katıldı Hesabı <t:${Math.floor(member.user.createdTimestamp / 1000)}> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>) Önce Açıldığı İçin Şüpheli Rolü Verildi.**\n**Sunucumuza <t:${Math.floor(Date.now() / 1000)}:R> Zamanında Giriş Yaptı!**`})}
}
module.exports.conf = { name: Events.GuildMemberAdd }
