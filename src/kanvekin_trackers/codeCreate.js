const { Events, EmbedBuilder,Collection } = require("discord.js")
const client = global.client;
const kanvekin_config = require("../../kanvekin_config");
module.exports = async (invite) => {
const invites = new Collection();
invite.guild.invites.fetch().then((kanvekin) => {
kanvekin.map((x) => {invites.set(x.code, {uses: x.uses, inviter: x.inviter, code: x.code });
});
client.invites.set(invite.guild.id, invites);
});
}
module.exports.conf = {name:Events.InviteCreate}