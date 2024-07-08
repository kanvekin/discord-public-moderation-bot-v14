const {PermissionFlagsBits, ActivityType} = require("discord.js");
const kanvekin_config = require("../../../kanvekin_config")
const client = global.client;
const canvafy = require('canvafy');
const db = client.db;
module.exports = {
    name: "spotify",
    usage:"spotify [@kanvekin / ID]",
    category:"genel",
    aliases: ["spoti","şarkı","dinlediğim","müzik","spotfy"],
    execute: async (client, message, args, kanvekin_embed) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (member && member.presence && member.presence.activities && member.presence.activities.some(kanvekin => kanvekin.name == "Spotify" && kanvekin.type == ActivityType.Listening)) {
          let durum = await member.presence.activities.find(kanvekin => kanvekin.type == ActivityType.Listening);
          const spotify = await new canvafy.Spotify()
          .setAuthor(durum.state)
          .setAlbum(durum.assets.largeText)
          .setBackground("image", `${message.guild.bannerURL({extension:"png",size:2048}) !== null ? message.guild.bannerURL({extension:"png",size:2048}) : kanvekin_config.shipArkaplan}`)
          .setImage(`https://i.scdn.co/image/${durum.assets.largeImage.slice(8)}`)
          .setTimestamp(new Date(Date.now()).getTime() - new Date(durum.timestamps.start).getTime(), new Date(durum.timestamps.end).getTime() - new Date(durum.timestamps.start).getTime())
          .setTitle(durum.details)
          .build();
        
          return message.reply({files:[{name:"canvafy.png",attachment:spotify}],embeds: [kanvekin_embed.setImage('attachment://canvafy.png')] });
        }else{ return message.reply({embeds: [kanvekin_embed.setDescription(`> **Kullanıcı Spotify Üzerinde Şarkı Dinlemiyor!**`)] });}

    }
}
