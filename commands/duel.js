const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
var Pokedex2 = require('pokedex-promise-v2');
var P = new Pokedex2();
const pokeRand = require('pokemon-randomizer');
var ab = require('poke-types')
module.exports.run = async (bot,msg, args, prefix,database) => {
  if(!args[1]) return msg.reply(`**Usage:**\`\`${prefix}duel battle <@user> || ${prefix}duel accept <user id> || ${prefix}duel attack normal ||${prefix}duel item   \`\`\n`)
  const user = msg.mentions.users.first();
  if(args[1] === "battle") {
    if(!user) return msg.reply(`**Usage:**\`\`${prefix}duel battle <@user>\`\`\n`)

    is_valid_user = await database.ref(`Users/${user.id}/`).once("value")
    if(is_valid_user.val() === null) return msg.reply(`\`\`Invalid user!\`\`\n`)
    var my_team = await  database.ref(`Users/${msg.author.id}/team`).once("value")
    var opponent_team = await database.ref(`Users/${user.id}/team`).once("value")
    var Opponent_can_duel = await database.ref(`Duels/`).orderByChild("opponent").equalTo(`${msg.author.username}`).once("value")
    if(opponent_team.val() === null) return msg.reply(`\`\`This user don't have a team yet!\`\`\n`)
    if(my_team.val() === null) return msg.reply(`**You did not set a team yet**!\`\`${prefix}setteam <index (1,2,3)> <pokémon id>\`\`\n`)
    if(Opponent_can_duel.val() != null)  {
      if(Opponent_can_duel.val().isOn === true) return msg.reply(`\`\`You already on a duel with ${data.val().challenger} \`\`\n`)
    }
  
  database.ref(`Duels/${msg.author.id}`).once("value",function(data) {
    if(data.val()  != null) return msg.reply(`\`\`You already on a duel with ${data.val().opponent} \`\`\n`)
    database.ref(`Duels/${msg.author.id}`).update({
      opponent:user.id,
      name:msg.author.username,
      challenger:msg.author.id,
      team:my_team.val(),
      isOn:false,
    })
  })
  const exampleEmbed = new discord.MessageEmbed()
  .setColor('#ff0000')
    .setTitle(`Duel Created ***${msg.author.username}*** X ***${user.username}***`)
    .setDescription(`
    \`\`\`Opponent must do ${prefix}duel accept <Challenger id>\`\`\`
    `)
.setTimestamp() 
msg.channel.send(exampleEmbed)
  }
if(args[1] === "accept") {
  var Opponent_can_duel = await database.ref(`Duels/${args[2]}`).once("value")
  var opponent_team = await database.ref(`Users/${msg.author.id}/team`).once("value")
  var my_team = await  database.ref(`Users/${msg.author.id}/team/1`).once("value")
  var opponent_team_1 = await database.ref(`Users/${args[2]}/team/1`).once("value")
  if(Opponent_can_duel.val() === null) return msg.reply(`\`\`Invalid Duel!\`\`\n`)
  if(Opponent_can_duel.val().opponent != msg.author.id) return msg.reply(`\`\`You weren't invited in this duel!\`\`\n`)

  if(!args[2]) return msg.reply(`**Usage:**\`\`${prefix}duel accept <Challenger id>\`\`\n`)
  if(Opponent_can_duel.val().isOn === true) return msg.reply(`\`\`You are on a battle already! \`\`\n`)
  database.ref(`Duels/${msg.author.id}`).update({
    opponent:args[2],
    name:msg.author.username,
    challenger:msg.author.id,
    team:opponent_team.val(),
    isOn:true,
  }) 
  database.ref(`Duels/${args[2]}`).update({
    isOn:true,
  })  
  database.ref(`Duels/${args[2]}`).update({
round:true, 
  })   
  database.ref(`Duels/${msg.author.id}`).update({
    round:false, 
      }) 
  const exampleEmbed = new discord.MessageEmbed()
  .setColor('GREEN')
    .setTitle(`Battle Starting ***${msg.author.username}*** X ***${Opponent_can_duel.val().name}***`)
    .setDescription(`**It's ${Opponent_can_duel.val().name}'s Round** 
    \`\`\`${my_team.val().pokemon} X ${opponent_team_1.val().pokemon} \`\`\`
    `)
.setTimestamp() 
msg.channel.send(exampleEmbed)

}
if(args[1] ==="item") {
  database.ref(`Duels/${msg.author.id}`).once("value",async function(data) {
    if(data.val() === null) return msg.reply(`\`\`You aren't on a battle yet! \`\`\n`)
    if(data.val().round === false) return msg.reply(`\`\This isn't your round to attack \`\`\n`)
if(!args[2]) {
  database.ref(`Users/${msg.author.id}/Inventory/items`).once("value",function(data) {
    var item = ""
    if(data.val() === null) {
      item = "No Item in your inventory!"
    }else {
      for (let i in data.val()) {
        item += `\`\`\`${data.val()[i].name}: Restore:${data.val()[i].restore}% \n \`\`\``
      } 
    }

    

  const exampleEmbed = new discord.MessageEmbed()
  .setColor('GREEN')
    .setTitle(` ***${msg.author.username}'s*** Inventory Item`)
    .setDescription(`**Item:** ${item}
    `)
.setTimestamp() 
msg.reply(exampleEmbed)
  })
}

if(args[2]=== "use") {
  database.ref(`Duels/${data.val().opponent}`).update({
    round:true, 
      })   
      database.ref(`Duels/${msg.author.id}`).update({
        round:false, 
          })   
  if(!args[3]) return msg.reply(`You need to say which item you want to use!`)
  database.ref(`Users/${msg.author.id}/Inventory/items/${args[3]}`).once("value",function(data) { 
    if(data.val() === null) msg.reply(`No such Item found in your inventory!`)
    if(data.val().amount <= 0) return msg.reply(`You are out of stock of this item!`)
    if(!args[4]) return msg.reply(`You need to send me which pokémon you want to use this item!`)
    database.ref(`Duels/${msg.author.id}/team/${args[4]}`).once("value",function(poke) {
      if(poke.val() === null) return msg.reply(`Not a valid index!`)
      if(poke.val().pokemon_health >= poke.val().pokemon_health_full) return msg.reply(`You can only use this item on a pokémon with less than it's normal health!`)
      database.ref(`Duels/${msg.author.id}/team/${args[4]}`).update({
        pokemon_health:poke.val().pokemon_health + (poke.val().pokemon_health_full * (data.val().restore / 100))
      })
      const exampleEmbed = new discord.MessageEmbed()
      .setColor('GREEN')
        .setTitle(` ***${msg.author.username}*** Used a ***${args[3]}*** on ***${poke.val().pokemon}***`)
        .setDescription(`This Item Restores **${data.val().restore}%** of the Pokémon HP
        \`\`\`${poke.val().pokemon_health} ---> ${poke.val().pokemon_health + (poke.val().pokemon_health_full * (data.val().restore / 100))} \`\`\`
        `)
    .setTimestamp() 
    msg.channel.send(exampleEmbed)      
    })

  })
}    
})
}
if(args[1] === "attack") {


  database.ref(`Duels/${msg.author.id}`).once("value",async function(data) {
    if(data.val() === null) return msg.reply(`\`\`You aren't on a battle yet! \`\`\n`)
    if(data.val().round === false) return msg.reply(`\`\This isn't your round to attack \`\`\n`)
    var index = 1
    var pokemon = await database.ref(`Duels/${msg.author.id}/team/${index}`).once("value")
    if(pokemon.val().pokemon_health <= 0) {
      index++
      pokemon = await database.ref(`Duels/${msg.author.id}/team/${index}`).once("value")
      if(pokemon.val().pokemon_health <= 0) {
        index++
        pokemon = await database.ref(`Duels/${msg.author.id}/team/${index}`).once("value")
      }      
    }   
    var abilidades = ""
    var abilidade_index = 0
    for(let i in pokemon.val().pokemon_ability) {
      abilidade_index++
       abilidades += `\`\`\`[${abilidade_index}] ${pokemon.val().pokemon_ability[i].name}\`\`\``
    }
    const Attacks = new discord.MessageEmbed()
    .setColor('#ff0000')
      .setTitle(`Choose your attack ${pokemon.val().pokemon}`)
      .setDescription(`You can use a normal attack: (${prefix}duel attack normal) or you can choose the an ability:
      ${abilidades}
      Use: ${prefix}duel attack ability (index(0,1,2,3....)) ---> Under DEV!
      `)
  .setTimestamp()  
  if(!args[2]) return msg.reply(Attacks)
if(args[2]==="normal") {

  var index_normal = 1
  var pokemon_opponent =  await database.ref(`Duels/${data.val().opponent}/team/${index_normal}`).once("value")
  if(pokemon_opponent.val().pokemon_health <= 0) {
    index_normal++
    pokemon_opponent =  await database.ref(`Duels/${data.val().opponent}/team/${index_normal}`).once("value")
    if(pokemon_opponent.val().pokemon_health <= 0) {
      index_normal++
      pokemon_opponent =  await database.ref(`Duels/${data.val().opponent}/team/${index_normal}`).once("value")

    }   
  }
  var damage = pokemon.val().pokemon_attack - Math.floor(Math.random() * pokemon_opponent.val().pokemon_defence) + 1
var op = await database.ref(`Duels/${data.val().opponent}`).once("value")
  database.ref(`Duels/${data.val().opponent}/team/${index_normal}`).once("value",function(opponent) {
    database.ref(`Duels/${data.val().opponent}/team/${index_normal}`).update({
      pokemon_health:opponent.val().pokemon_health - damage,
    })
    const Attacks = new discord.MessageEmbed()
    .setColor('GREY')
      .setTitle(`${pokemon.val().pokemon} Dealt a damage of ${damage} on  ${pokemon_opponent.val().pokemon}`)
      .setDescription(`**It's ${op.val().name} round**
      `)
      .setImage(pokemon.val().pokemon_sprite)  
  .setTimestamp()  
  database.ref(`Duels/${data.val().opponent}`).update({
    round:true, 
      })   
      database.ref(`Duels/${msg.author.id}`).update({
        round:false, 
          })  
 msg.reply(Attacks)    
  if(opponent.val().pokemon_health - damage <= 0) {
    const Died = new discord.MessageEmbed()
    .setColor('#ff0000')
      .setTitle(`${pokemon_opponent.val().pokemon} Died`)
      .setDescription(`
      `)
  .setTimestamp()  
  .setImage(pokemon_opponent.val().pokemon_sprite)  
 msg.channel.send(Died)     
  }
  })
  var won = await  database.ref(`Duels/${data.val().opponent}/team/3`).once("value")
  if(won.val().pokemon !=  pokemon_opponent.val().pokemon) return
  var coins = Math.floor(Math.random() * 500) + 100
  if(won.val().pokemon_health - damage <= 0) {
    const won = new discord.MessageEmbed()
    .setColor('GREEN')
      .setTitle(`${msg.author.username} Won the Duel`)
      .setDescription(`You won **${coins}** Poke Dollars
      `)
      
  .setTimestamp()  
  database.ref(`Users/${msg.author.id}`).once("value",function(data2){
    database.ref(`Duels/${msg.author.id}`).remove()
    database.ref(`Duels/${data.val().opponent}`).remove()
    database.ref(`Users/${msg.author.id}`).update({
      coins: data2.val().coins + coins
    })
  })
   return msg.reply(won)  
  }    
}if(args[2]==="ability") {
  return msg.reply(`Still in dev!`)
if(!args[3]) return msg.reply(`You need to send the id of the Movement!`)
  var index_normal = 1
  var pokemon_opponent =  await database.ref(`Duels/${data.val().opponent}/team/${index_normal}`).once("value")
  if(pokemon_opponent.val().pokemon_health <= 0) {
    index_normal++
    pokemon_opponent =  await database.ref(`Duels/${data.val().opponent}/team/${index_normal}`).once("value")
    if(pokemon_opponent.val().pokemon_health <= 0) {
      index_normal++
      pokemon_opponent =  await database.ref(`Duels/${data.val().opponent}/team/${index_normal}`).once("value")

    }   
  }

  var attack_ability = await database.ref(`Duels/${data.val().opponent}/team/${index_normal}/pokemon_ability/${args[3]}`).once("value")
  if(attack_ability.val() === null) return msg.reply(`This is not a valid Movement!`)
  var movement_damage = 0
  var damage = pokemon.val().pokemon_attack - Math.floor(Math.random() * pokemon_opponent.val().pokemon_defence) + 1
  database.ref(`Duels/${data.val().opponent}/team/${index_normal}`).once("value",function(opponent) {
    console.log(ab.getTypeWeaknesses('grass'))
    database.ref(`Duels/${data.val().opponent}/team/${index_normal}`).update({
      pokemon_health:opponent.val().pokemon_health - damage,
    })
    const Attacks = new discord.MessageEmbed()
    .setColor('GREEN')
      .setTitle(`${pokemon.val().pokemon} Dealt a damage of ${damage} on  ${pokemon_opponent.val().pokemon}`)
      .setDescription(`It's ${data.val().opponent} round
      `)
  .setTimestamp()  
  database.ref(`Duels/${data.val().opponent}`).update({
    round:true, 
      })   
      database.ref(`Duels/${msg.author.id}`).update({
        round:false, 
          })  
 msg.reply(Attacks)    
  if(opponent.val().pokemon_health - damage <= 0) {
    const Died = new discord.MessageEmbed()
    .setColor('#ff0000')
      .setTitle(`${pokemon_opponent.val().pokemon} Died`)
  .setTimestamp()
  .setImage(pokemon_opponent.val().pokemon_sprite)  
 msg.channel.send(Died)     
  }
  })
  var won = await  database.ref(`Duels/${data.val().opponent}/team/3`).once("value")
  if(won.val().pokemon !=  pokemon_opponent.val().pokemon) return
  var coins = Math.floor(Math.random() * 500) + 100
  if(won.val().pokemon_health - damage <= 0) {
    const won = new discord.MessageEmbed()
    .setColor('GREEN')
      .setTitle(`${msg.author.username} Won the Duel`)
      .setDescription(`You won **${coins}** Poke Dollars
      `)
  .setTimestamp()  
  database.ref(`Users/${msg.author.id}`).once("value",function(data2){
    database.ref(`Duels/${msg.author.id}`).remove()
    database.ref(`Duels/${data.val().opponent}`).remove()
    database.ref(`Users/${msg.author.id}`).update({
      coins: data2.val().coins + coins
    })
  })
   return msg.reply(won)  
  }     
}
  })
}
}
module.exports.config = {
  name: "duel",
  permission: "EveryOne",
  description: "duel with someone",
  usage: "p!duel",
  aliases: []
}