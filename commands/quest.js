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
    database.ref(`Users/${msg.author.id}/Quest`).once("value",function(data) {
        if(data.val() === null) return msg.reply(`You already completed the quest or you don't have a quest yet! Wait for 24 hours to get a new quest!`)
        const quest = new discord.MessageEmbed()
        .setColor('GREEN')
        .setAuthor(msg.author.username, msg.author.displayAvatarURL())
        .setTitle(`Quests || **${data.val().user_quest_items}/${data.val().quest_number}**`)
        .setDescription(`
        ${data.val().quest_msg}
        Reward: **${data.val().quest_reward}** <:coins:718800872058126347> 
        `)
        .setTimestamp()
        .setThumbnail("https://cdn.glitch.com/e743af71-9ae6-443d-9641-afbff15d710b%2Ftenor%20(1).gif?v=1591575958518")

        msg.reply(quest)      
    })
};

module.exports.config = {
  name: "quest",
  permission: "EveryOne",
  description: "See your quests",
  usage: "p!quest",
  aliases: []
}