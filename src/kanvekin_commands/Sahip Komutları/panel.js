const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Events, ChannelType, StringSelectMenuBuilder } = require("discord.js");
const ms = require("ms");
const db = client.db;
const kanvekin_config = require("../../../kanvekin_config")
const children = require("child_process");
const { codeBlock } = require("@discordjs/formatters");
const canvafy = require("canvafy");
module.exports = {
    name: "setup",
    category:"sahip",
    usage:"setup",
    aliases: ["setup","panel"],
    execute: async (client, message, args, kanvekin_embed) => {
        if (!kanvekin_config.botOwners.some(kanvekin => message.author.id == kanvekin)) return message.reply({ embeds: [kanvekin_embed.setDescription(`> **Komutu Kullanmak İçin Yetkin Bulunmamakta!**`)] }).sil(5);
        let secim = args[0];
        message.react(client.emoji("emote_true") !== null ? client.emoji("emote_true") : "✅")
        let mesajx;
        if(!secim) mesajx = await message.reply({ content: `> **Lütfen Bekleyiniz..**` })
        let registerEmbed = new EmbedBuilder(); let moderationEmbed = new EmbedBuilder();


        const secimButtons1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("regsetup")
                    .setLabel(`Kayıt`)
                    .setEmoji("📝")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("modsetup")
                    .setLabel(`Moderasyon`)
                    .setEmoji("🛠️")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("logkur")
                    .setLabel(`Logları Kur`)
                    .setEmoji("📃")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId("emojikur")
                    .setLabel(`Emojileri Kur`)
                    .setEmoji("😂")
                    .setStyle(ButtonStyle.Primary),
            );

        const secimButtons2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("restart")
                    .setLabel(`Tüm Botları Yeniden Başlat`)
                    .setEmoji("🔃")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("datareset")
                    .setLabel(`Local Database'i Sıfırla`)
                    .setEmoji("🗑️")
                    .setStyle(ButtonStyle.Danger),
            );

        const secimMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setPlaceholder("✨ Diğer İşlemler")
                    .setCustomId("select_menu")
                    .addOptions([
                        { label: "Stat Leaderboard Kur", value: "statboard", emoji: "📈", description: "Mesajda Güncellenen İstatistik Verileri!" },
                        { label: "Tüm Yasaklamaları Kaldır", value: "yasakkaldır", emoji: "🛠️", description: "Sunucudaki Tüm Yasaklamaları Kaldırır!" },
                        { label: "Menüler & Rollerin Paneli", value: "menurolekur", emoji: "🪄", description: "Menulerin Ve Rol Kurma Paneli!" },
                    ])
            )

        const canvasPanel = await new canvafy.Rank()
            .setAvatar(`${message.guild.iconURL({ forceStatic: true, extension: "png" }) !== null ? message.guild.iconURL({ forceStatic: true, extension: "png" }) : kanvekin_config.shipArkaplan}`)
            .setBackground("image", `${message.guild.bannerURL({extension:"png",size:2048}) !== null ? message.guild.bannerURL({extension:"png",size:2048}) : kanvekin_config.shipArkaplan}`)
            .setUsername(message.guild.name)
            .setCustomStatus("#f0f0f0")
            .setLevel(message.guild.memberCount,"Üye Sayısı;")
            .setRank(message.guild.premiumSubscriptionCount,"Boost Adeti;")
            .setCurrentXp(message.guild.premiumSubscriptionCount >= 14 ? 14 : message.guild.premiumSubscriptionCount)
            .setBarColor("#00ff00")
            .setForegroundColor("#000000")
            .setForegroundOpacity(0.8)
            .setRequiredXp(14)
            .build();

        const kanvekin_buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("welcome_image")
                    .setLabel(`Resimli Welcome`)
                    .setEmoji(`${db.has("kanvekin-welcome-image") ? "<:seksen_ikix:1259701797040164895>" : "<:seksen_iki:1259701846335819857>"}`)
                    .setStyle(db.has("kanvekin-welcome-image") ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("tag_mode")
                    .setLabel(`Taglı Alım`)
                    .setEmoji(`${db.has("kanvekin-welcome-tagmode") ? "<:seksen_ikix:1259701797040164895>" : "<:seksen_iki:1259701846335819857>"}`)
                    .setStyle(db.has("kanvekin-welcome-tagmode") ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId("welcome_mentions")
                    .setLabel(`Rol Etiket`)
                    .setEmoji(`${db.has("kanvekin-welcome-mentions") ? "<:seksen_ikix:1259701797040164895>" : "<:seksen_iki:1259701846335819857>"}`)
                    .setStyle(db.has("kanvekin-welcome-mentions") ? ButtonStyle.Success : ButtonStyle.Danger),
                 );

        let staffData = await db.get("kanvekin-register-staff") || [];
        let banstaffData = await db.get("kanvekin-ban-staff") || [];
        let jailstaffData = await db.get("kanvekin-jail-staff") || [];
        let vmutestaffData = await db.get("kanvekin-vmute-staff") || [];
        let cmutestaffData = await db.get("kanvekin-cmute-staff") || [];
        let cmuteRoles = await db.get("kanvekin-cmute-roles");
        let ytalımRoles = await db.get("kanvekin-ytalım-roles");
        let firstytRoles = await db.get("kanvekin-firstyt-roles") || [];

        let manRoles = await db.get("kanvekin-man-roles") || [];
        let womanRoles = await db.get("kanvekin-woman-roles") || [];
        let unregisterRoles = await db.get("kanvekin-unregister-roles") || [];
        let jailRoles = await db.get("kanvekin-jail-roles") || [];
        let supheliRoles = await db.get("kanvekin-supheli-roles") || [];
        let familyRoles = await db.get("kanvekin-family-roles") || [];
        let tagData = await db.get("kanvekin-tags") || [];
        let chatChannel = await db.get("kanvekin-channel-chat");
        let welcomeChannel = await db.get("kanvekin-channel-welcome");

        registerEmbed.setTitle("Kayıt Sistemi").setURL(message.url).setDescription(`
**Kayıt Yetkilileri \`ID: 1\`**
${staffData.length > 0 ? staffData.map((kanvekin) => `<@&${kanvekin}>`).join(",") : "Bulunmamakta"}
**Erkek Rolleri \`ID: 2\`**
${manRoles.length > 0 ? manRoles.map((kanvekin) => `<@&${kanvekin}>`).join(",") : "Bulunmamakta"}
**Kadın Rolleri \`ID: 3\`**
${womanRoles.length > 0 ? womanRoles.map((kanvekin) => `<@&${kanvekin}>`).join(",") : "Bulunmamakta"}
**Kayıtsız Rolleri \`ID: 4\`**
${unregisterRoles.length > 0 ? unregisterRoles.map((kanvekin) => `<@&${kanvekin}>`).join(",") : "Bulunmamakta"}
**Şüpheli Rolleri \`ID: 5\`**
${supheliRoles.length > 0 ? supheliRoles.map((kanvekin) => `<@&${kanvekin}>`).join(",") : "Bulunmamakta"}
**Family/Taglı Rolleri \`ID: 6\`**
${familyRoles.length > 0 ? familyRoles.map((kanvekin) => `<@&${kanvekin}>`).join(",") : "Bulunmamakta"}
**Taglar \`ID: 7\`**
${tagData.length > 0 ? tagData.map((kanvekin) => `${kanvekin}`).join(",") : "Bulunmamakta"}
**Genel Chat Kanalı \`ID: 8\`**
${chatChannel ? `<#${chatChannel}>` : "Bulunmamakta"}
**Hoşgeldin Kanalı \`ID: 9\`**
${welcomeChannel ? `<#${welcomeChannel}>` : "Bulunmamakta"}

${codeBlock("diff", `
${db.has("kanvekin-welcome-image") ? "+" : "-"} Canvaslı / Resimli Hoşgeldin; ${db.has("kanvekin-welcome-image") ? "✅ " : "❌ "}
${db.has("kanvekin-welcome-tagmode") ? "+" : "-"} Taglı Alım; ${db.has("kanvekin-welcome-tagmode") ? "✅ " : "❌ "}
${db.has("kanvekin-welcome-mentions") ? "+" : "-"} Welcome Rol Etiket; ${db.has("kanvekin-welcome-mentions") ? "✅ " : "❌ "}
--- Bot Ping; ${Math.round(client.ws.ping)} MS | Mesaj Ping; ${(Date.now() - message.createdAt)} MS
`)}
`).setThumbnail(message.guild.iconURL({ forceStatic: true }))

moderationEmbed.setTitle("Moderasyon Sistemi").setURL(message.url).setDescription(`
**Ban Yetkilileri \`ID: 10\`**
${banstaffData.length > 0 ? banstaffData.map((kanvekin) => `<@&${kanvekin}>`).join(",") : "Bulunmamakta"}
**Jail Yetkilileri \`ID: 11\`**
${jailstaffData.length > 0 ? jailstaffData.map((kanvekin) => `<@&${kanvekin}>`).join(",") : "Bulunmamakta"}
**Voice Mute Yetkilileri \`ID: 12\`**
${vmutestaffData.length > 0 ? vmutestaffData.map((kanvekin) => `<@&${kanvekin}>`).join(",") : "Bulunmamakta"}
**Chat Mute Yetkilileri \`ID: 13\`**
${cmutestaffData.length > 0 ? cmutestaffData.map((kanvekin) => `<@&${kanvekin}>`).join(",") : "Bulunmamakta"}
**Chat Mute Rolü \`ID: 14\`**
${cmuteRoles ? `<@&${cmuteRoles}>` : "Bulunmamakta"}
**Yetkili Alım Rolü \`ID: 15\`**
${ytalımRoles ? `<@&${ytalımRoles}>` : "Bulunmamakta"}
**İlk Yetki Rolleri \`ID: 16\`**
${firstytRoles.length > 0 ? firstytRoles.map((kanvekin) => `<@&${kanvekin}>`).join(",") : "Bulunmamakta"}
**Cezalı / Jailed Rolleri \`ID: 17\`**
${jailRoles.length > 0 ? jailRoles.map((kanvekin) => `<@&${kanvekin}>`).join(",") : "Bulunmamakta"}

${codeBlock("diff", `
${db.has("kanvekin-welcome-image") ? "+" : "-"} Canvaslı / Resimli Hoşgeldin; ${db.has("kanvekin-welcome-image") ? "✅ " : "❌ "}
${db.has("kanvekin-welcome-tagmode") ? "+" : "-"} Taglı Alım; ${db.has("kanvekin-welcome-tagmode") ? "✅ " : "❌ "}
${db.has("kanvekin-welcome-mentions") ? "+" : "-"} Welcome Rol Etiket; ${db.has("kanvekin-welcome-mentions") ? "✅ " : "❌ "}
--- Bot Ping; ${Math.round(client.ws.ping)} MS | Mesaj Ping; ${(Date.now() - message.createdAt)} MS
`)}
`).setThumbnail(message.guild.iconURL({ forceStatic: true }))


        if (!secim) {
            let mesaj = await mesajx.edit({ content:``,components: [secimButtons1, secimButtons2, secimMenu], embeds: [new EmbedBuilder().setImage("attachment://kanvekin-server-setup.png").setColor("Random").setDescription(`> **Bir İşlem Seçiniz!**`)], files: [{ attachment: canvasPanel, name: "kanvekin-server-setup.png" }]})
            const collector = mesaj.createMessageComponentCollector({ filter: i => i.user.id === message.member.id, time: 30000 });
            collector.on('end',async(kanvekin) =>{
            if(kanvekin.size == 0) mesaj.delete();
            })
            collector.on('collect', async (kanvekin) => {
                if (!kanvekin.isButton()) return;
                if (kanvekin.customId == "regsetup") {
                    kanvekin.update({ content: ``, embeds: [registerEmbed], components: [kanvekin_buttons],files:[] })
                    collector.stop();
                } else if (kanvekin.customId == "modsetup") {
                    kanvekin.update({ content: ``, embeds: [moderationEmbed], components: [kanvekin_buttons],files:[] })
                    collector.stop();
                } else if (kanvekin.customId == "logkur") {
                    kanvekin.update({ content: `> **📝 Loglar Kuruluyor..**`,embeds:[],files:[], components: [] })
                    const parent = await kanvekin.guild.channels.create({ name: '</Loglar>', type: ChannelType.GuildCategory });
                    const loglar = kanvekin_config.logs;
                    for (let index = 0; index < loglar.length; index++) {
                        let element = loglar[index];
                        await kanvekin.guild.channels.create({
                            name: element.name,
                            type: ChannelType.GuildText,
                            parent: parent.id, permissionOverwrites: [
                                { id: kanvekin.guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
                            ]
                        })
                    }
                    kanvekin.channel.send({ content: `> **✅ Logların Kurulumu Tamamlandı!**` })
                    collector.stop();
                } else if (kanvekin.customId == "emojikur") {
                    kanvekin.update({ content: `> **📝 Emojiler Kuruluyor..**`, embeds:[],files:[],components: [] })
                    const emojiler = kanvekin_config.emojis;
                    for (let index = 0; index < emojiler.length; index++) {
                        let element = emojiler[index];
                        await kanvekin.guild.emojis.create({
                            name: element.name,
                            attachment: element.url
                        })
                    }
                    kanvekin.channel.send({ content: `> **✅ Emojilerin Kurulumu Tamamlandı!**` })
                    collector.stop();
                } else if (kanvekin.customId == "restart") {
                    const kanvekins = children.exec(`kanvekin restart all`);
                    kanvekins.stdout.on('data', async (datas) => {
                        kanvekin.update({ content: `> 🔃 **Bot Yeniden Başlatılıyor..**`, components: [],embeds:[],files:[] })
                        collector.stop();
                    });
                } else if (kanvekin.customId == "datareset") {
                    db.all().forEach(async (data) => {
                        db.delete(data.ID)
                    })
                    kanvekin.update({ content: `> 🗑️ **Local Veritabanı Siliniyor..**`, components: [] ,embeds:[],files:[]})
                    collector.stop();
                }
            })
            return;
        }

        if (secim == "1") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("kanvekin-register-staff")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 1 @rol**` })
            if (staffData.some(kanvekin => kanvekin.includes(roles.id))) {
                db.pull("kanvekin-register-staff", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("kanvekin-register-staff", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            }

        } else if (secim == "2") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("kanvekin-man-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 1 @rol**` })
            if (manRoles.some(kanvekin => kanvekin.includes(roles.id))) {
                db.pull("kanvekin-man-roles", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("kanvekin-man-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            }

        } else if (secim == "3") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("kanvekin-woman-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 3 @rol**` })
            if (womanRoles.some(kanvekin => kanvekin.includes(roles.id))) {
                db.pull("kanvekin-woman-roles", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("kanvekin-woman-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            }

        } else if (secim == "4") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("kanvekin-unregister-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 4 @rol**` })
            if (unregisterRoles.some(kanvekin => kanvekin.includes(roles.id))) {
                db.pull("kanvekin-unregister-roles", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("kanvekin-unregister-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            }

        } else if (secim == "5") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("kanvekin-supheli-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 5 @rol**` })
            if (supheliRoles.some(kanvekin => kanvekin.includes(roles.id))) {
                db.pull("kanvekin-supheli-roles", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("kanvekin-supheli-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            }

        } else if (secim == "6") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("kanvekin-family-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 6 @rol**` })
            if (familyRoles.some(kanvekin => kanvekin.includes(roles.id))) {
                db.pull("kanvekin-family-roles", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("kanvekin-family-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            }

        } else if (secim == "7") {
            let tag = args[1];
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("kanvekin-tags")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!tag) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 7 <tag>**` })
            if (tagData.some(kanvekin => kanvekin.includes(tag))) {
                db.pull("kanvekin-tags", (eleman, sıra, array) => eleman == tag, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${tag} Başarıyla Kaldırıldı!**` })
            } else {
                db.push("kanvekin-tags", tag)
                message.reply({ content: `> **✅ Başarılı!**\n> **${tag} Başarıyla Eklendi!**` })
            }

        } else if (secim == "8") {
            let channel = message.mentions.channels.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("kanvekin-channel-chat")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!channel) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 8 #chat-kanal**` })
            db.set("kanvekin-channel-chat", channel.id)
            message.reply({ content: `> **✅ Başarılı!**\n> **${channel} (\`${channel.name}\`) Başarıyla Eklendi!**` })

        } else if (secim == "9") {
            let channel = message.mentions.channels.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("kanvekin-channel-welcome")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!channel) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 9 #chat-kanal**` })
            db.set("kanvekin-channel-welcome", channel.id)
            message.reply({ content: `> **✅ Başarılı!**\n> **${channel} (\`${channel.name}\`) Başarıyla Eklendi!**` })

        }else if (secim == "10") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("kanvekin-ban-staff")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 10 @rol**` })
            if (banstaffData.some(kanvekin => kanvekin.includes(roles.id))) {
                db.pull("kanvekin-ban-staff", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("kanvekin-ban-staff", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            }
        }else if (secim == "11") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("kanvekin-jail-staff")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 11 @rol**` })
            if (jailstaffData.some(kanvekin => kanvekin.includes(roles.id))) {
                db.pull("kanvekin-jail-staff", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("kanvekin-jail-staff", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            } 
        }else if (secim == "12") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("kanvekin-vmute-staff")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 12 @rol**` })
            if (vmutestaffData.some(kanvekin => kanvekin.includes(roles.id))) {
                db.pull("kanvekin-vmute-staff", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("kanvekin-vmute-staff", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            } 
        }else if (secim == "13") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("kanvekin-cmute-staff")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 13 @rol**` })
            if (cmutestaffData.some(kanvekin => kanvekin.includes(roles.id))) {
                db.pull("kanvekin-cmute-staff", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("kanvekin-cmute-staff", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            } 
        }else if (secim == "14") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("kanvekin-cmute-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 14 @rol**` })
                db.set("kanvekin-cmute-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` }) 
        }else if (secim == "15") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("kanvekin-ytalım-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 15 @rol**` })
                db.set("kanvekin-ytalım-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` }) 
        }else if (secim == "16") {
            let roles = message.mentions.roles.first();
            if (isNaN(args[1]) && args[1] == "sıfırla") {
                db.delete("kanvekin-firstyt-roles")
                return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
            }
            if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 16 @rol**` })
            if (cmutestaffData.some(kanvekin => kanvekin.includes(roles.id))) {
                db.pull("kanvekin-firstyt-roles", (eleman, sıra, array) => eleman == roles.id, true)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
            } else {
                db.push("kanvekin-firstyt-roles", roles.id)
                message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
            } 
            }else if (secim == "17") {
                let roles = message.mentions.roles.first();
                if (isNaN(args[1]) && args[1] == "sıfırla") {
                    db.delete("kanvekin-jail-roles")
                    return message.reply({ content: `> **✅ Başarılı!**\n> **Veri Sıfırlandı!**` })
                }
                if (!roles) return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup 17 @rol**` })
                if (jailRoles.some(kanvekin => kanvekin.includes(roles.id))) {
                    db.pull("kanvekin-jail-roles", (eleman, sıra, array) => eleman == roles.id, true)
                    message.reply({ content: `> **✅ Başarılı!**\n> **${roles} Rolü Başarıyla Kaldırıldı!**` })
                } else {
                    db.push("kanvekin-jail-roles", roles.id)
                    message.reply({ content: `> **✅ Başarılı!**\n> **${roles} (\`${roles.name}\`) Rolü Başarıyla Eklendi!**` })
                } 
            
    }else { return message.reply({ content: `> **❌ Hatalı Kullanım!**\n> **\`Örnek;\` ${kanvekin_config.prefix}setup <ID> @rol/#kanal/tag**` }) }

    }
}

client.on(Events.InteractionCreate,async(kanvekin) => {
 if(!kanvekin.isStringSelectMenu())return;
 let value = kanvekin.values[0];
 if(value == "statboard"){
kanvekin.message.delete();
let chat = await kanvekin.channel.send({content:`*Veriler Çekiliyor Lütfen Bekleyiniz, Ve Bu Mesajı Silmeyiniz!*`})
let voice = await kanvekin.channel.send({content:`*Veriler Çekiliyor Lütfen Bekleyiniz, Ve Bu Mesajı Silmeyiniz!*`})
db.set(`chatleader`,{message:chat.id,channel:kanvekin.channel.id})
db.set(`voiceleader`,{message:voice.id,channel:kanvekin.channel.id})
kanvekin.reply({content:`> **✅ Kurulum Başarılı!** *Leaderboard'un Gözükmesi İçin Biraz Bekleyiniz!*`,ephemeral:true})
 }else if(value == "yasakkaldır"){
    if (!kanvekin.member.permissions.has(PermissionFlagsBits.Administrator)) return kanvekin.reply({ content: noPermMessage, ephemeral: true })
    kanvekin.message.delete();
    const fetchBans = await kanvekin.guild.bans.fetch()
        fetchBans.forEach(async (bans) => {
        kanvekin.guild.members.unban(bans.user.id).catch(err => { });
 })
 kanvekin.channel.send({content:`> **Sunucuda Yasaklı Listesinde Olan Kullanıcıların Banları Açılıyor!**`});
}else if(value == "menurolekur"){
    const rolmenukur1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("burcrolkur")
                    .setLabel(client.rolinc("akrep") ? "[KURULU]" : "Rol Kur")
                    .setEmoji("♋")
                    .setDisabled(client.rolinc("akrep") ? true : false)
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId("sevrolkur")
                    .setLabel(client.rolinc("sevgilim var") ? "[KURULU]" : "Rol Kur")
                    .setDisabled(client.rolinc("sevgilim var") ? true : false)
                    .setEmoji("💝")
                    .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                    .setCustomId("renkrolkur")
                    .setDisabled(client.rolinc("🍓") ? true : false)
                    .setLabel(client.rolinc("🍓") ? "[KURULU]" : "Rol Kur")
                    .setEmoji("🔴")
                    .setStyle(ButtonStyle.Success),
            );
            const rolmenukur2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("burcpanelkur")
                    .setLabel(`Panel Kur`)
                    .setEmoji("♋")
                    .setDisabled(client.rolinc("akrep") ? false : true)
                    .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                    .setCustomId("sevpanelkur")
                    .setLabel(`Panel Kur`)
                    .setEmoji("💝")
                    .setDisabled(client.rolinc("sevgilim var") ? false : true)
                    .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                    .setCustomId("renkpanelkur")
                    .setDisabled(client.rolinc("🍓") ? false : true)
                    .setLabel("Panel Kur")
                    .setEmoji("🔴")
                    .setStyle(ButtonStyle.Success),
            );


            const menus = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                .setPlaceholder("Diğer Paneller İçin Tıklayın!")
                .setCustomId("othersmenu")
                .setOptions([
                {label:`Kısayol & Menu Panel`,value:`buttonpanel`,emoji:`🟥`,description:`Kısayol & Bilgilendirme Paneli`},
                {label:`YT Alım & İstek & Öneri Panel`,value:`ytistekoneripanel`,emoji:`🟩`,description:`Yetkili Alım & İstek & Öneri Bilgilendirme Paneli`},
                {label:`Yardım & Komutlar Panel`,value:`yardımpanel`,emoji:`🟦`,description:`Komut Kullanım Menusu.`},
                ])
            )



if (!kanvekin.member.permissions.has(PermissionFlagsBits.Administrator)) return kanvekin.reply({ content: noPermMessage, ephemeral: true })
kanvekin.message.delete();
kanvekin.channel.send({components:[rolmenukur1,rolmenukur2,menus],embeds:[new EmbedBuilder().setColor("Random").setFooter({iconURL:"https://cdn.discordapp.com/emojis/1103844452218458212.gif?size=128&quality=lossless",text:`⬆️ = Rol | ⬇️ = Panel`}).setDescription(`> **Merhaba, Hangi Paneli Veya Rolü Kurmak İstiyorsun?**\n\n> **♋ > \`Burç\`**\n> **💝 > \`İlişki\`**\n> **🎉 > \`Etkinlik\`**\n> **🔴 > \`Renk\`**`)]})
}
})

client.on(Events.InteractionCreate,async(kanvekin) => {
    if(!kanvekin.isStringSelectMenu())return;
     let value = kanvekin.values[0];
     if(value == "buttonpanel"){
        kanvekin.message.delete();
        kanvekin.channel.send({"content": `> ${client.emoji("emote_value") !== null ? client.emoji("emote_value"):"🔹"} Aşağıdaki Menü Üzerinden Sunucu Hakkında\n> Veya Hesabınızla İlgili Bazı Bilgilere Ulaşabilirsiniz.`,
        "components": [{
            "type": 1, "components": [{
                "type": 3, "custom_id": "btnpanel", "options": [
                    { "label": "Sunucuya Giriş Tarihiniz.","description":"ㅤ" ,"value": "btn1", "emoji": { "id": "1103844498670354522" }, },
                    { "label": "Üzerinizde Bulunan Roller.", "description":"ㅤ" ,"value": "btn2", "emoji": { "id": "1103844441598464040" }, },
                    { "label": "Hesap Açılış Tarihiniz.", "description":"ㅤ" ,"value": "btn3", "emoji": { "id": "1103844446468063282" }, },
                    { "label": "Sunucudaki Son 10 İsim Geçmişiniz.", "description":"ㅤ" ,"value": "btn4", "emoji": { "id": "1103844448787505232" }, },
                    { "label": "Sunucunun Anlık Aktiflik Listesi.", "description":"ㅤ" ,"value": "btn5", "emoji": { "id": "1103844452218458212" }, },
                    { "label": "Sunucudaki Son 10 Ceza Geçmişiniz.", "description":"ㅤ" ,"value": "btn6", "emoji": { "id": "1103844319644885082" }, },
                    { "label": "Kullanıcı Avatarınız.", "description":"ㅤ" ,"value": "btn7", "emoji": { "id": "1103844321591038104" }, },
                    { "label": "Kullanıcı Bannerınız.", "description":"ㅤ" ,"value": "btn8", "emoji": { "id": "1103844324346699796" }, },
                ], "placeholder": "Kısayol Menu", "min_values": 1, "max_values": 1
            }],
        }
        ]})
     }else if(value == "ytistekoneripanel"){
        kanvekin.message.delete();

        let buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("istekoneri")
            .setLabel("İstek & Öneri")
            .setEmoji("📨")
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId("sikayet")
            .setLabel("Şikayet")
            .setEmoji("⚠️")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId("ytbasvur")
            .setLabel("Yetkili Başvuru")
            .setEmoji("🛡️")
            .setStyle(ButtonStyle.Primary)
        )
        kanvekin.channel.send({content: `> ${client.emoji("emote_value") !== null ? client.emoji("emote_value"):"🔹"} Aşağıdaki Menü Üzerinden **İstek,Öneri,Şikeyat** Veya **Yetkili Başvurusu** Yapabilirsiniz.`,components:[buttons]})
     }else if(value == "yardımpanel"){
       let cmd = client.commands.find(kanvekin => kanvekin.name == "yardım")
      if(cmd){cmd.execute(client,kanvekin.message,null,null)}
      kanvekin.message.delete();
     }
})
client.on(Events.InteractionCreate,async(kanvekin) => {
 if(!kanvekin.isButton())return;
  let value = kanvekin.customId;
  if(value == "burcrolkur"){
    kanvekin.reply({ content: `> **📝 Burç Rolleri Kuruluyor..**${kanvekin.guild.premiumTier >= 2 ? "" : ` *Sunucu Seviyesi 2'den Yüksek Olmadığı İçin Rolleri Iconsuz Kuruyorum!*`}`})
    const burc = kanvekin_config.burcRoles;
    for (let index = 0; index < burc.length; index++) {
        let element = burc[index];
        if(kanvekin.guild.premiumTier >= 2){
        await kanvekin.guild.roles.create({
            icon: element.icon,
            name: element.name,
            color: "#CC8899",
          })
        }else{
            await kanvekin.guild.roles.create({
                name: element.name,
                color: "#CC8899",
              })
        }
        }
        kanvekin.channel.send({ content: `> **✅ Burç Rollerinin Kurulumu Tamamlandı!**` })
  }else if(value == "sevrolkur"){
    kanvekin.reply({ content: `> **📝 İlişki Rolleri Kuruluyor..**${kanvekin.guild.premiumTier >= 2 ? "" : ` *Sunucu Seviyesi 2'den Yüksek Olmadığı İçin Rolleri Iconsuz Kuruyorum!*`}`})
    const burc = kanvekin_config.iliskiRoles;
    for (let index = 0; index < burc.length; index++) {
        let element = burc[index];
        if(kanvekin.guild.premiumTier >= 2){
        await kanvekin.guild.roles.create({
            icon: element.icon,
            name: element.name,
            color: element.color
          })
        }else{
            await kanvekin.guild.roles.create({
                name: element.name,
                color: element.color
              })
        }
        }
        kanvekin.channel.send({ content: `> **✅ İlişki Rollerinin Kurulumu Tamamlandı!**` })
  }  else if(value == "renkrolkur"){
    kanvekin.reply({ content: `> **📝 Renk Rolleri Kuruluyor..**`})
    const burc = kanvekin_config.renkRoles;
    for (let index = 0; index < burc.length; index++) {
        let element = burc[index];
        await kanvekin.guild.roles.create({
            name: element.name,
            color: element.color
          })
        }
        kanvekin.channel.send({ content: `> **✅ Renk Rollerinin Kurulumu Tamamlandı!**` })
  } else if(value == "etkinlikrolkur"){
    kanvekin.reply({ content: `> **📝 Etkinlik Rolleri Kuruluyor..**${kanvekin.guild.premiumTier >= 2 ? "" : ` *Sunucu Seviyesi 2'den Yüksek Olmadığı İçin Rolleri Iconsuz Kuruyorum!*`}`})
    const burc = kanvekin_config.etkinlikRoles;
    for (let index = 0; index < burc.length; index++) {
        let element = burc[index];
        if(kanvekin.guild.premiumTier >= 2){
        await kanvekin.guild.roles.create({
            icon: element.icon,
            name: element.name,
            color: element.color
          })
        }else{
            await kanvekin.guild.roles.create({
                name: element.name,
                color: element.color
              })
        }
        }
        kanvekin.channel.send({ content: `> **✅ Etkinlik Rollerinin Kurulumu Tamamlandı!**` })
  }  else if(value == "burcpanelkur"){
        kanvekin.message.delete();
        kanvekin.channel.send({"content": `> ${client.emoji("emote_value") !== null ? client.emoji("emote_value"):"🔹"} Menü Üzerinden **Burç** Rolünüzü Alabilirsiniz.`,
        "components": [{
            "type": 1, "components": [{
                "type": 3, "custom_id": "burclar", "options": [
                    { "label": "Koç", "value": "koç", "emoji": { "id": "1054803690848006164" }, },
                    { "label": "Boğa", "value": "boğa", "emoji": { "id": "1054803741250957324" }, },
                    { "label": "İkizler", "value": "ikizler", "emoji": { "id": "1054803754232324107" }, },
                    { "label": "Yengeç", "value": "yengeç", "emoji": { "id": "1054788879422599209" }, },
                    { "label": "Aslan", "value": "aslan", "emoji": { "id": "1054803703808397413" }, },
                    { "label": "Başak", "value": "başak", "emoji": { "id": "1054803729901166622" }, },
                    { "label": "Terazi", "value": "terazi", "emoji": { "id": "1099539509596663819" }, },
                    { "label": "Akrep", "value": "akrep", "emoji": { "id": "1054803768031588403" }, },
                    { "label": "Yay", "value": "yay", "emoji": { "id": "1054788894262038548" }, },
                    { "label": "Oğlak", "value": "oğlak", "emoji": { "id": "1054803665367617586" }, },
                    { "label": "Kova", "value": "kova", "emoji": { "id": "1054803678168629398" }, },
                    { "label": "Balık", "value": "balık", "emoji": { "id": "1054803716689113108" }, },
                    { "label": "Rol İstemiyorum", "value": "roldelete", "emoji": { "name": "🗑️" }, }
                ], "placeholder": "Burç Rolleri Menusu!", "min_values": 1, "max_values": 1
            }],
        }
        ] })
}else if(value == "sevpanelkur"){
    kanvekin.message.delete();
    kanvekin.channel.send({"content": `> ${client.emoji("emote_value") !== null ? client.emoji("emote_value"):"💖"} Menü Üzerinden **İlişki** Rolünüzü Alabilirsiniz.`,
    "components": [{
        "type": 1, "components": [{
            "type": 3, "custom_id": "iliskiler", "options": [
                { "label": "Sevgilim Var", "value": "sevvar", "emoji": { "name":"💖" }, },
                { "label": "Sevgilim Yok", "value": "sevyok", "emoji": { "name":"🙄" }, },
                { "label": "Sevgili Yapmiyorum", "value": "sevyapmiyorum", "emoji": { "name":"🥱" }, },
                { "label": "Rol İstemiyorum", "value": "roldelete", "emoji": { "name": "🗑️" }, }
            ], "placeholder": "İlişki Rolleri Menusu!", "min_values": 1, "max_values": 1
        }],
    }
    ] })
}else if(value == "etkinlikpanelkur"){
    kanvekin.message.delete();
    kanvekin.channel.send({"content": `> ${client.emoji("emote_value") !== null ? client.emoji("emote_value"):"🎉"} Menü Üzerinden **Etkinlik** Rolünüzü Alabilirsiniz.`,
    "components": [{
        "type": 1, "components": [{
            "type": 3, "custom_id": "etkinlikler", "options": [
                { "label": "Etkinlik Katılımcısı", "value": "etkinlikrol", "emoji": { "name":"🎉" }, },
                { "label": "Rol İstemiyorum", "value": "roldelete", "emoji": { "name": "🗑️" }, }
            ], "placeholder": "Etkinlik Rolleri Menusu!", "min_values": 1, "max_values": 2
        }],
    }
    ]})
}else if(value == "renkpanelkur"){
    kanvekin.message.delete();
    kanvekin.channel.send({"content": `> ${client.emoji("emote_value") !== null ? client.emoji("emote_value"):"🔹"} Menü Üzerinden **Renk** Rolünüzü Alabilirsiniz.`,
    "components": [{
        "type": 1, "components": [{
            "type": 3, "custom_id": "renkler", "options": [
                { "label": "Kırmızı", "value": "kırmızı", "emoji": { "name": "🍓" }, },
                { "label": "Yeşil", "value": "yeşil", "emoji": { "name": "🍏" }, },
                { "label": "Sarı", "value": "sarı", "emoji": { "name": "🍌" }, },
                { "label": "Mor", "value": "mor", "emoji": { "name": "🍇" }, },
                { "label": "Beyaz", "value": "beyaz", "emoji": { "name": "🌼" }, },
                { "label": "Turuncu", "value": "turuncu", "emoji": { "name": "🥕" }, },
                { "label": "Rol İstemiyorum", "value": "roldelete", "emoji": { "name": "🗑️" }, }
            ], "placeholder": "Renk Rolleri Menusu!", "min_values": 1, "max_values": 1
        }],
    }
    ]})
}
})




client.on(Events.InteractionCreate, async (kanvekin) => {
    if (!kanvekin.isButton()) return;
    let kanvekinsValue = kanvekin.customId;
    let noPermMessage = `> **❌ Bu İşlem İçin \` Yönetici \` Yetkisine Sahip Olmalısın!**`;

    if (kanvekinsValue == "welcome_image") {
        if (!kanvekin.member.permissions.has(PermissionFlagsBits.Administrator)) return kanvekin.reply({ content: noPermMessage, ephemeral: true })
        if (!db.has("kanvekin-welcome-image")) {
            db.set("kanvekin-welcome-image", true);
            kanvekin.reply({ content: `> **✅ Canvaslı / Resimli Hoşgeldin Başarıyla Açıldı!**`, ephemeral: true })
        } else {
            db.delete("kanvekin-welcome-image");
            kanvekin.reply({ content: `> **✅ Canvaslı / Resimli Hoşgeldin Başarıyla Kapatıldı!**`, ephemeral: true })
        }
    } else if (kanvekinsValue == "welcome_mentions") {
        if (!kanvekin.member.permissions.has(PermissionFlagsBits.Administrator)) return kanvekin.reply({ content: noPermMessage, ephemeral: true })
        if (!db.has("kanvekin-welcome-mentions")) {
            db.set("kanvekin-welcome-mentions", true);
            kanvekin.reply({ content: `> **✅ Hoşgeldin Rol Etiketi Başarıyla Açıldı!**`, ephemeral: true })
        } else {
            db.delete("kanvekin-welcome-mentions");
            kanvekin.reply({ content: `> **✅ Hoşgeldin Rol Etiketi Başarıyla Kapatıldı!**`, ephemeral: true })
        }
    } else if (kanvekinsValue == "tag_mode") {
        if (!kanvekin.member.permissions.has(PermissionFlagsBits.Administrator)) return kanvekin.reply({ content: noPermMessage, ephemeral: true })
        if (!db.has("kanvekin-welcome-tagmode")) {
            db.set("kanvekin-welcome-tagmode", true);
            kanvekin.reply({ content: `> **✅ Taglı Alım Başarıyla Açıldı!**`, ephemeral: true })
        } else {
            db.delete("kanvekin-welcome-tagmode");
            kanvekin.reply({ content: `> **✅ Taglı Alım Başarıyla Kapatıldı!**`, ephemeral: true })
        }
    }
})
