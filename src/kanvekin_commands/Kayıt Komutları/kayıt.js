const { ActionRowBuilder,StringSelectMenuBuilder,PermissionFlagsBits, ButtonStyle,ButtonBuilder, Events } = require("discord.js");
const client = global.client;
const db = client.db;
const kanvekin_config = require("../../../kanvekin_config")
module.exports = {
name: "kayıt",
usage:"kayıt [@kanvekin / ID] <isim> <yaş>",
category:"kayıt",
aliases: ["k", "girl", "woman","e", "boy", "man","Man","Girl","Woman","woman","Boy","kız","erkek","KAYIT","Kayıt"],
execute: async (client, message, args, kanvekin_embed) => {
    let staffData = await db.get("kanvekin-register-staff") || [];
    let tagData = await db.get("kanvekin-tags") || [];
    let manRoles = await db.get("kanvekin-man-roles") || [];
    let womanRoles = await db.get("kanvekin-woman-roles") || [];
    let familyRoles = await db.get("kanvekin-family-roles") || [];
    let chatChannel = await db.get("kanvekin-channel-chat");

    if(!staffData.length > 0)return console.error("Kayıt Yetkilisi Ayarlı Değil!");
    if(!manRoles.length > 0)return console.error("Erkek Rolleri Ayarlı Değil!");
    if(!womanRoles.length > 0)return console.error("Kadın Rolleri Ayarlı Değil!");
    if(!familyRoles.length > 0)return console.error("Family Rolleri Ayarlı Değil!");
    if(!chatChannel)return console.error("Genel Chat Kanalı Ayarlı Değil!");


    if(!staffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator))return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);


const kanvekin_dropdown = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder()
.setCustomId('kanvekin_kayıt_command')
.setPlaceholder(`Cinsiyet Seçim!`)
.addOptions([
{label:`Erkek`,description:`Erkek Olarak Kayıt Et!`,value:`man`,emoji:`${kanvekin_config.manemoji}`},
{label:`Kız`,description:`Kız Olarak Kayıt Et!`,value:`woman`,emoji:`${kanvekin_config.womanemoji}`},
{label:`İptal`,description:`Kayıt İşlemini İptal Et!`,value:`exit`,emoji:`❌`}
])) 

let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
let name = args[1]
let age = args[2]
if (!member) return message.reply({ embeds:[kanvekin_embed.setDescription(`> **Geçerli Bir User Belirt!**`)]}).sil(5);
if(member.id == message.author.id) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Kendine İşlem Uygulayamazsın!**`)]}).sil(5);
if(member.user.bot) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Bir Bot'a İşlem Uygulayamazsın!**`)]}).sil(5);
if(db.has("kanvekin-welcome-tagmode")){
if (db.has("kanvekin-welcome-tagmode") && !tagData.some(tag => member.user.tag.includes(tag))) {
return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Taglı Alım Açık Olduğu İçin Sadece Taglı Kullanıcılar Kayıt Edilebilir!**`)] }).sil(5)
}}
if (!name) return message.reply({ embeds:[kanvekin_embed.setDescription(`> **Geçerli Bir İsim Belirt!**`)]}).sil(5);
if (name.lenght > 12)  return message.reply({embeds:[kanvekin_embed.setDescription(`> **İsim uzunluğu 12'den Büyük Olamaz!**`)]}).sil(5);
if (age && isNaN(age)) return message.reply({embeds:[kanvekin_embed.setDescription(`> **Yaşı Lütfen Sayı İle Belirt!**`)] }).sil(5);
if (age && age < kanvekin_config.minageAge)return message.reply({embeds:[kanvekin_embed.setDescription(`> **Kullanıcının Yaşı Geçerli Yaştan Küçük!**`)]}).sil(5);
let Name2 = name.toLocaleLowerCase()[0].toUpperCase() + name.toLocaleLowerCase().substring(1);
if (member.roles.cache.get(manRoles[0]) || member.roles.cache.get(womanRoles[0])) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Kayıtlı Bir Kullanıcıyı Tekrar Kayıt Edemezsin!**`)]}).sil(5);
if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **İşlem Geçersiz Senden Üst/Aynı Pozisyonda Birisini Kayıt Edemezsin!**`)] }).sil(5);
const names = db.get(`isimler_${member.id}`)
let mesajkanvekin;
if(names){
mesajkanvekin = message.reply({ embeds: [kanvekin_embed.setDescription(`> **Kullanıcının ismi** \`${kanvekin_config.tagSymbol} ${Name2}${age ? ` ${kanvekin_config.symbolkanvekin} ${age}` : ""}\` **Olarak Değiştirilecek!**\n> **Butonlardan Kullanıcının Cinsiyetini Seçiniz.**\n\n> **Kullanıcının Toplamda " ${names.length} " İsim Kayıtı Mevcut.**\n${names.slice(0,10).map((data, n) => `${data}`).join("\n")}`)], components: [kanvekin_dropdown] })
} 
if(!names){
mesajkanvekin = message.reply({ embeds: [kanvekin_embed.setDescription(`> **Kullanıcının ismi** \`${kanvekin_config.tagSymbol} ${Name2}${age ? ` ${kanvekin_config.symbolkanvekin} ${age}` : ""}\` **Olarak Değiştirilecek!**\n> **Butonlardan Kullanıcının Cinsiyetini Seçiniz.**`)], components: [kanvekin_dropdown] })}
const kyapan = await client.users.fetch(message.author.id) 
mesajkanvekin.then(b2 => {
const filter = i => i.user.id === message.member.id;
const collector = b2.createMessageComponentCollector({filter:filter, time: 30000 });
collector.on('collect', async b => {
if (!b.isStringSelectMenu()) return;
const value = b.values[0]


const row = new ActionRowBuilder()
.addComponents(
 new ButtonBuilder()
 .setCustomId('selamver')
 .setLabel("Selam Ver")
 .setEmoji("😉")
 .setStyle(ButtonStyle.Primary));

if (value === "man") {
message.member.updateTask(message.guild.id, "kayıt", 1, message.channel);
db.add(`erkek-${message.author.id}`, 1)
db.add(`toplamreg-${message.author.id}`, 1)
db.push(`isimler-${member.id}`, `\`${kanvekin_config.tagSymbol} ${Name2}${age ? ` ${kanvekin_config.symbolkanvekin} ${age}` : ""}\` (${manRoles.map((kanvekin) => `<@&${kanvekin}>`).join(",")} <t:${Math.floor(Date.now() / 1000)}> - ${kyapan.tag})`);
db.push(`kayıtlar-${message.author.id}`, `\`${kanvekin_config.tagSymbol} ${Name2}${age ? ` ${kanvekin_config.symbolkanvekin} ${age}` : ""}\` (${manRoles.map((kanvekin) => `<@&${kanvekin}>`).join(",")} <t:${Math.floor(Date.now() / 1000)}>)`);
if (tagData && tagData.some(tag => member.user.tag.includes(tag))) {

await member.roles.cache.has(message.guild.roles.premiumSubscriberRole ? message.guild.roles.premiumSubscriberRole.id : "5") ? member.roles.set([message.guild.roles.premiumSubscriberRole.id,...manRoles,...familyRoles]) : member.roles.set([...manRoles,...familyRoles])
await member.setNickname(`${kanvekin_config.tagSymbol} ${Name2}${age ? ` ${kanvekin_config.symbolkanvekin} ${age}` : ""}`).catch(e => { })

} else {
message.member.updateTask(message.guild.id, "kayıt", 1, message.channel);
await member.setNickname(`${kanvekin_config.normalSymbol} ${Name2}${age ? ` ${kanvekin_config.symbolkanvekin} ${age}` : ""}`).catch(e => { })
await member.roles.cache.has(message.guild.roles.premiumSubscriberRole ? message.guild.roles.premiumSubscriberRole.id : "5") ? member.roles.set([message.guild.roles.premiumSubscriberRole.id,...manRoles]) : member.roles.set([...manRoles])}
message.reply({ embeds: [kanvekin_embed.setDescription(`> **<@${member.id}> Kullanıcının ismi** \`${kanvekin_config.tagSymbol} ${Name2}${age ? ` ${kanvekin_config.symbolkanvekin} ${age}` : ""}\` **Olarak Değiştirildi**\n> **Ve ${kanvekin_config.manemoji} ${manRoles.map((kanvekin) => `<@&${kanvekin}>`).join(",")} Rolü Verilerek Kayıt Edildi.**`)]})
if(kanvekin_config.selamVer){
if(message.guild.channels.cache.get(chatChannel))message.guild.channels.cache.get(chatChannel).send({content:`> **${kanvekin_config.manemoji} ${member} Aramıza Hoşgeldin!**`,components:[row]}).sil(20);
}else{
if(message.guild.channels.cache.get(chatChannel))message.guild.channels.cache.get(chatChannel).send({content:`> **${kanvekin_config.manemoji} ${member} Aramıza Hoşgeldin!**`}).sil(20);
}

}
if (value === "woman") {
message.member.updateTask(message.guild.id, "kayıt", 1, message.channel);
db.add(`kadın-${message.author.id}`, 1)
db.add(`toplamreg-${message.author.id}`, 1)
db.push(`isimler-${member.id}`, `\`${kanvekin_config.tagSymbol} ${Name2}${age ? ` ${kanvekin_config.symbolkanvekin} ${age}` : ""}\` (${womanRoles.map((kanvekin) => `<@&${kanvekin}>`).join(",")} <t:${Math.floor(Date.now() / 1000)}> - ${kyapan.tag})`);
db.push(`kayıtlar-${message.author.id}`, `\`${kanvekin_config.tagSymbol} ${Name2}${age ? ` ${kanvekin_config.symbolkanvekin} ${age}` : ""}\` (${womanRoles.map((kanvekin) => `<@&${kanvekin}>`).join(",")} <t:${Math.floor(Date.now() / 1000)}>)`);

if (tagData && tagData.some(tag => member.user.tag.includes(tag))) {
await member.roles.cache.has(message.guild.roles.premiumSubscriberRole ? message.guild.roles.premiumSubscriberRole.id : "5") ? member.roles.set([message.guild.roles.premiumSubscriberRole.id,...womanRoles,...familyRoles]) : member.roles.set([...womanRoles,...familyRoles]);
await member.setNickname(`${kanvekin_config.tagSymbol} ${Name2}${age ? ` ${kanvekin_config.symbolkanvekin} ${age}` : ""}`).catch(e => { })

} else {
message.member.updateTask(message.guild.id, "kayıt", 1, message.channel);
await member.setNickname(`${kanvekin_config.normalSymbol} ${Name2}${age ? ` ${kanvekin_config.symbolkanvekin} ${age}` : ""}`).catch(e => { })
await member.roles.cache.has(message.guild.roles.premiumSubscriberRole ? message.guild.roles.premiumSubscriberRole.id : "5") ? member.roles.set([message.guild.roles.premiumSubscriberRole.id,...womanRoles]) : member.roles.set([...womanRoles])}
message.reply({ embeds: [kanvekin_embed.setDescription(`> **<@${member.id}> Kullanıcının ismi** \`${Name2}${age ? ` ${kanvekin_config.symbolkanvekin} ${age}` : ""}\` **Olarak Değiştirildi**\n> **Ve ${kanvekin_config.womanemoji} ${womanRoles.map((kanvekin) => `<@&${kanvekin}>`).join(",")} Rolü Verilerek Kayıt Edildi.**`)]})
if(kanvekin_config.selamVer){
    if(message.guild.channels.cache.get(chatChannel))message.guild.channels.cache.get(chatChannel).send({content:`> **${kanvekin_config.womanemoji} ${member} Aramıza Hoşgeldin!**`,components:[row]}).sil(20);
    }else{
    if(message.guild.channels.cache.get(chatChannel))message.guild.channels.cache.get(chatChannel).send({content:`> **${kanvekin_config.womanemoji} ${member} Aramıza Hoşgeldin!**`}).sil(20);
    }


}
if (value === "exit") {
message.delete();
if(kanvekin_config.kayitsizHesapIsim.length > 0)await member.setNickname(kanvekin_config.kayitsizHesapIsim)
message.channel.send({ embeds: [kanvekin_embed.setDescription(`> **İşlem Başarıyla İptal Edildi!**`)]}).sil(10)
}
collector.stop()
b.message.delete().catch(e => { console.error(e) })

})
})
}
}


client.on(Events.InteractionCreate,async(kanvekin) => {
    if(!kanvekin.isButton())return;
    if(kanvekin.customId == "selamver"){
        kanvekin.channel.createWebhook({
            name: `${kanvekin.member.user.username}`,
            avatar: `${kanvekin.member.user.displayAvatarURL({forceStatic: true,extension:"png"})}`,
        }).then(x => x.send({content:`**${kanvekin.message.mentions.users.first()} Selam, Hoşgeldin!**`}) && setTimeout(async() => {x.delete()}, 3000))
        kanvekin.message.delete();
    }
    })