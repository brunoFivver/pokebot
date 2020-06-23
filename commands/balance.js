const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
var Pokedex = require('pokedex'),
    pokedex = new Pokedex();
module.exports.run = async (bot,msg, args, prefix,database) => {
database.ref(`Users/${msg.author.id}`).once("value",function(data) {
if(data.val() === null) return msg.reply("So you are new,huh? Start now with `p!start`")
const exampleEmbed = new discord.MessageEmbed()
.setColor('GREEN')
.setAuthor(msg.author.username, msg.author.displayAvatarURL())
.setTitle(`${msg.author.username} Balance`)
.setDescription(`Poke Dollars: **${data.val().coins}**`)
.setTimestamp()
.setThumbnail("https://cdn.glitch.com/3fe60e93-dd05-4e6c-a7be-73fac8c3d144%2Ftenor.gif?v=1591403528825")
msg.reply(exampleEmbed)
})
};

module.exports.config = {
  name: "balance",
  permission: "EveryOne",
  description: "See your balance",
  usage: "p!balance",
  aliases: []
}