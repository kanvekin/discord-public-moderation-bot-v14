const {PermissionFlagsBits} = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const db = client.db;
module.exports = {
    name: "isim",
    usage:"isim [@kanvekin / ID] <isim> <yaş>",
    category:"kayıt",
    aliases: ["i", "nickname"],
    execute: async (client, message, args, kanvekin_embed) => {
        var member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        var name = args[1]
        var age = args[2]
        let staffData = await db.get("kanvekin-register-staff") || [];
        if(!staffData.length > 0)throw new SyntaxError("Kayıt Yetkilisi Ayarlı Değil!");
        if(!staffData.some(kanvekin => message.member.roles.cache.get(kanvekin)) && !message.member.permissions.has(PermissionFlagsBits.Administrator))return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        const kyapan = await client.users.fetch(message.author.id)
        if (!member) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Geçerli Bir User Belirt!**`)] }).sil(5);
        if(member.id == message.author.id) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Kendine İşlem Uygulayamazsın!**`)]}).sil(5);
        if(member.user.bot) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Bir Bot'a İşlem Uygulayamazsın!**`)]}).sil(5);
        if (!name) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Geçerli Bir İsim Belirt!**`)] }).sil(5);
        if (name.lenght > 12)  return message.reply({ embeds: [kanvekin_embed.setDescription(`> **İsim uzunluğu 12'den Büyük Olamaz!**`)] }).sil(5);
        if (age && isNaN(age)) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Yaşı Lütfen Sayı İle Belirt!**`)] }).sil(5);
        if (age && age < kanvekin_config.minageAge) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Kullanıcının Yaşı Geçerli Yaştan Küçük!**`)]}).sil(5);
        let Name2 = name.toLocaleLowerCase()[0].toUpperCase() + name.toLocaleLowerCase().substring(1);
        db.push(`isimler-${member.id}`, `\`${kanvekin_config.tagSymbol} ${Name2}${age ? ` ${kanvekin_config.symbolkanvekin} ${age}` : ""}\` (İsim Değiştirme <t:${Math.floor(Date.now() / 1000)}> - ${kyapan.tag})`);
        db.push(`kayıtlar-${message.author.id}`, `\`${kanvekin_config.tagSymbol} ${Name2}${age ? ` ${kanvekin_config.symbolkanvekin} ${age}` : ""}\` ${member.user.tag} (İsim Değiştirme <t:${Math.floor(Date.now() / 1000)}>)`);
        await message.guild.members.cache.get(member.id).setNickname(`${kanvekin_config.tagSymbol} ${Name2}${age ? ` ${kanvekin_config.symbolkanvekin} ${age}` : ""}`);
        message.reply({ embeds: [kanvekin_embed.setDescription(`> **Kullanıcının İsmi \`${kanvekin_config.tagSymbol} ${Name2}${age ? ` ${kanvekin_config.symbolkanvekin} ${age}` : ""}\` Olarak Değiştirildi!**`)] })
    }
}