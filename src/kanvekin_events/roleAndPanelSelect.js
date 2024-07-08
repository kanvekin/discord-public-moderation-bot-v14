const kanvekin_config = require("../../kanvekin_config");
const { Events,ModalBuilder,TextInputBuilder,TextInputStyle,ActionRowBuilder, EmbedBuilder} = require('discord.js');
const client = global.client;
const db = client.db;
const canvafy = require("canvafy");
const axios = require("axios");
module.exports = async(kanvekin) => {
if(kanvekin.isStringSelectMenu()){
let value = kanvekin.values[0];
if(kanvekin.customId == "btnpanel"){
switch (value) {
  case "btn1":
    kanvekin.reply({content:`> **📣 Sunucumuza <t:${Math.floor(kanvekin.member.joinedAt/1000)}> Tarihinde (<t:${Math.floor(kanvekin.member.joinedAt/1000)}:R>) Giriş Yapmışsın!**`,ephemeral:true})
    break;
    case "btn2":
      kanvekin.reply({content:`> **${(kanvekin.member.roles.cache.filter(kanvekin => kanvekin.name !== '@everyone').map(lulu => lulu).join(' ') ? kanvekin.member.roles.cache.filter(kanvekin => kanvekin.name !== '@everyone').map(lulu => lulu).join(', ') : 'Üzerinde Hiç Rol Bulunmamakta!')}**`,ephemeral:true})
      break;
    case "btn3":
      kanvekin.reply({content:`> **📣 Hesabını <t:${Math.floor(kanvekin.member.user.createdAt/1000)}> Tarihinde (<t:${Math.floor(kanvekin.member.user.createdAt/1000)}:R>) Açmışsın!**`,ephemeral:true})
    break;
    case "btn4":
      let names = await db.get(`isimler-${kanvekin.member.id}`);
      if(names)names.reverse();
      kanvekin.reply({content:`> **Sunucumuzdaki Son ${client.sayıEmoji(10)} İsim Geçmişin!**\n\n${!names ? "**İsim Geçmişi Bulunamadı!**":names.slice(0,10).map(kanvekin => `${kanvekin}`).join("\n")}`,ephemeral:true})
    break;
    case "btn5":
      let aktif = kanvekin.guild.members.cache.filter(member => member.presence && (member.presence.status !== "offline")).size;
      let uye = kanvekin.guild.memberCount;
      let sesli = kanvekin.guild.members.cache.filter(kanvekin => kanvekin.voice.channel).size;
      let boost = kanvekin.guild.premiumSubscriptionCount;
      kanvekin.reply({content:`> **Sunucumuzda ${client.sayıEmoji(uye)} Üye Bulunmakta.**\n> **Sunucumuzda ${client.sayıEmoji(aktif)} Aktif Üye Bulunmakta.**\n> **Seste ${client.sayıEmoji(sesli)} Üye Bulunmakta.**\n> **Sunucumuzda ${client.sayıEmoji(boost)} Takviye Bulunuyor.**`,ephemeral:true})
    break;
    case "btn6":
      let ceza = await db.get(`sicil-${kanvekin.member.id}`);
      if(ceza)ceza.reverse();
      kanvekin.reply({content:`> **Sunucumuzdaki Son ${client.sayıEmoji(10)} Ceza Geçmişin!**\n\n${!ceza ? "**Ceza Geçmişi Bulunamadı!**":ceza.slice(0,10).map(kanvekin => `${kanvekin}`).join("\n")}`,ephemeral:true})
    break;
    case "btn7":
    kanvekin.reply({ content: `> **${kanvekin.user.tag}**`, files: [{ attachment: `${kanvekin.user.displayAvatarURL({size:2048,dynamic:true,forceStatic:true})}` }],ephemeral:true})
    break;
    case "btn8":
      async function bannerURL(user, client) {
        const response = await axios.get(`https://discord.com/api/v9/users/${user}`, { headers: { 'Authorization': `Bot ${client.token}` } });
        if (!response.data.banner) return `http://colorhexa.com/${response.data.banner_color.replace("#", "")}.png`
        if (response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`
        else return (`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`)
    }
    let bannerurl = await bannerURL(kanvekin.user.id, client)
    kanvekin.reply({ content: `> **${kanvekin.user.tag}**`, files: [{ attachment: `${bannerurl}` }],ephemeral:true})
    break;
}

}else if(kanvekin.customId == "burclar"){
    let burçlar = new Map([
        ["koç", client.rolbul("Koç").id],
        ["boğa", client.rolbul("Boğa").id],
        ["ikizler", client.rolbul("İkizler").id],
        ["yengeç", client.rolbul("Yengeç").id],
        ["aslan", client.rolbul("Aslan").id],
        ["başak", client.rolbul("Başak").id],
        ["terazi", client.rolbul("Terazi").id],
        ["akrep", client.rolbul("Akrep").id],
        ["yay", client.rolbul("Yay").id],
        ["oğlak", client.rolbul("Oğlak").id],
        ["kova", client.rolbul("Kova").id],
        ["balık", client.rolbul("Balık").id]
      ])
      let roles = [client.rolbul("Koç").id,client.rolbul("Boğa").id,client.rolbul("İkizler").id,client.rolbul("Yengeç").id,client.rolbul("Aslan").id,client.rolbul("Başak").id,client.rolbul("Terazi").id,client.rolbul("Akrep").id,client.rolbul("Yay").id,client.rolbul("Oğlak").id,client.rolbul("Kova").id,client.rolbul("Balık").id]
      let role = burçlar.get(value)
      if (value === "roldelete") {
        await kanvekin.member.roles.remove(roles)
      } else if (role) {
        if (roles.some(role => kanvekin.member.roles.cache.has(role))) {
        await kanvekin.member.roles.remove(roles)
        }
        await kanvekin.member.roles.add(role)
      }
      kanvekin.reply({ content:`> **${kanvekin.member} Rollerin Güncellendi!**`, ephemeral: true }) 
}else if(kanvekin.customId == "iliskiler"){
    let burçlar = new Map([
        ["sevvar", client.rolinc("sevgilim var").id],
        ["sevyok", client.rolinc("sevgilim yok").id],
        ["sevyapmiyorum", client.rolinc("sevgili yapmıyorum").id],
      ])
      let roles = [client.rolinc("sevgilim var").id,client.rolinc("sevgilim yok").id,client.rolinc("sevgili yapmıyorum").id]
      let role = burçlar.get(value)
      if (value === "roldelete") {
        await kanvekin.member.roles.remove(roles)
      } else if (role) {
        if (roles.some(role => kanvekin.member.roles.cache.has(role))) {
        await kanvekin.member.roles.remove(roles)
        }
        await kanvekin.member.roles.add(role)
      }
      kanvekin.reply({ content:`> **${kanvekin.member} Rollerin Güncellendi!**`, ephemeral: true }) 
}else if(kanvekin.customId == "renkler"){
    let burçlar = new Map([
        ["kırmızı", client.rolbul("🍓").id],
        ["yeşil", client.rolbul("🍏").id],
        ["sarı", client.rolbul("🍌").id],
        ["mor", client.rolbul("🍇").id],
        ["beyaz", client.rolbul("🌼").id],
        ["turuncu", client.rolbul("🥕").id],
      ])
      let roles = [client.rolbul("🍓").id,client.rolbul("🍏").id,client.rolbul("🍌").id,client.rolbul("🍇").id,client.rolbul("🌼").id,client.rolbul("🥕").id]
      let role = burçlar.get(value)
      if (value === "roldelete") {
        await kanvekin.member.roles.remove(roles)
      } else if (role) {
        if (roles.some(role => kanvekin.member.roles.cache.has(role))) {
        await kanvekin.member.roles.remove(roles)
        }
        await kanvekin.member.roles.add(role)
      }
      kanvekin.reply({ content:`> **${kanvekin.member} Rollerin Güncellendi!**`, ephemeral: true }) 
}else if(kanvekin.customId == "etkinlikler"){
    let ozeller = new Map([
        ["etkinlikrol", client.rolinc("etkinlik katılımcısı").id],
      ])
      let roles = [client.rolinc("etkinlik katılımcısı").id]
      var role = []
      for (let index = 0; index < kanvekin.values.length; index++) {
        let ids = kanvekin.values[index]
        let den = ozeller.get(ids)
        role.push(den)
      }
      if (kanvekin.values.some(kanvekin => kanvekin.includes("roldelete"))) {  await kanvekin.member.roles.remove(roles)}else
      if (!kanvekin.values.length) {
        await kanvekin.member.roles.remove(roles)
      } else {
        await kanvekin.member.roles.remove(roles)
        await kanvekin.member.roles.add(role)
      } 
      kanvekin.reply({ content:`> **${kanvekin.member} Rollerin Güncellendi!**`, ephemeral: true }) 
}




}else if(kanvekin.isButton()){
let value = kanvekin.customId;

if(value == "istekoneri"){
    const istmodal = new ModalBuilder()
    .setCustomId('istekModal')
    .setTitle('Yetk Başvuru');
const sika2 = new TextInputBuilder()
    .setCustomId('soru1')
    .setLabel("Bir İstek & Öneri Belirtin")
    .setPlaceholder("Örn; Oyun Kanalları Açılsın")
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(5)
    .setMaxLength(50)
    .setRequired(true);
    let row2 = new ActionRowBuilder().addComponents(sika2);
    istmodal.addComponents(row2);
    await kanvekin.showModal(istmodal)
}
if(value == "sikayet"){
    const sikamodal = new ModalBuilder()
    .setCustomId('sikayetModal')
    .setTitle('Şikayet Sistemi');
const sika = new TextInputBuilder()
    .setCustomId('soru1')
    .setLabel("Bir Şikayet Belirtin")
    .setPlaceholder("Örn; @kanvekin Kullanıcısı Küfür Etti")
    .setStyle(TextInputStyle.Paragraph)
    .setMinLength(5)
    .setMaxLength(50)
    .setRequired(true);
    let row = new ActionRowBuilder().addComponents(sika);
    sikamodal.addComponents(row);
    await kanvekin.showModal(sikamodal)
}

if(value == "ytbasvur"){
    let familyRoles = await db.get("kanvekin-family-roles") || [];
    if(familyRoles.length > 0){
    if(!familyRoles.some(kanvekin => kanvekin.member.roles.cache.get(kanvekin)))return kanvekin.reply({content:`> **Üzerinde ${kanvekin.guild.roles.cache.get(familyRoles[0]) ? kanvekin.guild.roles.cache.get(familyRoles[0]):"Tag"} Bulunmadığı İçin İşlem Gerçekleştirilemedi!**`})
    }
    const modal = new ModalBuilder()
    .setCustomId('ytbasvurModal')
    .setTitle('Yetkili Başvuru');
const gv1 = new TextInputBuilder()
    .setCustomId('soru1')
    .setLabel("Günlük Kaç Saat Aktif Olabilirsin?")
    .setPlaceholder("Örn; 5 Saat")
    .setMaxLength(30)
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);
const gv2 = new TextInputBuilder()
    .setCustomId('soru2')
    .setLabel("Daha Önce Yetkili Oldunuzmu?")
    .setMinLength(3)
    .setMaxLength(15)
    .setPlaceholder("Örn; Evet")
    .setStyle(TextInputStyle.Paragraph)   
    .setRequired(true);
    const gv3 = new TextInputBuilder()
    .setCustomId('soru3')
    .setMinLength(2)
    .setMaxLength(15)
    .setLabel("İnsanlarla İletişiminiz Nasıl?")
    .setPlaceholder("Örn; Güzel,İyi")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);
    const gv4 = new TextInputBuilder()
    .setCustomId('soru4')
    .setLabel("Yetkililikten Beklentiniz Nedir?")
    .setMinLength(2)
    .setMaxLength(30)
    .setPlaceholder("Örn; Şu Görevleri Yaparım")
    .setStyle(TextInputStyle.Short)
    .setRequired(true);
    const gv5 = new TextInputBuilder()
    .setCustomId('soru5')
    .setLabel("Bonus) Eklemek İstediğiniz Bişey Varsa")
    .setMinLength(2)
    .setMaxLength(30)
    .setRequired(false)
    .setStyle(TextInputStyle.Short);

    let g1 = new ActionRowBuilder().addComponents(gv1);
    let g2 = new ActionRowBuilder().addComponents(gv2);
    let g3 = new ActionRowBuilder().addComponents(gv3);
    let g4 = new ActionRowBuilder().addComponents(gv4);
    let g5 = new ActionRowBuilder().addComponents(gv5);
    modal.addComponents(g1, g2, g3, g4, g5);
    await kanvekin.showModal(modal)
}

}else if(kanvekin.isModalSubmit()){
let value = kanvekin.customId;
if(value == "ytbasvurModal"){
let s1 = kanvekin.fields.getTextInputValue('soru1');
let s2 = kanvekin.fields.getTextInputValue('soru2');
let s3 = kanvekin.fields.getTextInputValue('soru3');
let s4 = kanvekin.fields.getTextInputValue('soru4');
let s5 = kanvekin.fields.getTextInputValue('soru5') || "\`Boş Bırakılmış\`";
    kanvekin.reply({content:`> **${client.emoji("emote_true") !== null ? client.emoji("emote_true") : "✅"} Yetkili Başvurun Alındı!**`,ephemeral:true});
  if(client.kanalbul("yetkili-başvurular")){
   let embed = new EmbedBuilder()
   .setColor("Random")
   .setTitle("Yetkili Başvurusu")
   .setURL("https://discord.gg/82")
   .setThumbnail(kanvekin.user.displayAvatarURL({dynamic:true,forceStatic:true}))
   .addFields([
   {name:`Soru ${client.sayıEmoji(1)}`,value:`> ${s1}`,inline:false},
   {name:`Soru ${client.sayıEmoji(2)}`,value:`> ${s2}`,inline:false},
   {name:`Soru ${client.sayıEmoji(3)}`,value:`> ${s3}`,inline:false},
   {name:`Soru ${client.sayıEmoji(4)}`,value:`> ${s4}`,inline:false},
   {name:`Bonus ${client.sayıEmoji(5)}`,value:`> ${s5}`,inline:false},
   ])
   client.kanalbul("yetkili-başvurular").send({embeds:[embed]})
  } else console.error("yetkili-başvurular İsimli Kanal Sunucuda Bulunmamakta, Yetkili Başvurusu Gönderilemedi!")
}
if(value == "istekModal"){
  let s1 = kanvekin.fields.getTextInputValue('soru1');
      kanvekin.reply({content:`> **${client.emoji("emote_true") !== null ? client.emoji("emote_true") : "✅"} Başvurun Alındı!**`,ephemeral:true});
    if(client.kanalbul("others-log")){
     let embed = new EmbedBuilder()
     .setColor("Random")
     .setTitle("İstek & Öneri Başvurusu")
     .setURL("https://discord.gg/82")
     .setThumbnail(kanvekin.user.displayAvatarURL({dynamic:true,forceStatic:true}))
     .addFields([
     {name:`Bildiri`,value:`> ${s1}`,inline:false},
     ])
     client.kanalbul("others-log").send({embeds:[embed]})
    } else console.error("others-log İsimli Kanal Sunucuda Bulunmamakta, Modal Gönderilemedi!")
  }
  if(value == "sikayetModal"){
    let s1 = kanvekin.fields.getTextInputValue('soru1');
        kanvekin.reply({content:`> **${client.emoji("emote_true") !== null ? client.emoji("emote_true") : "✅"} Şikayetin Alındı!**`,ephemeral:true});
      if(client.kanalbul("others-log")){
       let embed = new EmbedBuilder()
       .setColor("Random")
       .setTitle("Likayet Bildirisi")
       .setURL("https://discord.gg/82")
       .setThumbnail(kanvekin.user.displayAvatarURL({dynamic:true,forceStatic:true}))
       .addFields([
       {name:`Bildiri`,value:`> ${s1}`,inline:false},
       ])
       client.kanalbul("others-log").send({embeds:[embed]})
      } else console.error("others-log İsimli Kanal Sunucuda Bulunmamakta, Modal Gönderilemedi!")
    }
}

}

module.exports.conf = { name:Events.InteractionCreate }