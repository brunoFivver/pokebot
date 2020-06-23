const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
const { SlotMachine, SlotSymbol } = require('slot-machine');
var RouletteWheel = require('roulette-wheel');
var coinflip = require('coinflip');
var Pokedex = require('pokedex'),



    pokedex = new Pokedex();
    const capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    }

module.exports.run = async (bot,msg, args, prefix,database) => {
    database.ref(`Users/${msg.author.id}`).once("value",async function(data) {
        var quest = await database.ref(`Users/${msg.author.id}/Quest`).once("value")
        var cassino_op = ['slots','coinflip','roulette']
        if(!args[1]) return msg.reply(`Choose a game: **${cassino_op}**`)
        if(!cassino_op.includes(args[1])) return msg.reply(`This is not a valid game! Choose a game: **${cassino_op}**`)
    if(args[1] === "slots") {
        if(!args[2]) return msg.reply(`Hey send me how much you want o bet!`)
        if (isNaN(args[2]))return msg.reply(`Hey this must be a number!`)
            if(args[2] > data.val().coins) return msg.reply(`You Can't bet **${args[2]}**. `)
        if(args[2] > 100) return msg.reply(`Hey You can't bet more than 100 Poke Dollars!`)
        if( data.val().coins < args[2]) return msg.reply(`Hey you don't have this amount to bet!`)

    const cherry = new SlotSymbol('cherry', {
        display: '🍒',
        points: 0.2,
        weight: 100
    });
     
    const money = new SlotSymbol('money', {
        display: '💰',
        points:  0.5,
        weight: 50
    });
     
    const wild = new SlotSymbol('wild', {
        display: '💎',
        points: 1,
        weight: 20
    });
    const machine = new SlotMachine(3, [cherry, money, wild]);
    const results = machine.play();
    var won = results.totalPoints
    if(quest.val() != null) {
        if(quest.val().quest_type === 'Slots') {
          if(quest.val().user_quest_items + 1 >= quest.val().quest_number) {
            const quest_embed = new discord.MessageEmbed()
            .setColor('GREY')
            .setTitle(`You Completed Your Quest: Play **${quest.val().quest_number}** in Slots`)
            .setDescription(`Nice, You have won: **${quest.val().quest_reward}** <:coins:718800872058126347>`)
            .setTimestamp()      
            .setImage('https://cdn.glitch.com/e743af71-9ae6-443d-9641-afbff15d710b%2Ftreasure02.gif?v=1591553774616')
            msg.reply(quest_embed)
            database.ref(`Users/${msg.author.id}`).update({
              coins:data.val().coins + quest.val().quest_reward
            })
            database.ref(`Users/${msg.author.id}/Quest`).remove()
          }else {
            database.ref(`Users/${msg.author.id}/Quest`).update({ 
              user_quest_items:quest.val().user_quest_items + 1,
            })
            const quest_embed = new discord.MessageEmbed()
            .setColor('GREY')
            .setTitle(`Quest: **${quest.val().user_quest_items + 1}/${quest.val().quest_number}** Slots Played`)
            .setDescription(`Almost there,continue playing slots!`)
            .setTimestamp()      
            msg.reply(quest_embed)
          }
        }
      }   

     var message = ""
     if(won < 0.7) {
        database.ref(`Users/${msg.author.id}`).update({
            coins:data.val().coins - parseInt(args[2])
        })
        message = `You Lost **${args[2] }** Poke Dollars`
     }else {
        database.ref(`Users/${msg.author.id}`).update({
            coins:data.val().coins + args[2] * won
        })        
        message = `You Won **${ parseInt(args[2] * won)}** Poke Dollars`
     }
    const shop = new discord.MessageEmbed()
    .setColor('GREEN')
    .setAuthor(msg.author.username, msg.author.displayAvatarURL())
    .setTitle(`Rocket Casino - Slots`)
    .setDescription(`${results.visualize()}

    ${message} <:coins:718800872058126347> `)
    .setTimestamp()
    msg.reply(shop)    


}
if(args[1] === "coinflip") {
    if(!args[2]) return msg.reply(`Hey send me how much you want o bet!`)
    if (isNaN(args[2]))return msg.reply(`Hey this must be a number!`)
        if(args[2] > data.val().coins) return msg.reply(`You Can't bet **${args[2]}**. `)
    if(args[2] > 100) return msg.reply(`Hey You can't bet more than 100 Poke Dollars!`)
    if( data.val().coins < args[2]) return msg.reply(`Hey you don't have this amount to bet!`)
    
    if(quest.val() != null) {
        if(quest.val().quest_type === 'Coinflip') {
          if(quest.val().user_quest_items + 1 >= quest.val().quest_number) {
            const quest_embed = new discord.MessageEmbed()
            .setColor('GREY')
            .setTitle(`You Completed Your Quest: Play **${quest.val().quest_number}** in Coinflip`)
            .setDescription(`Nice, You have won: **${quest.val().quest_reward}** <:coins:718800872058126347>`)
            .setTimestamp()      
            .setImage('https://cdn.glitch.com/e743af71-9ae6-443d-9641-afbff15d710b%2Ftreasure02.gif?v=1591553774616')
            msg.reply(quest_embed)
            database.ref(`Users/${msg.author.id}`).update({
              coins:data.val().coins + quest.val().quest_reward
            })
            database.ref(`Users/${msg.author.id}/Quest`).remove()
          }else {
            database.ref(`Users/${msg.author.id}/Quest`).update({ 
              user_quest_items:quest.val().user_quest_items + 1,
            })
            const quest_embed = new discord.MessageEmbed()
            .setColor('GREY')
            .setTitle(`Quest: **${quest.val().user_quest_items + 1}/${quest.val().quest_number}** Coinflip Played`)
            .setDescription(`Almost there,continue playing coinflip!`)
            .setTimestamp()      
            msg.reply(quest_embed)
          }
        }
      }     

    if (coinflip()) {
        database.ref(`Users/${msg.author.id}`).update({
            coins:data.val().coins + args[2] * 2
        })        
        message = `You Won **${ parseInt(args[2] * 2)}** Poke Dollars`
      } else {
        database.ref(`Users/${msg.author.id}`).update({
            coins:data.val().coins - args[2]
        })
        message = `You Lost **${args[2] }** Poke Dollars`
      }

      const shop = new discord.MessageEmbed()
      .setColor('GREEN')
      .setAuthor(msg.author.username, msg.author.displayAvatarURL())
      .setTitle(`Rocket Casino - Coinflip`)
      .setDescription(`  
      ${message} <:coins:718800872058126347> `)
      .setTimestamp()
      msg.reply(shop)        
}
if(args[1] === "roulette") {
    var possibles = ['even','odd']
    if(!args[2]) return msg.reply(`Hey you need to choose between **even** or **odd**`)
    if(!possibles.includes(args[2])) return msg.reply(`Hey you need to choose between **even** or **odd**`)
    if(!args[3]) return msg.reply(`Hey send me how much you want o bet!`)

    if (isNaN(args[3]))return msg.reply(`Hey this must be a number!`)
        if(args[3] > data.val().coins) return msg.reply(`You Can't bet **${args[3]}**. `)
    if(args[3] > 100) return msg.reply(`Hey You can't bet more than 100 Poke Dollars!`)
    if( data.val().coins < args[3]) return msg.reply(`Hey you don't have this amount to bet!`)
    
    
    if(quest.val() != null) {
        if(quest.val().quest_type === 'Roulette') {
          if(quest.val().user_quest_items + 1 >= quest.val().quest_number) {
            const quest_embed = new discord.MessageEmbed()
            .setColor('GREY')
            .setTitle(`You Completed Your Quest: Play **${quest.val().quest_number}** in Roulette`)
            .setDescription(`Nice, You have won: **${quest.val().quest_reward}** <:coins:718800872058126347>`)
            .setTimestamp()      
            .setImage('https://cdn.glitch.com/e743af71-9ae6-443d-9641-afbff15d710b%2Ftreasure02.gif?v=1591553774616')
            msg.reply(quest_embed)
            database.ref(`Users/${msg.author.id}`).update({
              coins:data.val().coins + quest.val().quest_reward
            })
            database.ref(`Users/${msg.author.id}/Quest`).remove()
          }else {
            database.ref(`Users/${msg.author.id}/Quest`).update({ 
              user_quest_items:quest.val().user_quest_items + 1,
            })
            const quest_embed = new discord.MessageEmbed()
            .setColor('GREY')
            .setTitle(`Quest: **${quest.val().user_quest_items + 1}/${quest.val().quest_number}** Roulette Played`)
            .setDescription(`Almost there,continue playing Roulette!`)
            .setTimestamp()      
            msg.reply(quest_embed)
          }
        }
      }  
    
    var fitnesses = [
        {name:"even", val:args[3]},
        {name:"odd", val:args[3]},
    ]
     
    //optionally pass in precision for decimal fitness values
    var rw = new RouletteWheel({fitnesses:fitnesses, precision:3})
     var result =  rw.spin()

     if (result.target.name === args[2]) {
        database.ref(`Users/${msg.author.id}`).update({
            coins:data.val().coins + args[3] * 2
        })        
        message = `You Won **${ parseInt(args[3] * 2)}** Poke Dollars`
      } else {
        database.ref(`Users/${msg.author.id}`).update({
            coins:data.val().coins - args[3]
        })
        message = `You Lost **${args[3]}** Poke Dollars`
      }   
    //returns the selected individual and the index in your original fitness array
    //ex: { index: 0, target: { name: 'a', val: 100 } }

      const shop = new discord.MessageEmbed()
      .setColor('GREEN')
      .setAuthor(msg.author.username, msg.author.displayAvatarURL())
      .setTitle(`Rocket Casino - Roulette`)
      .setDescription(`Rolled **${ capitalize(result.target.name)}**
      ${message} <:coins:718800872058126347> `)
      .setTimestamp()
      msg.reply(shop)        
}
})
};

module.exports.config = {
  name: "casino",
  permission: "EveryOne",
  description: "Use the cassino",
  usage: "p!cassino",
  aliases: []
}