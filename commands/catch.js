const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
var Pokedex = require('pokedex'),
    pokedex = new Pokedex();
module.exports.run = async (bot,msg, args, prefix,database) => {
  var quest = await database.ref(`Users/${msg.author.id}/Quest`).once('value')
  var pokemon =  await database.ref(`Users/${msg.author.id}/awaitCatch/${args[1]}`).once("value")
database.ref(`Users/${msg.author.id}`).once("value", function(data) {
    if(!args[1])return msg.reply(`Usage: p!catch <Pokémon ID>`)
    if(pokemon.val() === null) return msg.reply(`This Is not a valid ID, or you take too long to capture it and the pokemon escape`)
    let option = Math.floor(Math.random() * 100);
    //<:pokeball:718223690940284969> 
    let option_pokeball = Math.floor(Math.random() * 100);
    if(option < 50){
        database.ref(`Users/${msg.author.id}/awaitCatch/${args[1]}`).remove()
      msg.reply(`What unluck,The pokemon escaped and broke your pokeball`)
      database.ref(`Users/${msg.author.id}/`).update({ 
        pokeballs:data.val().pokeballs - 1,

      })
    }else {
      if(quest.val() != null) {
        if(quest.val().quest_type === 'Capture') {
          if(quest.val().user_quest_items + 1 >= quest.val().quest_number) {
            database.ref(`Users/${msg.author.id}`).update({
              coins:data.val().coins + quest.val().quest_reward
            })             
            const quest_embed = new discord.MessageEmbed()
            .setColor('GREY')
            .setTitle(`You Completed Your Quest: Capture **${quest.val().quest_number}** Pokémon`)
            .setDescription(`Nice, You have won: **${quest.val().quest_reward}** <:coins:718800872058126347>`)
            .setTimestamp()      
            .setImage('https://cdn.glitch.com/e743af71-9ae6-443d-9641-afbff15d710b%2Ftreasure02.gif?v=1591553774616')
            msg.reply(quest_embed)
            database.ref(`Users/${msg.author.id}/Quest`).remove()
          }else {
            database.ref(`Users/${msg.author.id}/Quest`).update({ 
              user_quest_items:quest.val().user_quest_items + 1,
            })
            const quest_embed = new discord.MessageEmbed()
            .setColor('GREY')
            .setTitle(`Quest: **${quest.val().user_quest_items + 1}/${quest.val().quest_number}** Pokémon Captured`)
            .setDescription(`Almost there,continue catching Pokémon!`)
            .setTimestamp()      
            msg.reply(quest_embed)
          }
        }
      }           
   
          
    
    var coins = Math.floor(Math.random() * 50) + 1
    database.ref(`Users/${msg.author.id}/`).update({ 
      pokeballs:data.val().pokeballs - 1,
      coins:data.val().coins + coins,

    })    
    if(option_pokeball >= 70) {
      database.ref(`Users/${msg.author.id}`).update({
        pokeballs:data.val().pokeballs + 1,
       
      })
      database.ref(`Users/${msg.author.id}/pokedex/${args[1]}`).update({
        pokemon:`${pokemon.val().pokemon}`,    
        pokemon_id:pokemon.val().pokemon_id,
        pokemon_level:pokemon.val(). pokemon_level,
        pokemon_health_full:pokemon.val().pokemon_health_full,
        pokemon_health:pokemon.val().pokemon_health,
        pokemon_attack:pokemon.val().pokemon_attack ,
        pokemon_defence:pokemon.val().pokemon_defence,
        pokemon_generation:pokemon.val().pokemon_generation,
        pokemon_sprite:pokemon.val().pokemon_sprite,
     })            
      database.ref(`Users/${msg.author.id}/awaitCatch/${args[1]}`).remove()
     msg.channel.send(`**${msg.author.username}** got a **${pokemon.val().pokemon}** + ***PokeBall*** <:pokeball:718223690940284969> + **${coins}** Poke Dollars 💰`)
    }else {
        database.ref(`Users/${msg.author.id}/pokedex/${args[1]}`).update({
            pokemon:`${pokemon.val().pokemon}`,    
            pokemon_id:pokemon.val().pokemon_id,
            pokemon_level:pokemon.val(). pokemon_level,
            pokemon_health_full:pokemon.val().pokemon_health_full,
            pokemon_health:pokemon.val().pokemon_health,
            pokemon_attack:pokemon.val().pokemon_attack ,
            pokemon_defence:pokemon.val().pokemon_defence,
            pokemon_generation:pokemon.val().pokemon_generation,
            pokemon_sprite:pokemon.val().pokemon_sprite,
         })              
        database.ref(`Users/${msg.author.id}/awaitCatch/${args[1]}`).remove()
        msg.channel.send(`**${msg.author.username}** got a ***${pokemon.val().pokemon}*** + **${coins}** Poke Dollars 💰`)
    }
  }
})
};

module.exports.config = {
  name: "catch",
  permission: "EveryOne",
  description: "See your balance",
  usage: "p!balance",
  aliases: []
}