const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
const cripto = require('crypto-random-string');
var cooldown = new Set()

var Pokedex = require('pokedex'),

    pokedex = new Pokedex();
    var Pokedex2 = require('pokedex-promise-v2');
var P = new Pokedex2();
module.exports.run = async (bot,msg, args, prefix,database) => {
    database.ref(`Users/${msg.author.id}/Equipaments/shovel`).once("value", function(shovel) {
      database.ref(`Users/${msg.author.id}`).once("value",function(data) {
        const pokeballs = new discord.MessageEmbed()
        .setColor('GREY')
        .setTitle(`No more PokeBalls <:pokeball:718223690940284969>`)
        .setDescription(`No More PokeBalls, huh? 
        ***Hey! Want get 5 extra PokeBalls every Day?*** 
        Why not vote for Us:
        [Vote For us here](https://www.cloudlist.xyz/vote/717852794396213328)`)
        .setTimestamp()      
        .setImage('https://cdn.glitch.com/0dfc2d6d-a6cd-47f9-a71f-158739e3c856%2Fsource.gif?v=1591414241734')
        if(data.val().pokeballs <= 0) return msg.reply(pokeballs)       
      if(shovel.val() === null) {
        const dig = new discord.MessageEmbed()
        .setColor('GREY')
        .setTitle(`You don't have a Shovel To dig`)
        .setDescription("`Use p!shop buy equipments shovel 1` In order to get a shovel!")
        .setTimestamp()      
        msg.reply(dig)        
      }else {
        database.ref(`Users/${msg.author.id}/Equipaments/Shovel`).update({
          durability: shovel.val().durability - 10
        })
        if(shovel.val().durability <= 0)  {
           msg.reply("Your shovel broke! Buy a new one from the shop! **p!shop buy equipments**")
           return database.ref(`Users/${msg.author.id}/Equipaments/shovel`).remove()
        }
        P.getTypeByName("rock")
    .then(async function(response) {
        var number = Math.floor(Math.random() * response.pokemon.length) + 1
        var poke = response.pokemon[number]
        if(!poke) return msg.reply("You Digged, but no Pokémon was found! Try again!")
        var pokemon_r = pokedex.pokemon(poke.pokemon.name.toLowerCase())
        var pokemon = JSON.parse(Pokedex_specs.id(pokemon_r.id).get())[0]
        var level = Math.floor(Math.random() * 50) + 1

        var hash = cripto({length: 10, type: 'numeric'});
      if(pokemon === undefined) return msg.reply("You Digged, but no Pokémon was found! Try again!")
        var image = ""
        if(!pokemon_r.sprites.animated) {
          image = pokemon_r.sprites.normal
        }else {
          image = pokemon_r.sprites.animated
        }
        var ability = ""
        for(let i in pokemon.ability) {
            ability += `\`\`${pokemon.ability[i].name} (${pokemon.ability[i].hidden})\`\`\n`
        }
        const exampleEmbed = new discord.MessageEmbed()
      .setColor('#ff0000')
        .setTitle(`You Dig a ${pokemon.name} | LVL ${level}`)
        .setDescription(`Type: **${pokemon.type}**
    
        **Ability: **
        **${ability}**
        \`\`\`Health: ${parseInt(pokemon.baseStats.H * 1 + (50 * 1/level))} \nAttack: ${parseInt(pokemon.baseStats.A * 1 + (50 * 1/level))}\nDefense: ${parseInt(pokemon.baseStats.D * 1 + (50 * 1/level))}\nGeneration: ${parseInt(pokemon.generation)}\`\`\`
        Want to Catch this pokémon? Use:***p!catch ${hash}***

        `)
      .setImage(image)
      .setTimestamp()
     await msg.reply(exampleEmbed).then(function(message) {
      database.ref(`Users/${msg.author.id}/awaitCatch/${hash}`).update({
        pokemon:`${pokemon.name}`,    
        pokemon_id:hash,
        pokemon_level:level,
        pokemon_health_full:parseInt(pokemon.baseStats.H * 1 + (50 * 1/level)),
    
        pokemon_health:parseInt(pokemon.baseStats.H * 1 + (50 * 1/level)),
        pokemon_attack:parseInt(pokemon.baseStats.A * 1 + (50 * 1/level)) ,
        pokemon_defence:parseInt(pokemon.baseStats.D * 1 + (50 * 1/level)),
        pokemon_generation:parseInt(pokemon.generation * 1 + (50 * 1/level)),
        pokemon_type:pokemon.type,
        pokemon_sprite:image,
        pokemon_ability:pokemon.ability
     })    
     message.delete({ timeout: 60000 }).then(async function() {
      var ispoke = await database.ref(`Users/${msg.author.id}/awaitCatch/${hash}`).once("value")
      if(ispoke.val()  === null) return
      database.ref(`Users/${msg.author.id}/awaitCatch/${hash}`).remove()
      msg.reply(`you took too long , the pokemon escaped !`)
     })
    }) //718828229707956244

    
    })
      }
      cooldown.add(msg.author.id)
      setInterval(function(){ 
      cooldown.delete(msg.author.id)
      },  10 *60000);
    })
})
};

module.exports.config = {
  name: "dig",
  permission: "EveryOne",
  description: "Digg",
  usage: "p!digging",
  aliases: []
}