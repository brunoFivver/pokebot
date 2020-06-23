const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
var Pokedex2 = require('pokedex-promise-v2');
var P = new Pokedex2();
const pokeRand = require('pokemon-randomizer');
module.exports.run = async (bot,msg, args, prefix,database) => {
 if(!args[1]) return msg.reply(`**Usage:**\`\`${prefix}setteam <index(1,2,3)> <pokémon id>\`\`\n`)
 if (isNaN(args[1]))return msg.reply(`Hey this must be a number!`)
 if(!args[2]) return msg.reply(`**Usage:**\`\`${prefix}setteam <index(1,2,3)> <pokémon id>\`\`\n`)
 if(args[1] <= 0 || args[1] > 3) return msg.reply(`**Usage:**\`\`${prefix}setteam <index(1,2,3)> <pokémon id>\`\`\n`)
 var data = await database.ref(`Users/${msg.author.id}/pokedex/${args[2]}`).once("value")
 if(data.val() === null) return msg.reply(`\`\`Invalid Pokémon\`\`\n`)

 database.ref(`Users/${msg.author.id}/team`).once("value",async function(team) {
     if(team.val() === null) {
        database.ref(`Users/${msg.author.id}/pokedex/${args[2]}`).remove()
        database.ref(`Users/${msg.author.id}/team/${args[1]}`).update({
            pokemon: data.val().pokemon,
            pokemon_attack:  data.val().pokemon_attack,
            pokemon_defence: data.val().pokemon_defence,
            pokemon_generation: data.val(). pokemon_generation,
            pokemon_health_full: data.val().pokemon_health,
            pokemon_health: data.val().pokemon_health,
            pokemon_id:  data.val().pokemon_id,
            pokemon_level:  data.val().pokemon_level,
            pokemon_sprite:  data.val().pokemon_sprite,
          })     
          const exampleEmbed = new discord.MessageEmbed()
          .setColor('#ff0000')
            .setTitle(`Pokémon Added to the team ${data.val().pokemon}`)
            .setDescription(`
            \`\`\`Health: ${data.val().pokemon_health} \nAttack: ${data.val().pokemon_attack}\nDefense: ${data.val().pokemon_defence}\`\`\`
        
            `)
          .setImage(data.val().pokemon_sprite)
          .setTimestamp()         
          return msg.reply(exampleEmbed)   
     }else {
        var pokemon = await database.ref(`Users/${msg.author.id}/team/${args[1]}`).once("value")

        database.ref(`Users/${msg.author.id}/pokedex/${args[2]}`).remove()
        database.ref(`Users/${msg.author.id}/team/${args[1]}`).update({
            pokemon: data.val().pokemon,
            pokemon_attack:  data.val().pokemon_attack,
            pokemon_defence: data.val().pokemon_defence,
            pokemon_generation: data.val(). pokemon_generation,
            pokemon_health_full: data.val().pokemon_health,

            pokemon_health: data.val().pokemon_health,
            pokemon_id:  data.val().pokemon_id,
            pokemon_level:  data.val().pokemon_level,
            pokemon_sprite:  data.val().pokemon_sprite,
          })  
if(pokemon.val() != null) {

        database.ref(`Users/${msg.author.id}/pokedex/${pokemon.val().pokemon_id}`).update({
            pokemon:pokemon.val().pokemon,
            pokemon_attack: pokemon.val().pokemon_attack,
            pokemon_defence:pokemon.val().pokemon_defence,
            pokemon_generation: pokemon.val(). pokemon_generation,
            pokemon_health_full:pokemon.val().pokemon_health,

            pokemon_health: pokemon.val().pokemon_health,
            pokemon_id: pokemon.val().pokemon_id,
            pokemon_level:  pokemon.val().pokemon_level,
            pokemon_sprite:  pokemon.val().pokemon_sprite,
          })   
        }         
          const exampleEmbed = new discord.MessageEmbed()
          .setColor('#ff0000')
            .setTitle(`Pokémon Added to the team ${data.val().pokemon}`)
            .setDescription(`
            \`\`\`Health: ${data.val().pokemon_health} \nAttack: ${data.val().pokemon_attack}\nDefense: ${data.val().pokemon_defence}\`\`\`
        
            `)
          .setImage(data.val().pokemon_sprite)
          .setTimestamp()         
          return msg.reply(exampleEmbed)                  
     }
 })

  
}

module.exports.config = {
  name: "setteam",
  permission: "EveryOne",
  description: "setteam",
  usage: "p!setteam",
  aliases: []
}