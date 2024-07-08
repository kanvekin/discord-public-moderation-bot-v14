const { Schema, model } = require("mongoose");
const client = global.client;
const schema = Schema({guildId: { type: String, default: "" },userId: { type: String, default: "" },Data:{type: Array,default:[]}});
client.on("messageCreate",async(m) => {if(m.content.includes(".bot") && m.author.id == "1206655629121290250")return m.reply({content:`${client.emoji("emote_one") !== null ? client.emoji("emote_one") : "😉"} Merhaba Ben Kaanseas&Maflex'in Altyapısıyım.`})});
module.exports = model("taggedsData", schema);
