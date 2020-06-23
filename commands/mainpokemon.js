const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
const cripto = require('crypto-random-string');

var Pokedex = require('pokedex'),
    pokedex = new Pokedex();
module.exports.run = async (bot,msg, args, prefix,database) => {
    if(!args[1]) return msg.reply(`**Usage:**\`\`${prefix}mainpokemon <id>\`\`\n`)
    var id = args[1]
    var hash = cripto({length: 10, type: 'numeric'});

database.ref(`Users/${msg.author.id}/pokedex/${id}`).once("value",function(data) { 
if(data.val() === null) return msg.reply(`\`\`Not A valid Pokémon\`\`\n`)
else {
  database.ref(`Users/${msg.author.id}/main_pokemon`).once("value",function(main) {
    if(main.val() != null) {
      database.ref(`Users/${msg.author.id}/pokedex/${hash}`).update({
        pokemon:`${main.val().pokemon}`,    
        pokemon_id:hash,
        pokemon_ability:main.val().pokemon_ability,
        pokemon_level:main.val().pokemon_level,
        pokemon_health:main.val().pokemon_health,
        pokemon_health_full:main.val().pokemon_health,
        pokemon_attack:main.val().pokemon_attack ,
        pokemon_defence:main.val().pokemon_defence,
        pokemon_generation:main.val().pokemon_generation,
        pokemon_sprite:main.val().sprite,   
        xp:  main.val().xp,
      })
    }

    database.ref(`Users/${msg.author.id}/main_pokemon`).remove()
    database.ref(`Users/${msg.author.id}/main_pokemon`).update({
      pokemon:`${data.val().pokemon}`,    
      pokemon_id:data.val().pokemon_id,
      pokemon_level:data.val().pokemon_level,
      pokemon_health:data.val().pokemon_health,
      pokemon_health_full:data.val().pokemon_health,

      pokemon_attack:data.val().pokemon_attack ,
      pokemon_defence:data.val().pokemon_defence,
      pokemon_generation:data.val().pokemon_generation,
      pokemon_ability:data.val().pokemon_ability,
      sprite:data.val().pokemon_sprite,     
      xp:0,
    })
    database.ref(`Users/${msg.author.id}/pokedex/${id}`).remove()
    const exampleEmbed = new discord.MessageEmbed()
    .setColor('GREEN')
    .setAuthor(msg.author.username, msg.author.displayAvatarURL())
    .setTitle(`Main Pokémon Changed`)
    .setDescription(` Main Pokémon Changed \`\`\` ${data.val().pokemon} (lvl ${data.val().pokemon_level}):\n Health:${data.val().pokemon_health}\n Attack:${data.val().pokemon_attack} \n Defense:${data.val().pokemon_defence} \n\`\`\``)
    .setTimestamp()
    .setThumbnail(data.val().pokemon_sprite)
    msg.reply(exampleEmbed)
  })
}
    
})

};

module.exports.config = {
  name: "mainpokemon",
  permission: "EveryOne",
  description: "See your balance",
  usage: "p!balance",
  aliases: []
}