const voiceUser = require("../kanvekin_schemas/voicesSchema");
const cameraOpenedAt = require("../kanvekin_schemas/streamsJoinSchema")
const client = global.client;
const kanvekin_config = require("../../kanvekin_config");
const { Events } = require("discord.js");

module.exports = async (oldState, newState) => {
 if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
    if ((newState.member.voice && newState.member.voice.streaming == true)) {
      await cameraOpenedAt.findOneAndUpdate({ userId: newState.id }, { $set: { Data: Date.now() } }, { upsert: true });
    } else if ((newState.member.voice && newState.member.voice.streaming == false)) {
      let cameraOpenedAtData = await cameraOpenedAt.findOne({ userId: oldState.id });
      if (!cameraOpenedAtData){
       await cameraOpenedAt.findOneAndUpdate({ userId: oldState.id }, { $set: { Data: Date.now() } }, { upsert: true });
      cameraOpenedAtData = await cameraOpenedAt.findOne({ userId: oldState.id });
      }
      const data = Date.now() - cameraOpenedAtData.Data;
      await saveData(oldState, data);
      await cameraOpenedAt.findOneAndDelete({ userId: oldState.id }, { upsert: true });
  } else {
    return undefined;
  }
}
async function saveData(user, data) {
    await voiceUser.updateOne({ guildId: user.guild.id, userId: user.id },{$inc: {streamStat: data}},{ upsert: true });
}

module.exports.conf = {name:Events.VoiceStateUpdate};
