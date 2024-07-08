const { Collection, EmbedBuilder, codeBlock,GuildMember } = require("discord.js");
const kanvekin_config = require("./kanvekin_config")
const { kanvekin } = require('./kanvekin_client');
const client = global.client = new kanvekin();

const { YamlDatabase,JsonDatabase } = require('five.db')
const db = client.db = new YamlDatabase();
const rdb = client.rdb = new JsonDatabase({databasePath:"./ranks.json"});
client.ranks = rdb.has(`ranks`) ? rdb.get(`ranks`).sort((x, y) => x.point - y.point) : [];
client.tasks = rdb.get("tasks") || [];
const { readdir } = require("fs");
const { conf } = require("./src/kanvekin_events/joinEvent");
const commands = client.commands = new Collection();
const aliases = client.aliases = new Collection();
const invites = client.invites = new Collection();
const task = require("./src/kanvekin_schemas/tasksSchema")
const point = require("./src/kanvekin_schemas/staffsSchema")
readdir("./src/kanvekin_commands/", (err, files) => {
  if (err) console.error(err)
  files.forEach(f => {
    readdir("./src/kanvekin_commands/" + f, (err2, files2) => {
      if (err2) console.log(err2)
      files2.forEach(file => {
        let kanvekin_prop = require(`./src/kanvekin_commands/${f}/` + file);
        console.log(`🧮 [KANVEKIN - COMMANDS] ${kanvekin_prop.name} Yüklendi!`);
        commands.set(kanvekin_prop.name, kanvekin_prop);
        kanvekin_prop.aliases.forEach(alias => { aliases.set(alias, kanvekin_prop.name); });
      });
    });
  });
});


readdir("./src/kanvekin_events", (err, files) => {
  if (err) return console.error(err);
  files.filter((file) => file.endsWith(".js")).forEach((file) => {
    let kanvekin_prop = require(`./src/kanvekin_events/${file}`);
    if (!kanvekin_prop.conf) return;
    client.on(kanvekin_prop.conf.name, kanvekin_prop);
    console.log(`📚 [KANVEKIN _ EVENTS] ${kanvekin_prop.conf.name} Yüklendi!`);
  });
});

readdir("./src/kanvekin_trackers", (err, files) => {
  if (err) return console.error(err);
  files.filter((file) => file.endsWith(".js")).forEach((file) => {
    let kanvekin_prop = require(`./src/kanvekin_trackers/${file}`);
    if (!kanvekin_prop.conf) return;
    client.on(kanvekin_prop.conf.name, kanvekin_prop);
    console.log(`📩 [KANVEKIN _ TRACKERS] ${kanvekin_prop.conf.name} Yüklendi!`);
  });
});
const mongoose = require("mongoose");
mongoose.connect(kanvekin_config.mongoURL,{useUnifiedTopology: true,useNewUrlParser: true}).catch((err) => { console.log("🔴 MONGO_URL Bağlantı Hatası"); });
mongoose.connection.on("connected", () => {console.log(`🟢 MONGO_URL Başarıyla Bağlanıldı`);});
mongoose.connection.on("error", (err) => {console.error("🔴 MONGO_URL Bağlantı Hatası; "+err);});
async function cMuteCheck() {
  let guild = await client.guilds.fetch(kanvekin_config.guildID)
  let data = db.all().filter(i => i.ID.startsWith("cmuted-"))
  if (data.length < 1) return;
  for (let i in data) {
    if (data[i].data && data[i].data !== null) {
      if (data[i].data <= Date.now()) {
        let id = data[i].ID.split("-")[1];
        let member = guild.members.cache.get(id);
        if (!member) return;
        let muterole = await db.get("kanvekin-cmute-roles");
        if (!muterole) return;
        let log = client.kanalbul("mute-log")
        if (!log) return;
        member.roles.remove(muterole).catch(err => { })
        db.delete(`cmuted-${member.user.id}`)
        return log.send({ embeds: [new EmbedBuilder().setColor("#ff0000").setDescription(`> **${member} Kişisinin Susturma Süresi Bitti, Susturması Kaldırıldı!**`)] })
      }
    }
  }
}
async function vMuteCheck() {
  let guild = await client.guilds.fetch(kanvekin_config.guildID)
  let data = db.all().filter(i => i.ID.startsWith("vmuted-"))
  if (data.length < 1) return;
  for (let i in data) {
    if (data[i].data && data[i].data !== null) {
      if (data[i].data <= Date.now()) {
        let id = data[i].ID.split("-")[1];
        let member = guild.members.cache.get(id);
        if (!member) return;
        if (!member.voice.channel) return;
        let log = client.kanalbul("vmute-log")
        if (!log) return;
        member.voice.setMute(false).catch(err => { })
        db.delete(`vmuted-${member.user.id}`)
        return log.send({ embeds: [new EmbedBuilder().setColor("#ff0000").setDescription(`> **${member} Kişisinin Susturma Süresi Bitti, Susturması Kaldırıldı!**`)] })
      }
    }
  }
}

setInterval(async () => {
  await cMuteCheck();
  await vMuteCheck();
}, 3000);

Collection.prototype.array = function () { return [...this.values()] }

const { emitWarning } = process;
process.emitWarning = (warning, ...args) => {
  if (args[0] === 'ExperimentalWarning') { return; }
  if (args[0] === "TimeoutOverflowWarning") { return; }
  if (args[0] && typeof args[0] === 'object' && args[0].type === 'ExperimentalWarning') { return; }
  return emitWarning(warning, ...args);
};

Promise.prototype.sil = function (time) {
  if (this) this.then(s => {
    if (s.deletable) {
      setTimeout(async () => {
        s.delete().catch(e => { });
      }, time * 1000)
    }
  });
};

client.splitMessage = function (kanvekin, size) {
  const xChunks = Math.ceil(kanvekin.length / size)
  const chunks = new Array(xChunks)
  for (let i = 0, c = 0; i < xChunks; ++i, c += size) {
    chunks[i] = kanvekin.substr(c, size)
  }
  return chunks
}

client.true = function (message) {
  if (message) { message.react(client.emoji("emote_true") !== null ? client.emoji("emote_true") : "✅") }
};

client.false = function (message) {
  if (message) { message.react(client.emoji("emote_false") !== null ? client.emoji("emote_false") : "❌") }
};


client.ceza = async function (id, message, type, reason, durations, süre) {
  let cezaıd = db.get(`cezaid`) || 1;
  db.add(`cezaid`, 1);
  let member = await client.users.fetch(id);
  let yapan = client.guilds.cache.get(kanvekin_config.guildID).members.cache.get(message.author.id);
  if (!member) return message.react(client.emoji("emote_false") !== null ? client.emoji("emote_false") : "❌");
  message.react(client.emoji("emote_true") !== null ? client.emoji("emote_true") : "✅")
  let duration = Math.floor(durations / 1000);
  if (!type.includes("UN")) db.push(`sicil-${member.id}`, `**[${type}]** \`${yapan.user.tag}\` Tarafından **<t:${duration}> (<t:${duration}:R>)** Zamanında **"${reason}"** Sebebiyle.`)
  let embed = new EmbedBuilder().setColor("#2f3136").setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) }).setFooter({ text: kanvekin_config.footer ? kanvekin_config.footer : `kanvekin Was Here`, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
  switch (type) {
    case 'BAN':
      message.reply({ embeds: [embed.setDescription(`> **${member.tag} Kullanıcısı ${yapan} Tarafından \`${reason}\` Sebebiyle Sunucudan Yasaklandı!**\n> **\`(Ceza Numarası; #${cezaıd}\`)**`).setImage(kanvekin_config.banGif)] })
      if (client.kanalbul("ban-log")) {
        client.kanalbul("ban-log").send({
          embeds: [embed.setDescription(`> **${member.tag} Kullanıcısı [${type}] Cezası Aldı!**`).addFields(
            { name: `Banlanan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
            { name: `Banliyan Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
            { name: `Sebep`, value: codeBlock("fix", reason), inline: false },
            { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
          ).setImage(null)]
        })
      }
      break;
    case 'WARN':
      message.reply({ embeds: [embed.setDescription(`> **${member.tag} Kullanıcısı ${yapan} Tarafından \`${reason}\` Sebebiyle Uyarıldı!**\n> **\`(Ceza Numarası; #${cezaıd}\`)**`).setImage(kanvekin_config.banGif)] })
      if (client.kanalbul("others-log")) {
        client.kanalbul("others-log").send({
          embeds: [embed.setDescription(`> **${member.tag} Kullanıcısı [${type}] Cezası Aldı!**`).addFields(
            { name: `Uyarılan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
            { name: `Uyaran Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
            { name: `Sebep`, value: codeBlock("fix", reason), inline: false },
            { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
          ).setImage(null)]
        })
      }
      break;
    case 'JAIL':
      message.reply({ embeds: [embed.setDescription(`> **${member.tag} Kullanıcısı ${yapan} Tarafından \`${reason}\` Sebebiyle Cezalıya Atıldı!**\n> **\`(Ceza Numarası; #${cezaıd}\`)**`)] })
      db.set(`aktifceza-${member.id}`, "JAIL")
      if (client.kanalbul("jail-log")) {
        client.kanalbul("jail-log").send({
          embeds: [embed.setDescription(`> **${member.tag} Kullanıcısı [${type}] Cezası Aldı!**`).addFields(
            { name: `Cezalıya Atılan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
            { name: `Cezalı Atan Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
            { name: `Sebep`, value: codeBlock("fix", reason), inline: false },
            { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
          )]
        })
      }
      break;
    case 'VMUTE':
      message.reply({ embeds: [embed.setDescription(`> **${member.tag} Kullanıcısı ${yapan} Tarafından \`${reason}\` Sebebiyle ${süre} Boyunca Ses Kanallarında Susturuldu!**\n> **\`(Ceza Numarası; #${cezaıd}\`)**`)] })
      db.set(`aktifceza-${member.id}`, "VMUTE")
      if (client.kanalbul("vmute-log")) {
        client.kanalbul("vmute-log").send({
          embeds: [embed.setDescription(`> **${member.tag} Kullanıcısı ${süre} Boyunca [${type}] Cezası Aldı!**\n> **\`(Ceza Numarası; #${cezaıd}\`)**`).addFields(
            { name: `Susturulan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
            { name: `Susturan Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
            { name: `Süre`, value: codeBlock("fix", süre), inline: false },
            { name: `Sebep`, value: codeBlock("fix", reason), inline: false },
            { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
          )]
        })
      }
      break;
    case 'CMUTE':
      message.reply({ embeds: [embed.setDescription(`> **${member.tag} Kullanıcısı ${yapan} Tarafından \`${reason}\` Sebebiyle ${süre} Boyunca Chat Kanallarında Susturuldu!**\n> **\`(Ceza Numarası; #${cezaıd}\`)**`)] })
      db.set(`aktifceza-${member.id}`, "CMUTE")
      if (client.kanalbul("mute-log")) {
        client.kanalbul("mute-log").send({
          embeds: [embed.setDescription(`> **${member.tag} Kullanıcısı ${süre} Boyunca [${type}] Cezası Aldı!**`).addFields(
            { name: `Susturulan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
            { name: `Susturan Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
            { name: `Süre`, value: codeBlock("fix", süre), inline: false },
            { name: `Sebep`, value: codeBlock("fix", reason), inline: false },
            { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
          )]
        })
      }
      break;
    case 'FORCEBAN':
      message.reply({ embeds: [embed.setDescription(`> **${member.tag} Kullanıcısı ${yapan} Tarafından \`${reason}\` Sebebiyle Sunucudan Kalıcı Olarak Yasaklandı!**\n> **\`(Ceza Numarası; #${cezaıd}\`)**`)] })
      if (client.kanalbul("others-log")) {
        client.kanalbul("others-log").send({
          embeds: [embed.setDescription(`> **${member.tag} Kullanıcısı [${type}] Cezası Aldı!**`).addFields(
            { name: `Banlanan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
            { name: `Banliyan Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
            { name: `Sebep`, value: codeBlock("fix", reason), inline: false },
            { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
          )]
        })
      }
      db.push(`forcebans`, member.id)
      break;
    case 'UNFORCEBAN':
      message.reply({ embeds: [embed.setDescription(`> **${member.tag} Kullanıcısının ${yapan} Tarafından \`FORCEBAN\` Cezası Kaldırıldı!**`)] })
      if (client.kanalbul("others-log")) {
        client.kanalbul("others-log").send({
          embeds: [embed.setDescription(`> **${member.tag} Kullanıcısının [FORCEBAN] Cezası Kaldırıldı!**`).addFields(
            { name: `Cezası Kaldırılan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
            { name: `Cezayı Kaldıran Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
            { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
          )]
        })
      }
      break;
    case 'UNJAIL':
      message.reply({ embeds: [embed.setDescription(`> **${member.tag} Kullanıcısının ${yapan} Tarafından \`JAIL\` Cezası Kaldırıldı!**`)] })
      if (client.kanalbul("jail-log")) {
        client.kanalbul("jail-log").send({
          embeds: [embed.setDescription(`> **${member.tag} Kullanıcısının [JAIL] Cezası Kaldırıldı!**`).addFields(
            { name: `Cezası Kaldırılan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
            { name: `Cezayı Kaldıran Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
            { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
          )]
        })
      }
      break;
    case 'UNCMUTE':
      message.reply({ embeds: [embed.setDescription(`> **${member.tag} Kullanıcısının ${yapan} Tarafından \`CMUTE\` Cezası Kaldırıldı!**`)] })
      if (client.kanalbul("mute-log")) {
        client.kanalbul("mute-log").send({
          embeds: [embed.setDescription(`> **${member.tag} Kullanıcısının [CMUTE] Cezası Kaldırıldı!**`).addFields(
            { name: `Cezası Kaldırılan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
            { name: `Cezayı Kaldıran Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
            { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
          )]
        })
      }
      break;
    case 'UNVMUTE':
      message.reply({ embeds: [embed.setDescription(`> **${member.tag} Kullanıcısının ${yapan} Tarafından \`VMUTE\` Cezası Kaldırıldı!**`)] })
      if (client.kanalbul("vmute-log")) {
        client.kanalbul("vmute-log").send({
          embeds: [embed.setDescription(`> **${member.tag} Kullanıcısının [VMUTE] Cezası Kaldırıldı!**`).addFields(
            { name: `Cezası Kaldırılan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
            { name: `Cezayı Kaldıran Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
            { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
          )]
        })
      }
      break;
    case 'UNBAN':
      message.reply({ embeds: [embed.setDescription(`> **${member.tag} Kullanıcısının ${yapan} Tarafından \`BAN\` Cezası Kaldırıldı!**`)] })
      if (client.kanalbul("ban-log")) {
        client.kanalbul("ban-log").send({
          embeds: [embed.setDescription(`> **${member.tag} Kullanıcısının [BAN] Cezası Kaldırıldı!**`).addFields(
            { name: `Cezası Kaldırılan Kişi`, value: codeBlock("fix", member.tag + " / " + member.id), inline: false },
            { name: `Cezayı Kaldıran Kişi`, value: codeBlock("fix", yapan.user.tag + " / " + yapan.id), inline: false },
            { name: `Tarih / Zaman`, value: `**<t:${duration}> (<t:${duration}:R>)**`, inline: false },
          )]
        })
      }
      break;
  }
}

client.kanalbul = function (kanalisim) {
  let kanal = client.guilds.cache.get(kanvekin_config.guildID).channels.cache.find(kanvekin => kanvekin.name === kanalisim)
  if (!kanal) return false;
  return kanal;
}

client.rolbul = function (rolisim) {
  let rol = client.guilds.cache.get(kanvekin_config.guildID).roles.cache.find(kanvekin => kanvekin.name === rolisim)
  if (!rol) return false;
  return rol;
}

client.rolinc = function (rolinc) {
  let rol = client.guilds.cache.get(kanvekin_config.guildID).roles.cache.find(kanvekin => kanvekin.name.toLowerCase().includes(rolinc))
  if (!rol) return false;
  return rol;
}

client.emoji = function (name) {
  let emoji = client.guilds.cache.get(kanvekin_config.guildID).emojis.cache.find(kanvekin => kanvekin.name == name)
  if (!emoji) return null;
  return emoji;
}

client.sayıEmoji = (sayi) => {
  var kanvekin = sayi.toString().replace(/ /g, "     ");
  var kanvekin2 = kanvekin.match(/([0-9])/g);
  kanvekin = kanvekin.replace(/([a-zA-Z])/g, "Belirlenemiyor").toLowerCase();
  if (kanvekin2) {
    kanvekin = kanvekin.replace(/([0-9])/g, d => {
      return {
        '0': client.emoji("emote_zero") !== null ? client.emoji("emote_zero") : "0",
        '1': client.emoji("emote_one") !== null ? client.emoji("emote_one") : "1",
        '2': client.emoji("emote_two") !== null ? client.emoji("emote_two") : "2",
        '3': client.emoji("emote_three") !== null ? client.emoji("emote_three") : "3",
        '4': client.emoji("emote_four") !== null ? client.emoji("emote_four") : "4",
        '5': client.emoji("emote_five") !== null ? client.emoji("emote_five") : "5",
        '6': client.emoji("emote_six") !== null ? client.emoji("emote_six") : "6",
        '7': client.emoji("emote_seven") !== null ? client.emoji("emote_seven") : "7",
        '8': client.emoji("emote_eight") !== null ? client.emoji("emote_eight") : "8",
        '9': client.emoji("emote_nine") !== null ? client.emoji("emote_nine") : "9"
      }[d];
    });
  }
  return kanvekin;
}

Array.prototype.listRoles = function (type = "mention") {
  return this.length > 1
    ? this.slice(0, -1)
        .map((x) => `<@&${x}>`)
        .join(", ") +
        " ve " +
        this.map((x) => `<@&${x}>`).slice(-1)
    : this.map((x) => `<@&${x}>`).join("");
};

GuildMember.prototype.hasRole = function (role, every = true) {
  return (
    (Array.isArray(role) && ((every && role.every((x) => this.roles.cache.has(x))) || (!every && role.some((x) => this.roles.cache.has(x))))) || (!Array.isArray(role) && this.roles.cache.has(role))
  );
};

client.getTaskMessage = (type, count, channels) => {
  channels = channels || [];
  let taskMessage;
  switch (type) {
    case "invite":
      taskMessage = `**Sunucumuza ${count} Kişi Davet Et!**`;
      break;
    case "mesaj":
      taskMessage = `**${db.has("kanvekin-channel-chat") ? `<#${db.get("kanvekin-channel-chat")}>` : "Genel Sohbet"} Kanalına ${count} Mesaj at!**`;
      break;
    case "ses":
      taskMessage = `**Ses Kanallarında ${count / 1000 / 60} Dakika Süre Geçir!**`;
      break;
    case "taglı":
      taskMessage = `**${count} Kişiye Tag Aldır!**`;
      break;
    case "kayıt":
      taskMessage = `**Sunucumuzda ${count} Kişi Kayıt Et!**`;
      break;
    default:
      taskMessage = "**Bulunamadı!**";
      break;
  }
  return taskMessage;
};


GuildMember.prototype.giveTask = async function (guildID, type, count, prizeCount, active = true, duration, channels = []) {
  const id = await task.find({ guildId:guildID });
  const taskMessage = client.getTaskMessage(type, count, channels);
  return await new task({
    guildId:guildID,
    userId: this.user.id,
    id: id ? id.length + 1 : 1,
    type,
    count,
    prizeCount,
    active,
    finishDate: Date.now() + duration,
    channels,
    message: taskMessage
  }).save();
};

GuildMember.prototype.updateTask = async function (guildID, type, data, channel = null) {
  const taskData = await task.find({
    guildId:guildID,
    userId: this.user.id,
    type,
    active: true
  });
  taskData.forEach(async (x) => {
    if(type == "mesaj" && db.has("kanvekin-channel-chat") && channel.id !== db.get("kanvekin-channel-chat"))return;
    if (channel && x.channels && x.channels.some((x) => x !== channel.id)) return;
    x.completedCount += data;
    if (x.completedCount >= x.count) {
      x.active = false;
      x.completed = true;
      await point.updateOne({ guildId:guildID, userId: this.user.id }, { $inc: { coin: x.prizeCount } });

      const embed = new EmbedBuilder()
      .setColor(this.displayHexColor).setDescription(`
      **${this.toString()} Tebrikler! ${type.charAt(0).toLocaleUpperCase() + type.slice(1)} Görevini Başarıyla Tamamladın!**
      
      ${x.message}
      **${client.emoji("emote_coin")} \`${x.prizeCount} Puan Hesabına Eklendi!\`**
      `);
      this.send({embeds:[embed]}).catch(err => { });
    }
    await x.save();
  });
};

client.progressBar = (value, maxValue, size) => {
  const progress = Math.round(size * (value / maxValue > 1 ? 1 : value / maxValue));
  const emptyProgress = size - progress > 0 ? size - progress : 0;

  const progressText = `${client.emoji("emote_fill")}`.repeat(progress);
  const emptyProgressText = `${client.emoji("emote_empty")}`.repeat(emptyProgress);

  return emptyProgress > 0
    ? progress === 0
      ? `${client.emoji("emote_emptystart")}` + progressText + emptyProgressText + `${client.emoji("emote_emptyend")}`
      : `${client.emoji("emote_fillstart")}` + progressText + emptyProgressText + `${client.emoji("emote_emptyend")}`
    : `${client.emoji("emote_fillstart")}` + progressText + emptyProgressText + `${client.emoji("emote_fillend")}`;
};

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.last = function () {
  return this[this.length - 1];
};



client.login(kanvekin_config.token).then(() =>
  console.log(`🟢 ${client.user.tag} Başarıyla Giriş Yaptı!`)
).catch((kanvekin_err) => console.log(`🔴 Bot Giriş Yapamadı / Sebep: ${kanvekin_err}`));
