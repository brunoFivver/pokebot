const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
var Pokedex = require('pokedex'),
    pokedex = new Pokedex();
    const capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    }
module.exports.run = async (bot,msg, args, prefix,database) => {
    const user = msg.mentions.users.first() || msg.author;
database.ref(`Users/${user.id}/team`).once("value",function(data) {
if(data.val() === null) return msg.reply("This user don't have a team yet!")
var team_poke = ""
let i = 0
data.forEach(function(poke) {
    i++
team_poke += `\`\`\`[${i}] ${poke.val().pokemon}\nHealth:${poke.val().pokemon_health}\nAttack:${poke.val().pokemon_attack}\nDefense:${poke.val().pokemon_defence}\n\`\`\``
})


const exampleEmbed = new discord.MessageEmbed()
.setColor('GREEN')
.setTitle(`***${user.username}'s*** Team`)
.setDescription(team_poke)
.setTimestamp()
.setThumbnail(user.displayAvatarURL())
msg.reply(exampleEmbed)
})
};

module.exports.config = {
  name: "team",
  permission: "EveryOne",
  description: "view team",
  usage: "p!team",
  aliases: []
}