const {PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: 'rol-log',
    usage:"rol-log [@kanvekin]",
    category:"rol",
    aliases: ["rollog","rlog","r-log","rolelog","rolleri"],
    execute: async (client, message, args, kanvekin_embed) => {
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let staffData = await db.get("kanvekin-ban-staff") || [];
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers) && !message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        if (!member) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] }).sil(5);
        if(member.user.bot) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Bir Bot'a İşlem Uygulayamazsın!**`)]}).sil(5);
        let names = db.get(`rollog-${member.id}`).reverse();
        if (!names) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **${member} Kullanıcısının Rol Verisi Bulunmamakta!**`)] }).sil(5);
        if(names && names.length <= 10){
        message.reply({ embeds: [kanvekin_embed.setTitle("Kullanıcının Rol Geçmişi").setDescription(names.map((data, n) => `${data}`).join("\n\n"))] })
        }else {
       let pages = 1;
       const kanvekin_buttons = new ActionRowBuilder()
      .addComponents(
		new ButtonBuilder()
        .setCustomId("kanvekin_back")
        .setLabel("⬅️")
        .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
        .setCustomId("kanvekin_exit")
        .setLabel("🗑️")
        .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
        .setCustomId("kanvekin_skip")
        .setLabel("➡️")
        .setStyle(ButtonStyle.Secondary)
		);
        client.true(message)
       let mesaj = await message.reply({components:[kanvekin_buttons], embeds: [
        kanvekin_embed.setTitle("Kullanıcının Rol Geçmişi").setDescription(`${names.slice(pages == 1 ? 0 : pages * 5 - 5, pages * 5).join("\n\n")}`).setFooter({text:`Sayfa #${pages}`})] })
        
        const filter = i => i.user.id === message.member.id;
        const collector = mesaj.createMessageComponentCollector({filter:filter, time: 120000});
        collector.on("collect",async (kanvekin) => {
            if (kanvekin.customId == "kanvekin_skip") {
                if (names.slice((pages + 1) * 5 - 5, (pages + 1) * 5).length <= 0)return kanvekin.reply({ephemeral:true,content:`> **❌ Daha Fazla Veri Bulunmamakta!**`});
                pages += 1;
                let newData = names.slice(pages == 1 ? 0 : pages * 5 - 5, pages * 5).join("\n\n");
                await kanvekin.update({components:[kanvekin_buttons], embeds: [
                kanvekin_embed.setTitle("Kullanıcının Rol Geçmişi").setFooter({text:`Sayfa #${pages}`}).setDescription(newData)] })
            }else
            if (kanvekin.customId == "kanvekin_back") {
                if (pages == 1)return kanvekin.reply({ephemeral:true,content:`> **❌ İlk Sayfadasın, Geriye Gidemezsin!**`});
                pages -= 1;
                let newData = names.slice(pages == 1 ? 0 : pages * 5 - 5, pages * 5).join("\n\n");
                await kanvekin.update({components:[kanvekin_buttons], embeds: [
                kanvekin_embed.setTitle("Kullanıcının Rol Geçmişi").setFooter({text:`Sayfa #${pages}`}).setDescription(newData)] })
            }else  if (kanvekin.customId == "kanvekin_exit") {
            kanvekin.reply({ephemeral:true,content:`> **🗑️ Panel Başarıyla Silindi!**`})
            mesaj.delete().catch((kanvekin) => { })
            message.delete().catch((kanvekin) => { })
            }
        })
    }

    }
}