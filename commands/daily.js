const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
var Pokedex = require('pokedex'),
    pokedex = new Pokedex();
    const cooldown = new Set()
module.exports.run = async (bot,msg, args, prefix,database) => {
database.ref(`Users/${msg.author.id}`).once("value",function(data) {
    if(cooldown.has(msg.author.id)) return msg.reply(`Hey You are in a cooldown,you need to wait 24 HOURS in order to use this command again!`)
database.ref(`Users/${msg.author.id}`).update({
    coins:data.val().coins + 5000,
})
const exampleEmbed = new discord.MessageEmbed()
.setColor('GREEN')
.setAuthor(msg.author.username, msg.author.displayAvatarURL())
.setTitle(`${msg.author.username} Balance`)
.setDescription(`<:present:721471252417609768> You got 5000 Poke Dollars. You can use this command again in 24 hours!`)
.setTimestamp()
.setThumbnail("https://cdn.glitch.com/3fe60e93-dd05-4e6c-a7be-73fac8c3d144%2Ftenor.gif?v=1591403528825")
msg.reply(exampleEmbed)
cooldown.add(msg.author.id)
})

setInterval(function(){ 
    cooldown.delete(msg.author.id)
},  24 *3600000);
};

module.exports.config = {
  name: "daily",
  permission: "EveryOne",
  description: "get daily",
  usage: "p!daily",
  aliases: []
}