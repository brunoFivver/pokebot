const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
var pokemon = require('pokemon-picker');
var cooldown = new Set()
var Pokedex = require('pokedex'),
    pokedex = new Pokedex();
    const cripto = require('crypto-random-string');
    var Pokedex2 = require('pokedex-promise-v2');
var P = new Pokedex2();
    //shiny pega nos sprites!
module.exports.run = async (bot,msg, args, prefix,database,Legendary) => {
  if(cooldown.has(msg.author.id)) return msg.reply(`Hey You are in a cooldown,you need to wait 24 hours in order to use this command again!`)

    if(!args[1]) return msg.reply(`**Usage:**\`\`${prefix}egg <egg type>\`\`\n`)
database.ref(`Users/${msg.author.id}/Inventory/${args[1]}`).once('value',function(data) {
  
  var user = msg.author
if(data.val() === null) return msg.reply(`\`\`Type of egg not found or you don't have this egg to open!\`\`\n`)
if(data.val().amount <= 0) return msg.reply(`\`\`You are out of ${args[1]}\`\`\n`)
else {
  cooldown.add(msg.author.id)
  setInterval(function(){ 
  cooldown.delete(msg.author.id)
  },  10 *60000); 
  database.ref(`Users/${msg.author.id}/Inventory/${args[1]}`).update({
    amount: data.val().amount - 1
  })
    let option = Math.floor(Math.random() * 100);
    if(args[1] === "Legendary_Egg") {
      var legendary =Legendary[Math.floor(Math.random() * Legendary.length)];
      var image = ""
      P.getPokemonByName(legendary.toLowerCase()) // with Promise
      .then(async function(response) {
        var pokemon_r = pokedex.pokemon(legendary.toLowerCase())
        var pokemons = JSON.parse(Pokedex_specs.id(pokemon_r.id).get())[0]
        if(!pokemons) return
        var level = Math.floor(Math.random() * 50) + 1
        var hash = cripto({length: 10, type: 'numeric'});
        database.ref(`Users/${user.id}/pokedex/${hash}`).update({
          pokemon:`${pokemons.name} ★`,    
          pokemon_id:hash,
          pokemon_level:level,
          pokemon_health_full:parseInt(pokemons.baseStats.H * 1 + (50 * 1/level)),
      
          pokemon_health:parseInt(pokemons.baseStats.H * 1 + (50 * 1/level)),
          pokemon_attack:parseInt(pokemons.baseStats.A * 1 + (50 * 1/level)) ,
          pokemon_defence:parseInt(pokemons.baseStats.D * 1 + (50 * 1/level)),
          pokemon_generation:parseInt(pokemons.generation * 1 + (50 * 1/level)),
          pokemon_type:pokemons.type,
          pokemon_sprite:response.sprites.front_shiny,
          pokemon_ability:pokemons.ability
       })              
       if(pokemon_r === undefined) return msg.reply(`No Pokémon found!`)
        var ability = ""
        for(let i in pokemons.ability) {
          ability += `\`\`${pokemons.ability[i].name} (${pokemons.ability[i].hidden})\`\`\n`
        }
        const exampleEmbed = new discord.MessageEmbed()
        .setColor('#ff0000')
          .setTitle(`A Legendary Pokémon Appeared ${pokemons.name} | LVL ${level}`)
          .setDescription(`Type: **${pokemons.type}**
      
          **Ability: **
          **${ability}**
          \`\`\`Health: ${parseInt(pokemons.baseStats.H * 1 + (50 * 1/level))} \nAttack: ${parseInt(pokemons.baseStats.A * 1 + (50 * 1/level))}\nDefense: ${parseInt(pokemons.baseStats.D * 1 + (50 * 1/level))}\nGeneration: ${parseInt(pokemons.generation)}\`\`\`
      
          `)
        .setImage(response.sprites.front_shiny)
        .setTimestamp()    
        msg.reply(exampleEmbed)  
      })
      .catch(function(error) {
        console.log('There was an ERROR: ', error);
      });      
    }
  if(args[1] === 'Pokemon_Egg') {
    if(option === data.val().legendary_chances) { 
      database.ref(`Users/${msg.author.id}/Inventory/${args[1]}`).update({
        amount: data.val().amount - 1
      })    
var legendary =Legendary[Math.floor(Math.random() * Legendary.length)];
var image = ""
const random = pokemon.randomize() 
P.getPokemonByName(random.name.toLowerCase()) // with Promise
.then(async function(response) {
  var pokemon_r = pokedex.pokemon(random.name.toLowerCase())
  var pokemons = JSON.parse(Pokedex_specs.id(pokemon_r.id).get())[0]
  var level = Math.floor(Math.random() * 50) + 1
  var hash = cripto({length: 10, type: 'numeric'});
  database.ref(`Users/${user.id}/pokedex/${hash}`).update({
    pokemon:`${pokemons.name} ★`,    
    pokemon_id:hash,
    pokemon_level:level,
    pokemon_health_full:parseInt(pokemons.baseStats.H * 1 + (50 * 1/level)),

    pokemon_health:parseInt(pokemons.baseStats.H * 1 + (50 * 1/level)),
    pokemon_attack:parseInt(pokemons.baseStats.A * 1 + (50 * 1/level)) ,
    pokemon_defence:parseInt(pokemons.baseStats.D * 1 + (50 * 1/level)),
    pokemon_generation:parseInt(pokemons.generation * 1 + (50 * 1/level)),
    pokemon_type:pokemons.type,
    pokemon_sprite:response.sprites.front_shiny,
    pokemon_ability:pokemons.ability
 })   
  if(!pokemons) return
  var level = Math.floor(Math.random() * 50) + 1
  var hash = cripto({length: 10, type: 'numeric'});
 if(pokemon_r === undefined) return msg.reply(`No Pokémon found!`)
  var ability = ""
  for(let i in pokemons.ability) {
    ability += `\`\`${pokemons.ability[i].name} (${pokemons.ability[i].hidden})\`\`\n`
  }
  const exampleEmbed = new discord.MessageEmbed()
  .setColor('#ff0000')
    .setTitle(`A Shiny Pokémon Appeared ${pokemons.name} | LVL ${level}`)
    .setDescription(`Type: **${pokemons.type}**

    **Ability: **
    **${ability}**
    \`\`\`Health: ${parseInt(pokemons.baseStats.H * 1 + (50 * 1/level))} \nAttack: ${parseInt(pokemons.baseStats.A * 1 + (50 * 1/level))}\nDefense: ${parseInt(pokemons.baseStats.D * 1 + (50 * 1/level))}\nGeneration: ${parseInt(pokemons.generation)}\`\`\`

    `)
  .setImage(response.sprites.front_shiny)
  .setTimestamp()    
  msg.reply(exampleEmbed)  
})
.catch(function(error) {
  console.log('There was an ERROR: ', error);
});
      
    }else {
      database.ref(`Users/${msg.author.id}/Inventory/${args[1]}`).update({
        amount: data.val().amount - 1
      })    
      const random = pokemon.randomize() 
      var pokemon_r = pokedex.pokemon(random.name.toLowerCase())
      var pokemons = JSON.parse(Pokedex_specs.id(pokemon_r.id).get())[0]
      var level = Math.floor(Math.random() * 50) + 1

     if(pokemon_r === undefined) return msg.reply(`No Pokémon found!`)
      var image = ""
      if(pokemon_r === undefined) return msg.reply("No Pokémon Appeared! Try again!")
      if(!pokemon_r.sprites.animated) {
        image = pokemon_r.sprites.normal
      }else {
        image = pokemon_r.sprites.animated
      }
      
      var ability = ""
      for(let i in pokemons.ability) {
        ability += `\`\`${pokemons.ability[i].name} (${pokemons.ability[i].hidden})\`\`\n`
      }
      var hash = cripto({length: 10, type: 'numeric'});
      var level = Math.floor(Math.random() * 50) + 1
      database.ref(`Users/${user.id}/pokedex/${hash}`).update({
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
      const exampleEmbed = new discord.MessageEmbed()
      .setColor('#ff0000')
        .setTitle(`Pokémon Appeared ${pokemons.name} | LVL ${level}`)
        .setDescription(`Type: **${pokemons.type}**
    
        **Ability: **
        **${ability}**
        \`\`\`Health: ${parseInt(pokemons.baseStats.H * 1 + (50 * 1/level))} \nAttack: ${parseInt(pokemons.baseStats.A * 1 + (50 * 1/level))}\nDefense: ${parseInt(pokemons.baseStats.D * 1 + (50 * 1/level))}\nGeneration: ${parseInt(pokemons.generation)}\`\`\`
    
        `)
    .setImage( image)
    .setTimestamp()
  
  msg.reply(exampleEmbed)
    }

}
if(args[1] === "Shiny_Egg") {
  if(option === data.val().legendary_chances) { 
    database.ref(`Users/${msg.author.id}/Inventory/${args[1]}`).update({
      amount: data.val().amount - 1
    })    
var legendary =Legendary[Math.floor(Math.random() * Legendary.length)];
var image = ""
const random = pokemon.randomize() 
P.getPokemonByName(legendary.toLowerCase()) // with Promise
.then(async function(response) {
var pokemon_r = pokedex.pokemon(legendary.toLowerCase())
var pokemons = JSON.parse(Pokedex_specs.id(pokemon_r.id).get())[0]
if(!pokemons) return
var level = Math.floor(Math.random() * 50) + 1
var hash = cripto({length: 10, type: 'numeric'});

database.ref(`Users/${user.id}/pokedex/${hash}`).update({
  pokemon:`${pokemons.name} ★`,    
  pokemon_id:hash,
  pokemon_level:level,
  pokemon_health_full:parseInt(pokemons.baseStats.H * 1 + (50 * 1/level)),

  pokemon_health:parseInt(pokemons.baseStats.H * 1 + (50 * 1/level)),
  pokemon_attack:parseInt(pokemons.baseStats.A * 1 + (50 * 1/level)) ,
  pokemon_defence:parseInt(pokemons.baseStats.D * 1 + (50 * 1/level)),
  pokemon_generation:parseInt(pokemons.generation * 1 + (50 * 1/level)),
  pokemon_type:pokemons.type,
  pokemon_sprite:response.sprites.front_shiny,
  pokemon_ability:pokemons.ability
})   
if(pokemon_r === undefined) return msg.reply(`No Pokémon found!`)
var ability = ""
for(let i in pokemons.ability) {
  ability += `\`\`${pokemons.ability[i].name} (${pokemons.ability[i].hidden})\`\`\n`
}
const exampleEmbed = new discord.MessageEmbed()
.setColor('#ff0000')
  .setTitle(`A Shiny Pokémon Appeared ${pokemons.name} | LVL ${level}`)
  .setDescription(`Type: **${pokemons.type}**

  **Ability: **
  **${ability}**
  \`\`\`Health: ${parseInt(pokemons.baseStats.H * 1 + (50 * 1/level))} \nAttack: ${parseInt(pokemons.baseStats.A * 1 + (50 * 1/level))}\nDefense: ${parseInt(pokemons.baseStats.D * 1 + (50 * 1/level))}\nGeneration: ${parseInt(pokemons.generation)}\`\`\`

  `)
.setImage(response.sprites.front_shiny)
.setTimestamp()    
msg.reply(exampleEmbed)  
})
.catch(function(error) {
console.log('There was an ERROR: ', error);
});
    
  }else {
    database.ref(`Users/${msg.author.id}/Inventory/${args[1]}`).update({
      amount: data.val().amount - 1
    })    
    const random = pokemon.randomize() 

    var pokemon_r = pokedex.pokemon(random.name.toLowerCase())
    var pokemons = JSON.parse(Pokedex_specs.id(pokemon_r.id).get())[0]
    var ability = ""
    for(let i in pokemons.ability) {
      ability += `\`\`${pokemons.ability[i].name} (${pokemons.ability[i].hidden})\`\`\n`
    }
    P.getPokemonByName(random.name.toLowerCase()) // with Promise

    .then(async function(response) {
      var hash = cripto({length: 10, type: 'numeric'});
      var level = Math.floor(Math.random() * 50) + 1
      database.ref(`Users/${user.id}/pokedex/${hash}`).update({
        pokemon:`${pokemons.name} ★`,    
        pokemon_id:hash,
        pokemon_level:level,
        pokemon_health_full:parseInt(pokemons.baseStats.H * 1 + (50 * 1/level)),
    
        pokemon_health:parseInt(pokemons.baseStats.H * 1 + (50 * 1/level)),
        pokemon_attack:parseInt(pokemons.baseStats.A * 1 + (50 * 1/level)) ,
        pokemon_defence:parseInt(pokemons.baseStats.D * 1 + (50 * 1/level)),
        pokemon_generation:parseInt(pokemons.generation * 1 + (50 * 1/level)),
        pokemon_type:pokemons.type,
        pokemon_sprite:response.sprites.front_shiny,
        pokemon_ability:pokemons.ability
        
     })      
    if(!pokemons) return;
    var level = Math.floor(Math.random() * 50) + 1
    var hash = cripto({length: 10, type: 'numeric'});
   if(pokemon_r === undefined) return msg.reply(`No Pokémon found!`)
    var image = ""
    if(pokemon_r === undefined) return msg.reply("No Pokémon Appeared! Try again!")
    const exampleEmbed = new discord.MessageEmbed()
    .setColor('#ff0000')
      .setTitle(`Pokémon Appeared ${pokemons.name} | LVL ${level}`)
      .setDescription(`Type: **${pokemons.type}**
  
      **Ability: **
      **${ability}**
      \`\`\`Health: ${parseInt(pokemons.baseStats.H * 1 + (50 * 1/level))} \nAttack: ${parseInt(pokemons.baseStats.A * 1 + (50 * 1/level))}\nDefense: ${parseInt(pokemons.baseStats.D * 1 + (50 * 1/level))}\nGeneration: ${parseInt(pokemons.generation)}\`\`\`
  
      `)
  .setImage(response.sprites.front_shiny)
  .setTimestamp()

msg.reply(exampleEmbed)
  })


  }  
}
}
})

};

module.exports.config = {
  name: "egg",
  permission: "EveryOne",
  description: "Open an Egg",
  usage: "p!egg",
  aliases: []
}