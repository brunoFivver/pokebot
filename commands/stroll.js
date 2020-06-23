const discord = require("discord.js");
var firebase = require("firebase");
var pokemon = require('pokemon-picker');
const cripto = require('crypto-random-string');
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
var Pokedex = require('pokedex'),
    pokedex = new Pokedex();
var cooldown = new Set()
pokedex = new Pokedex();
const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
module.exports.run = async (bot,msg, args, prefix,database,Legendary) => {
  const random = pokemon.randomize() 
   
  var pokemon_r = pokedex.pokemon(random.name.toLowerCase())
  var pokemons = JSON.parse(Pokedex_specs.id(pokemon_r.id).get())[0]
  var level = Math.floor(Math.random() * 50) + 1
  var hash = cripto({length: 10, type: 'numeric'});
  var ispoke = await database.ref(`Users/${msg.author.id}/awaitCatch/${hash}`).once("value")
    if(cooldown.has(msg.author.id)) return msg.reply(`Hey You are in a cooldown,you need to wait 2 minutes in order to use this command again!`)
    database.ref(`Users/${msg.author.id}`).once("value", function(data) {
      if(data.val() === null) return msg.reply("So you are new,huh? Start now with `p!start`")
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
      if(Legendary.includes(capitalize(random.name))) return msg.reply("No Pokémon Appeared! Try again!")


    var image = ""
    if(pokemon_r === undefined) return msg.reply("No Pokémon Appeared! Try again!")
    if(!pokemon_r) return msg.reply("No Pokémon Appeared! Try again!")
    if(!pokemon_r.sprites) return msg.reply("No Pokémon Appeared! Try again!")
    if(!pokemon_r.sprites.animated) {
      image = pokemon_r.sprites.normal
    }else {
      image = pokemon_r.sprites.animated
    }
    var ability = ""
    for(let i in pokemons.ability) {
      ability += `\`\`${pokemons.ability[i].name} (${pokemons.ability[i].hidden})\`\`\n`
    }
    const exampleEmbed = new discord.MessageEmbed()
    .setColor('#ff0000')
      .setTitle(`A wil Pokémon Appeard ${pokemons.name} | LVL ${level}`)
      .setDescription(`Type: **${pokemons.type}**
  
      **Ability: **
      **${ability}**
      \`\`\`Health: ${parseInt(pokemons.baseStats.H * 1 + (50 * 1/level))} \nAttack: ${parseInt(pokemons.baseStats.A * 1 + (50 * 1/level))}\nDefense: ${parseInt(pokemons.baseStats.D * 1 + (50 * 1/level))}\nGeneration: ${parseInt(pokemons.generation)}\`\`\`
    Want to Catch this pokémon? Use:***p!catch ${hash}***
      `)
	.setImage( image)
	.setTimestamp()
msg.reply(exampleEmbed).then(function(message) {
  database.ref(`Users/${msg.author.id}/awaitCatch/${hash}`).update({
    pokemon:`${pokemons.name}`,    
    pokemon_id:hash,
    pokemon_level:level,
    pokemon_health_full:parseInt(pokemons.baseStats.H * 1 + (50 * 1/level)),

    pokemon_health:parseInt(pokemons.baseStats.H * 1 + (50 * 1/level)),
    pokemon_attack:parseInt(pokemons.baseStats.A * 1 + (50 * 1/level)) ,
    pokemon_defence:parseInt(pokemons.baseStats.D * 1 + (50 * 1/level)),
    pokemon_generation:parseInt(pokemons.generation * 1 + (50 * 1/level)),
    pokemon_type:pokemons.type,
    pokemon_sprite:image,
    pokemon_ability:pokemons.ability
 })    
 message.delete({ timeout: 60000 }).then(async function() {
  
  if(ispoke.val()  === null) return
 await database.ref(`Users/${msg.author.id}/awaitCatch/${hash}`).remove()
 await msg.reply(`you took too long , the pokemon escaped !`)
 })
}) //718828229707956244







     
cooldown.add(msg.author.id)
setInterval(function(){ 
cooldown.delete(msg.author.id)
},  2 *60000);




// MYSTIC ISLAND!


})
}

module.exports.config = {
  name: "stroll",
  permission: "EveryOne",
  description: "Search for a random Pokemon",
  usage: "p!start",
  aliases: []
}