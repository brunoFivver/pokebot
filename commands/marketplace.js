const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
var Pokedex = require('pokedex'),
    pokedex = new Pokedex();
module.exports.run = async (bot,msg, args, prefix,database) => {
    var is_new = await  database.ref(`Users/${msg.author.id}`).once("value")
    var quest = await database.ref(`Users/${msg.author.id}/Quest`).once("value")
    if(is_new.val() === null) return msg.reply("So you are new,huh? Start now with `p!start`")
    if(args[1] === "sell") {
    if(!args[2]) return msg.reply(`Hey you need to especify the id of the pokemon!`)
database.ref(`Users/${msg.author.id}/pokedex/${args[2]}`).once("value",function(data) {
if(data.val() === null) return msg.reply(`This Pokemon wasn't found at your pokedex!`)
if(!args[3]) return msg.reply(`Hey you need to especify the ammount that you want to sell this pokemon`)
if (isNaN(args[3])) return msg.channel.send(`This is not a valid integer!`)

if(quest.val() != null) {
    if(quest.val().quest_type === 'Sell') {
      if(quest.val().user_quest_items >= quest.val().quest_number) {
        const quest_embed = new discord.MessageEmbed()
        .setColor('GREY')
        .setTitle(`You Completed Your Quest: You need to Sell **${quest.val().quest_number}** in Marketplace`)
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
        .setTitle(`Quest: **${quest.val().user_quest_items + 1}/${quest.val().quest_number}** Selled Pokémon`)
        .setDescription(`Almost there,continue Selling Pokémon!`)
        .setTimestamp()      
        msg.reply(quest_embed)
      }
    }
  }  

database.ref(`Sells`).once("value",async function(sell) {
    if(sell.val() === null) {
        database.ref(`Sells/1`).update({
            pokemon:`${data.val().pokemon}`,    
            pokemon_id:data.val().pokemon_id,
            index:1,
            pokemon_owner: msg.author.id,
            pokemon_level:data.val().pokemon_level,
            pokemon_health:data.val().pokemon_health,
            pokemon_attack:data.val().pokemon_attack ,
            pokemon_defence:data.val().pokemon_defence,
            pokemon_generation:data.val().pokemon_generation,
            pokemon_ability:data.val(). pokemon_ability,
            pokemon_type:data.val(). pokemon_type,
            pokemon_sprite:data.val().pokemon_sprite,
            price:args[3]
        })
    }else {
       var max = await database.ref(`Sells`).orderByChild("index").limitToLast(1).once("value")
       for(let i in max.val()) {
        database.ref(`Sells/${max.val()[i].index + 1}`).update({
            pokemon:`${data.val().pokemon}`,    
            pokemon_id:data.val().pokemon_id,
            index:max.val()[i].index + 1,
            pokemon_owner: msg.author.id,
            pokemon_level:data.val().pokemon_level,
            pokemon_health:data.val().pokemon_health,
            pokemon_attack:data.val().pokemon_attack ,
            pokemon_defence:data.val().pokemon_defence,
            pokemon_generation:data.val().pokemon_generation,
            pokemon_ability:data.val(). pokemon_ability,
            pokemon_type:data.val(). pokemon_type,
            pokemon_sprite:data.val().pokemon_sprite,
            price:args[3]
        })         
       }

    }
})

database.ref(`Users/${msg.author.id}/pokedex/${args[2]}`).remove()
msg.reply(`You added **${data.val().pokemon}** **(lvl: ${data.val().pokemon_level})** to the market Place.`)
})
}
if(args[1] === "buy") {
    if(!args[2]) {
        var shop = await database.ref(`Sells`).orderByChild("index").limitToLast(5).once("value")
        var descri = ""
        for(let i in shop.val()) {
            descri += `**[${shop.val()[i].index}]** ***${shop.val()[i].pokemon}*** **(lvl ${shop.val()[i].pokemon_level})** __[${shop.val()[i].price} coins]__ \n`
        }
        const exampleEmbed = new discord.MessageEmbed()
        .setColor('Green')
        .setTitle(`Pokémon Shop`)
        .setDescription(`${descri}  
        Want to see the pokémon stats? Use: **p!marketplace stats <index>**`)
        .setTimestamp()
        msg.channel.send(exampleEmbed)
    }else {
        var pokemon = await database.ref(`Sells/${args[2]}`).once("value")
        if(pokemon.val() === null) return msg.reply(`No bot found`)
        if(pokemon.val().pokemon_owner === msg.author.id) return msg.reply(`You can't buy your pokémon! 
        Want to remove it? Use: **p!marketplace remove <index>**`)
        database.ref(`Users/${msg.author.id}`).once("value",function(data) {
            if(data.val().coins < pokemon.val().price) return msg.reply(`Hey You don't have this ammount of coins!`)
            database.ref(`Sells/${args[2]}`).remove()
            database.ref(`Users/${msg.author.id}/pokedex/${pokemon.val().pokemon_id}`).update({
                pokemon:`${pokemon.val().pokemon}`,    
                pokemon_id:pokemon.val().pokemon_id,
                pokemon_level:pokemon.val().pokemon_level,
                pokemon_health_full:pokemon.val().pokemon_health,

                pokemon_health:pokemon.val().pokemon_health,
                pokemon_attack:pokemon.val().pokemon_attack ,
                pokemon_defence:pokemon.val().pokemon_defence,
                pokemon_generation:pokemon.val().pokemon_generation,
                pokemon_ability:pokemon.val(). pokemon_ability,
                pokemon_type:pokemon.val(). pokemon_type,
                pokemon_sprite:pokemon.val().pokemon_sprite,               
            })
            database.ref(`Users/${msg.author.id}`).update({
                coins:data.val().coins -  pokemon.val().price
            })
            return msg.reply(`You Bought **${pokemon.val().pokemon}** for ***${pokemon.val().price} coins***`)

        })
    }
}
if(args[1] === "stats") {
   var isOn = await database.ref(`Sells`).once("value")
   if(isOn.val() === null) return msg.reply(`No pokémon in the marketplace`)
   else {
       if(!args[2]) return msg.reply(`hey you need to specify the index of the pokémon!`)
       database.ref(`Sells/${args[2]}`).once("value",function(data) {
           if(data.val() === null) return msg.reply(`no pokémon found`)
           var ability = ""
           for(let i in data.val().pokemon_ability) {
               ability += `-> ${data.val().pokemon_ability[i].name} (${data.val().pokemon_ability[i].hidden}) \n`
           }          
           const marketplace = new discord.MessageEmbed()
           .setColor('Green')
           .setTitle(`Pokémon OverView | ***${data.val().pokemon}*** ***(lvl ${data.val().pokemon_level})***`)
           .setDescription(`Type: **${data.val().pokemon_type}**,
           Health: **${data.val().pokemon_health}**,
           Attack: **${data.val().pokemon_attack}**,
           Defense: **${data.val().pokemon_defence}**,
           Ability: **${ability}**
           Want to buy this Pokémon ? Use: **p!marketplace buy <index>** `)
           .setTimestamp()
           .setImage(data.val().pokemon_sprite)
           msg.channel.send(marketplace)
       })
       
   }
}
if(args[1] === "remove") {
    var isOn = await database.ref(`Sells`).orderByChild("pokemon_owner").once("value")
    if(!args[2]) {
    if(isOn.numChildren() <= 0) return msg.reply(`You Dind't add a pokémon to the marketplace!`)
    var descrip = ""
    for(let i in isOn.val()) {
        descrip += `[index: ${isOn.val()[i].index}] ***${isOn.val()[i].pokemon}*** (lvl ${isOn.val()[i].pokemon_level}) \n`
    }
    const marketplace = new discord.MessageEmbed()
    
    .setColor('Green')
    .setTitle(`Your Marketplace Pokémon`)
    .setDescription(`${descrip}
    Want to remove a Pokémon from the marketplace? Use: **p!marketplace remove <index>**`)
    .setTimestamp()      
    msg.channel.send(marketplace)   
}else {
    database.ref(`Sells/${args[2]}`).once("value",function(data) {
        if(data.val() === null) return msg.reply(`Pokémon Not found!`)
        if(data.val().pokemon_owner != msg.author.id) return msg.reply(`This is not your Pokémon!`)
        database.ref(`Sells/${args[2]}`).remove()
        database.ref(`Users/${msg.author.id}/pokedex/${data.val().pokemon_id}`).update({
            pokemon:`${data.val().pokemon}`,    
            pokemon_id:data.val().pokemon_id,
            pokemon_health_full:data.val().pokemon_health,
            pokemon_level:data.val().pokemon_level,
            pokemon_health:data.val().pokemon_health,
            pokemon_attack:data.val().pokemon_attack ,
            pokemon_defence:data.val().pokemon_defence,
            pokemon_generation:data.val().pokemon_generation,
            pokemon_ability:data.val(). pokemon_ability,
            pokemon_type:data.val(). pokemon_type,
            pokemon_sprite:data.val().pokemon_sprite,               
        })       
        msg.reply(`Pokémon **${data.val().pokemon}** removed from the marketplace!`)
    })
}
}
};

module.exports.config = {
  name: "marketplace",
  permission: "EveryOne",
  description: "marketplace Commands",
  usage: "p!marketplace",
  aliases: []
}