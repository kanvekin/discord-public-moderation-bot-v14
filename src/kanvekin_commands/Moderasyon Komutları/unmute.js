const {PermissionFlagsBits, ActionRowBuilder,ButtonBuilder, ButtonStyle} = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const ms = require("ms");
const db = client.db;
module.exports = {
    name: "unmute",
    usage:"unmute [@kanvekin / ID]",
    category:"moderasyon",
    aliases: ["un-mute", "mutekaldır","un-mutes","unchatmute","uncmute","unvmute"],
    execute: async (client, message, args, kanvekin_embed) => {
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let cstaffData = await db.get("kanvekin-cmute-staff") || [];
        let vstaffData = await db.get("kanvekin-vmute-staff") || [];
        let muteRoles = await db.get("kanvekin-cmute-roles") || [];
        let limitData = await db.get(`mutelimit-${message.author.id}`) || 0;
        if(!cstaffData.length > 0 || !vstaffData.length > 0)console.error("Chat Mute / Voice Mute Yetkilisi Ayarlı Değil!");
        if(!muteRoles.length > 0){
        console.error("Chat Mute Rolleri Ayarlı Değil!");
        return client.false(message);
        }
        if(!cstaffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !vstaffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.ManageRoles))return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);


        if(!member) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] }).sil(5);
        if(member.id == message.author.id) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Kendine İşlem Uygulayamazsın!**`)]}).sil(5);
        if(member.user.bot) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Bir Bot'a İşlem Uygulayamazsın!**`)]}).sil(5);
        if(member.roles.highest.position > message.member.roles.highest.position) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Kendinden Üst/Aynı Pozisyondaki Birine İşlem Uygulayamazsın!**`)]}).sil(5);
        if (limitData >= kanvekin_config.limit.muteLimit)return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Mute Atma Limitin Dolmuş Durumda, Lütfen Sonra Tekrar Dene!**`)]}).sil(5);
        if(!member.manageable)return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Belirtilen User'a İşlem Yapmaya Yetkim Yetmiyor!**`)]}).sil(5);


        let buttons = new ActionRowBuilder()
        .addComponents(
         new ButtonBuilder()
         .setLabel("Chat Mute Kaldır")
         .setDisabled(cstaffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) || message.member.permissions.has(PermissionFlagsBits.Administrator) || message.member.permissions.has(PermissionFlagsBits.MuteMembers) ? !member.roles.cache.has(muteRoles) ? true : false : true)
         .setStyle(ButtonStyle.Secondary)
         .setEmoji(`${client.emoji("emote_cmute") !== null ? client.emoji("emote_cmute") : "🔕"}`)
         .setCustomId("unpunish_cmute"),
         new ButtonBuilder()
         .setLabel("Voice Mute Kaldır")
         .setDisabled(cstaffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) || message.member.permissions.has(PermissionFlagsBits.Administrator) || message.member.permissions.has(PermissionFlagsBits.MuteMembers) ? !member.voice.channel ? true : !member.voice.serverMute ? true: false : true)
         .setStyle(ButtonStyle.Secondary)
         .setEmoji(`${client.emoji("emote_vmute") !== null ? client.emoji("emote_vmute") : "🔇"}`)
         .setCustomId("unpunish_vmute"),
         new ButtonBuilder()
         .setLabel("İptal")
         .setStyle(ButtonStyle.Danger)
         .setEmoji(`${client.emoji("emote_false") !== null ? client.emoji("emote_false") : "❌"}`)
         .setCustomId("unpunish_iptal")
        )


        let mesaj = await message.reply({ components:[buttons],embeds: [kanvekin_embed.setDescription(`> **${client.emoji("emote_value") !== null ? client.emoji("emote_value") : "❓"} Aşağıdaki Butonlardan Bir İşlem Tipi Belirleyiniz!**`)]})
        const collector = mesaj.createMessageComponentCollector({ filter: i => i.user.id === message.member.id, time: 30000,max:1});
        collector.on('end',async(kanvekin) =>{
        if(kanvekin.size == 0) mesaj.delete();
        })
        collector.on('collect', async (kanvekin) => {
        if (!kanvekin.isButton()) return;
        if(kanvekin.customId == "unpunish_cmute"){
        if(member.roles.cache.has(muteRoles)) member.roles.remove(muteRoles);
        db.delete(`cmuted-${member.id}`)
        await client.ceza(member.id,message,"UNCMUTE",null,Date.now(),null)
        mesaj.delete();
        }else 
        if(kanvekin.customId == "unpunish_vmute"){
        if(!member.voice.channel)return kanvekin.reply({content:`> **Kullanıcı Ses Kanalında Bulunmuyor!**`,ephemeral:true})
        if(member.voice.channel) member.voice.setMute(false)
        db.delete(`vmuted-${member.id}`)
        await client.ceza(member.id,message,"UNVMUTE",null,Date.now(),null)
        mesaj.delete();
        }else
        if(kanvekin.customId == "unpunish_iptal"){
        kanvekin.reply({content:`> **${client.emoji("emote_true") !== null ? client.emoji("emote_true") : "✅"} İşlem Başarıyla İptal Edildi!**`,ephemeral:true})
        client.false(message);
        mesaj.delete();
        }
        })


    }
}