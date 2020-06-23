const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
var Pokedex2 = require('pokedex-promise-v2');
var P = new Pokedex2();
module.exports.run = async (bot,msg, args, prefix,database) => {

    if(!args[1]){
      database.ref(`Users/${msg.author.id}`).once("value",function(data) {

  const exampleEmbed = new discord.MessageEmbed()
  .setColor('GREEN')
    .setTitle(`You Current Location: ***${data.val().location}***`)
    .setDescription(`\`\`\`Users on Mystic Island Have more chances of getting a Legendary Pokémon!! \`\`\`\n You can go to a different location using: **${prefix}location <location name (Mystic,Pokeverse)>** `)
.setTimestamp() 
.setThumbnail(msg.author.displayAvatarURL())
msg.reply(exampleEmbed)
      })
    }
    var possible = ['Mystic','Pokeverse']
    if(args[1]) {
      if(!possible.includes(possible)) return msg.reply(`This is not a valid location. Choose one of: **${possible}**`)
      if(args[1] === "Mystic") {
        if(!msg.member.roles.cache.find(r => r.name === "VIP")) return msg.reply(`You don't have access to that world!`)
          database.ref(`Users/${msg.author.id}`).update({
            location:"Mystic"
          }).then(function() {
            msg.reply(`You are now at **Mystic Island**!`)
          })
        }
        if(args[1] === "Pokeverse") {
          database.ref(`Users/${msg.author.id}`).update({
            location:"Pokeverse"
          }).then(function() {
            msg.reply(`You are now at **Pokeverse**!`)
          })      
        }
    }

};

module.exports.config = {
  name: "location",
  permission: "EveryOne",
  description: "Go to Location",
  usage: "p!location",
  aliases: []
}