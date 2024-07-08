const { PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "toplantı",
    usage: "toplantı",
    category:"üstyt",
    aliases: ["meeting", "meetings"],
    execute: async (client, message, args, kanvekin_embed) => {
        let staffData = await db.get("kanvekin-ban-staff") || [];
        if (!staffData.length > 0) console.error("Ban Yetkilisi Ayarlı Değil!");
        if (!staffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator) && !message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);

        let katıldı = client.rolinc("katıldı");
        if (!katıldı) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Sunucuda \`katıldı\` Adında Rol Bulunamadı!**`)] }).sil(5);
        let uyarı = client.rolinc("uyarı");
        if (!uyarı) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Sunucuda \`uyarı\` Adında Rol Bulunamadı!**`)] }).sil(5);
        let mazeretli = client.rolinc("mazeret");
        if (!mazeretli) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Sunucuda \`mazeretli\` Adında Rol Bulunamadı!**`)] }).sil(5);
        let altytrol = await db.get("kanvekin-register-staff") || [];
        if (!altytrol.length > 0) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Kayıt Yetkisi Olmadığı İçin İşlem Gerçekleştirilemedi!** *Lütfen Setup Panelden Kayıt Yetkisini Ayarlayınız.*`)] }).sil(5);
        let altyt = message.guild.roles.cache.get(altytrol[0]);

        let buttons = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setPlaceholder("Toplantı İşlemini Şeçiniz!")
                .setCustomId("meetingmenu")
                .setOptions([
                    { label: `Toplantı Başlat`, description: `Toplantıyı Bulunduğunuz Ses Kanalında Başlatır Ve Rol Dağıtır!`, value: `meetingstart`, emoji: `🟢` },
                    { label: `Toplantı Duyuru`, description: `Yetkilileri DM Üzerinden Toplantıya Çağırır!`, value: `meetingcall`, emoji: `📣` }
                ])
        )

        let mesaj = await message.reply({ components: [buttons], embeds: [kanvekin_embed.setDescription(`> **Menuden Bir \`Toplantı\` İşlemi Belirtiniz!**`)] })
        const collector = mesaj.createMessageComponentCollector({ filter: i => i.user.id === message.member.id, time: 30000, max: 1 });
        collector.on('end', async (kanvekin) => {
            if (kanvekin.size == 0) mesaj.delete();
        })
        collector.on('collect', async (kanvekin) => {
            if (!kanvekin.isStringSelectMenu()) return;
            let value = kanvekin.values[0];
            switch (value) {
                case "meetingstart":
                    let voiceuser = message.guild.members.cache.filter(member => member.roles.highest.position >= altyt.position && member.voice.channel && !member.user.bot)
                    let nvoiceuser = message.guild.members.cache.filter(member => member.roles.highest.position >= altyt.position && !member.voice.channel && !member.user.bot)
                    let mazeret = message.guild.roles.cache.get(mazeretli.id).members.size;
                    kanvekin.reply({ content: `${kanvekin.member}`, embeds: [kanvekin_embed.setDescription(`> **Katıldı Rolü Verilecek Sayısı ${client.sayıEmoji(voiceuser.size)}**\n> **Katıldı Rolü Alınacak Sayısı ${client.sayıEmoji(nvoiceuser.size)}**\n> **Mazeretli Kişi Sayısı ${client.sayıEmoji(mazeret)}**\n\n> **Toplantıda Olmayan ${client.sayıEmoji(nvoiceuser.size)} Kişiye ${uyarı} Rolü Veriliyor..**\n> **Toplantıda Olan ${client.sayıEmoji(voiceuser.size)} Kişiye ${katıldı} Rolü Veriliyor..**`)] })
                    kanvekin.message.delete();
                    voiceuser.array().forEach((kanvekin, index) => {
                        setTimeout(async () => {
                            kanvekin.roles.add(katıldı)
                        }, index * 1000)
                    })
                    nvoiceuser.array().forEach((kanvekin, index) => {
                        setTimeout(async () => {
                            kanvekin.roles.add(uyarı)
                        }, index * 1000)
                    })
        
            break;
                case "meetingcall":
                    let nnvoiceuser = kanvekin.guild.members.cache.filter(member => member.roles.highest.position >= altyt.position && !member.voice.channel && !member.user.bot)
                 if(nnvoiceuser.length == 0)return kanvekin.reply({ embeds: [kanvekin_embed.setDescription(`> **Sunucudaki Tüm Yetkililer Seste Bulunuyor!**`)] }).sil(15);
                 let mesaj = await kanvekin.reply({ embeds: [kanvekin_embed.setDescription(`> **Seste Olmayan ${client.sayıEmoji(nnvoiceuser.size)} Kişiye DM Üzerinden Duyuru Geçiliyor!** *Lütfen Biraz Bekleyiniz.*`)] });
                 kanvekin.message.delete();
                 nnvoiceuser.forEach((kanvekin, index) => {
                    setTimeout(() => {
                    kanvekin.send(`> **Yetkili Olduğun \`${kanvekin.guild.name}\` Sunucusunda Toplantı Başlıyor! Toplantıda Bulunmadığın İçin Sana Bu Mesajı Gönderiyorum, Eğer Toplantıya Katılmazsan Uyarı Alıcaksın!**`).then(kanvekin => mesaj.edit(`> **${kanvekin} Kişisine DM Üzerinden Duyuru Yapıldı!**`).catch((err) => { kanvekin.channel.send(`> **${yetkili} Yetkili Olduğun \`${kanvekin.guild.name}\` Sunucusunda Toplantı Başlıyor, Toplantıda Bulunmadığın İçin Sana Bu Mesajı Gönderiyorum, Eğer Toplantıya Katılmazsan Uyarı Alıcaksın!**`).then(x => mesaj.edit({embeds:[kanvekin_embed.setDescription(`> **${yetkili} Kişisinin DM'i Kapalı Olduğundan Kanalda Duyuru Yapıldı!**`)]}))}));
                    }, index*5000);
                    })
    break;
}

        })




    }
}