var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();
var Jimp = require('jimp');
const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
var Pokedex = require('pokedex'),
    pokedex = new Pokedex();
module.exports.run = async (bot,msg, args, prefix,database) => {
  const user = msg.mentions.users.first();
  var is_new = await  database.ref(`Users/${msg.author.id}`).once("value")
  var quest = await database.ref(`Users/${msg.author.id}/Quest`).once("value")
  if(is_new.val() === null) return msg.reply("So you are new,huh? Start now with `p!start`")
if(!user) {
  if(!args[1]) {
    database.ref(`Trades/${msg.author.id}`).once("value",async function(data) {
      if(data.val() === null) {
        const trades_embed = new discord.MessageEmbed()
  .setColor('RED')
  .setTitle(`***${msg.author.username}*** Trades`)
  .setDescription(`Hey! You Don't have any available trades!
  Want to trade with a user? Use: 
  ***p!trade @user <your pokémon id> <his pokémon id>***
  `)
  msg.reply(trades_embed)
      }else {
        const trades_embed = new discord.MessageEmbed()
  .setColor('RED')
  .setTitle(`***${msg.author.username}*** Trade`)
  .setDescription(`**Details:**
 ** ${data.val().Traders_name} (lvl ${data.val().Traders_level})**
 FOR
 ** ${data.val().Users_name} (lvl ${data.val().Users_level})**

  Want to remove this trade? Use: 
  ***p!trade cancel***
  `)
  msg.reply(trades_embed)

      }
    })
  }
  if(args[1] === "accept") {
    if(!args[2]) return msg.reply(`You need to send the id of the trader's id`)
    database.ref(`Trades/${args[2]}`).once("value",function(data) { 
      if(data.val() === null) msg.reply(`Not a valid trade`)
      if(data.val().User_id != msg.author.id) return msg.reply(`This Is not your trade!`)

      if(quest.val() != null) {
        if(quest.val().quest_type === 'Trade') {
            const quest_embed = new discord.MessageEmbed()
            .setColor('GREY')
            .setTitle(`You Completed Your Quest: Trade **${quest.val().quest_number}** Pokémon`)
            .setDescription(`Nice, You have won: **${quest.val().quest_reward}** <:coins:718800872058126347>`)
            .setTimestamp()      
            .setImage('https://cdn.glitch.com/e743af71-9ae6-443d-9641-afbff15d710b%2Ftreasure02.gif?v=1591553774616')
            msg.reply(quest_embed)
            database.ref(`Users/${msg.author.id}`).update({
              coins:data.val().coins + quest.val().quest_reward
            })
            database.ref(`Users/${msg.author.id}/Quest`).remove()
          
        }
      }   

          database.ref(`Users/${args[2]}/pokedex/${data.val().Traders_Pokemon}`).once("value",function(trader) {
            database.ref(`Users/${data.val().User_id}/pokedex/${data.val().Traders_Pokemon}`).update({
              pokemon: trader.val().pokemon,
              pokemon_attack: trader.val().pokemon_attack,
              pokemon_defence: trader.val().pokemon_defence,
              pokemon_generation: trader.val(). pokemon_generation,
              pokemon_health_full:trader.val().pokemon_health,

              pokemon_health: trader.val().pokemon_health,
              pokemon_id: trader.val().pokemon_id,
              pokemon_ability:trader.val(). pokemon_ability,
              pokemon_level: trader.val().pokemon_level,
              pokemon_sprite: trader.val().pokemon_sprite,
            })
            database.ref(`Users/${data.val().Trader_id}/pokedex/${data.val().Traders_Pokemon}`).remove()
          })
          database.ref(`Users/${data.val().User_id}/pokedex/${data.val().Users_pokemon}`).once("value",function(trader) {
            database.ref(`Users/${data.val().Trader_id}/pokedex/${data.val().Users_pokemon}`).update({
              pokemon: trader.val().pokemon,
              pokemon_attack: trader.val().pokemon_attack,
              pokemon_defence: trader.val().pokemon_defence,
              pokemon_generation: trader.val(). pokemon_generation,
              pokemon_health: trader.val().pokemon_health,
              pokemon_ability:trader.val(). pokemon_ability,
              pokemon_health_full:trader.val().pokemon_health,

              pokemon_id: trader.val().pokemon_id,
              pokemon_level: trader.val().pokemon_level,
              pokemon_sprite: trader.val().pokemon_sprite,
            })
            database.ref(`Users/${data.val().User_id}/pokedex/${data.val().Users_pokemon}`).remove()
          })         
         database.ref(`Trades/${args[2]}`).remove()

        msg.reply(`You Accepted the trade!`)
      
    })
  }
if(args[1] === "cancel") {
  if(!args[2]) {
    database.ref(`Trades/${msg.author.id}`).once("value",function(data) {
      if(data.val() === null) return msg.reply("You don't have trade to remove! | want to cancel a user's trade? Use: `p!trade cancel <trader's id>`")
      database.ref(`Trades/${msg.author.id}`).remove()
      return msg.reply(`Trade Canceled`)
    })
  }else {
    database.ref(`Trades/${args[2]}`).once("value",function(data) {
      if(data.val() === null) return msg.reply(`You don't have trade to remove!`)
      if(data.val().User_id != msg.author.id) return msg.reply(`This is not your trade to be removed!`)
      database.ref(`Trades/${args[2]}`).remove()
      return msg.reply(`Trade Canceled`)
    })   
  }

}
}else {
  if(user.id === msg.author.id) return msg.reply(`You can't trade with yourself!`)
  if(user.id ==="717852794396213328") return msg.reply(`You can't rade with that user!`)
  var is_Traded = await database.ref(`Trades/${msg.author.id}`).once("value")

  if(is_Traded.val() != null) return msg.reply("You already got a trade! Use: `p!trade` to your trades")
  database.ref(`Users/${user.id}/pokedex`).once("value",async function(data) {
    var myPokémons = await database.ref(`Users/${msg.author.id}/pokedex`).orderByKey().limitToLast(5).once("value")

    if(data.val() === null) return msg.reply(`Hey! This is not a valid User`)
    if(!args[2]){
      var descri = ""
      myPokémons.forEach(function(poke) {
        descri+= `\n **${poke.val().pokemon}** ***[lvl ${poke.val().pokemon_level}]*** ( id ${poke.val().pokemon_id}) `
      })
      const trades_embed = new discord.MessageEmbed()
.setColor('RED')
.setTitle(`***${msg.author.username}*** Trades`)
.setDescription(`Hey! You need to send the ***id of your pokémon***
Here are some of yours Pokémons:
${descri}

Want to see more pokémons? Use:
***p!pokemons***
`)
msg.reply(trades_embed)

    }else {
      var myPokémons = await  database.ref(`Users/${msg.author.id}/pokedex/${args[2]}`).once("value")
      if(myPokémons.val() === null) return msg.reply(`That is a not valid Pokémon Id!`)
      if(!args[3]) {
        var descri = ""
       data.forEach(function(poke) {
          descri+= `\n **${poke.val().pokemon}**  | ***[Level ${poke.val().pokemon_level}]*** | ID: (${poke.val().pokemon_id}) `
        })       
        const trades_embed = new discord.MessageEmbed()
        .setColor('RED')
        .setTitle(`***${msg.author.username}*** Trades`)
        .setDescription(`Hey! You need to send the ***id of the trader's pokémon***
        Here are some of his Pokémons:
        ${descri}
        
        `)
        msg.reply(trades_embed)
      }else {
        var hisPokémons = await  database.ref(`Users/${user.id}/pokedex/${args[3]}`).once("value")
        if(hisPokémons.val() === null) return msg.reply(`That is a not valid Pokémon Id!`)
      
        const trades_embed = new discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle(`Trade Created || ***${msg.author.username}*** Want To trade with ***${user.username}***`)
        .setDescription(`${msg.author.username} is trading a ***${myPokémons.val().pokemon} (lvl ${myPokémons.val().pokemon_level})*** for a ***${hisPokémons.val().pokemon} (lvl ${hisPokémons.val().pokemon_level})***
        want to confirm or cancel? the trad? Use:
        ***p!trade accept <Trader's id>***  | ***p!trade cancel <Trader's id>*** 
        `)
        database.ref(`Trades/${msg.author.id}`).once("value",function(data) {
          if(data.val() != null) {
            const trades_embed = new discord.MessageEmbed()
            .setColor('RED')
            .setTitle(`You already got a trade!`)
            .setDescription(`
            want to remove the trad? Use:
            ***p!trade cancel ***          
            `)           
            msg.reply(trades_embed)     
          }else {
            database.ref(`Trades/${msg.author.id}`).update({
              Traders_name:myPokémons.val().pokemon,
              Traders_Pokemon:myPokémons.val().pokemon_id,
              Traders_level:myPokémons.val().pokemon_level,
              Trader_id:msg.author.id,
              Users_name:hisPokémons.val().pokemon,
              Users_level:hisPokémons.val().pokemon_level,
              Users_pokemon:hisPokémons.val().pokemon_id,
              User_id:user.id,
            })
            msg.reply(trades_embed)        
          }
        })
      }
    }
  })
}
};

module.exports.config = {
  name: "trade",
  permission: "EveryOne",
  description: "Trade Commands",
  usage: "p!trade",
  aliases: []
}