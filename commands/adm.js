const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
const cripto = require('crypto-random-string');
var Pokedex2 = require('pokedex-promise-v2');
var P = new Pokedex2();
var Pokedex = require('pokedex'),
    pokedex = new Pokedex();
module.exports.run = async (bot,msg, args, prefix,database) => {
    if(msg.author.id != "597956371027066890" && msg.author.id != "463696108766494730" ) return msg.reply(`Only the owner of the bot can use this cmds!`)
if(!args[1]) {
        const exampleEmbed = new discord.MessageEmbed()
        .setColor('GREEN')
        .setAuthor(msg.author.username, msg.author.displayAvatarURL())
        .setTitle(`${msg.author.username}'s Commands:`)
        .setDescription(`\`\`\`[1] ${prefix}adm money <remove/add> <@user> <amount>\n[2] ${prefix}adm givetrophy <Trophy Name> <@user> <amount>\n[3] ${prefix}adm removetrophy <Trophy Name> <@user> <amount>\n[4] ${prefix}adm givebadge <Badge Name> <@user> <amount>\n[5] ${prefix}adm removebadge <Badge Name> <@user> <amount>\n[6] ${prefix}adm spawnpokemon <Name> <xp> <(public/User ID)> <isShiny(true/false)>  \`\`\`\n  `)
        .setTimestamp()
        .setThumbnail(msg.author.displayAvatarURL())
        
        msg.reply(exampleEmbed)     
}
if(args[1] === "money") {
    if(!args[2]) return msg.reply(`<remove/add>`)
    if(args[2] === "remove") {
        const user = msg.mentions.users.first();
        if(!user) return msg.reply(`<@user>`)
        if(!args[4]) return msg.reply(`Send the amount you want to remove from this user`)
        if (isNaN(args[4]))return msg.reply(`Hey this must be a number!`)
        database.ref(`Users/${user.id}`).once("value",function(data) {
            database.ref(`Users/${user.id}`).update({
                coins: Number(data.val().coins - args[4])
            })
            msg.reply(`You removed **${args[4]}** Poke Dollars from **${user.username}'s Balance**`)
        })
    }
    if(args[2] === "add") {
        const user = msg.mentions.users.first();
        if(!user) return msg.reply(`<@user>`)
        if(!args[4]) return msg.reply(`Send the amount you want to add for this user`)
        if (isNaN(args[4]))return msg.reply(`Hey this must be a number!`)
        database.ref(`Users/${user.id}`).once("value",function(data) {
            database.ref(`Users/${user.id}`).update({
                coins: Number(data.val().coins + parseInt(args[4]))
            })
            msg.reply(`You added **${args[4]}** Poke Dollars to the **${user.username}'s Balance**`)
        })       
    }
}
if(args[1] === "givetrophy") {
    var possible = ['Gym_Badges','League_Trophies']
    if(!args[2]) return msg.reply(`Choose a trophy of ${possible}`)
    if(!possible.includes(args[2])) return msg.reply(`Choose a trophy of ${possible}`)
    const user = msg.mentions.users.first();
    if(!user) return msg.reply(`<@user>`)
    if(!args[4]) return msg.reply(`Send the amount of trophies you want to give for this user`)
    if (isNaN(args[4]))return msg.reply(`Hey this must be a number!`) 
    database.ref(`Users/${user.id}`).once("value",function(data) {
        if(args[2] === "Gym_Badges") {
            if(!data.val().Gym_Badges) {
                database.ref(`Users/${user.id}`).update({
                    Gym_Badges: args[4]
                })                
            }else {
                database.ref(`Users/${user.id}`).update({
                    Gym_Badges: Number(data.val().Gym_Badges + parseInt(args[4]))
                })                     
            }
        }
        if(args[2] === "League_Trophies") {
            if(!data.val().League_Trophies) {
                database.ref(`Users/${user.id}`).update({
                    League_Trophies: args[4]
                })                
            }else {
                database.ref(`Users/${user.id}`).update({
                    League_Trophies: Number(data.val().League_Trophies + parseInt(args[4]))
                })                     
            }
        }                 
        msg.reply(`You added X${args[4]} **${args[2]}** to the **${user.username}'s Trophies**`)
    })         
}
if(args[1] === "removetrophy") {
    var possible = ['League_Trophies']
    if(!args[2]) return msg.reply(`Choose a trophy of ${possible}`)
    if(!possible.includes(args[2])) return msg.reply(`Choose a trophy of ${possible}`)
    const user = msg.mentions.users.first();
    if(!user) return msg.reply(`<@user>`)
    if(!args[4]) return msg.reply(`Send the amount of trophies you want to remove from this user`)
    if (isNaN(args[4]))return msg.reply(`Hey this must be a number!`) 
    database.ref(`Users/${user.id}`).once("value",function(data) {
        if(args[2] === "League_Trophies") {
            if(!data.val().League_Trophies) {
               return  msg.reply(`This is don't have any League_Trophies yet!`)             
            
            }else {
                database.ref(`Users/${user.id}`).update({
                    League_Trophies: Number(data.val().League_Trophies - parseInt(args[4]))
                })                     
            }
        }                 
        msg.reply(`You removed X${args[4]} **${args[2]}** from the  **${user.username}'s Trophies**`)
    })         
}

if(args[1] === "givebadge") {
    var possible = ['Gym_Badges']
    if(!args[2]) return msg.reply(`Choose a badge of ${possible}`)
    if(!possible.includes(args[2])) return msg.reply(`Choose a badge of ${possible}`)
    const user = msg.mentions.users.first();
    if(!user) return msg.reply(`<@user>`)
    if(!args[4]) return msg.reply(`Send the amount of badges you want to give for this user`)
    if (isNaN(args[4]))return msg.reply(`Hey this must be a number!`) 
    database.ref(`Users/${user.id}`).once("value",function(data) {
        if(args[2] === "Gym_Badges") {
            if(!data.val().Gym_Badges) {
                database.ref(`Users/${user.id}`).update({
                    Gym_Badges: args[4]
                })                
            }else {
                database.ref(`Users/${user.id}`).update({
                    Gym_Badges: Number(data.val().Gym_Badges + parseInt(args[4]))
                })                     
            }
        }              
        msg.reply(`You added X${args[4]} **${args[2]}** to the **${user.username}'s badges**`)
    })         
}
if(args[1] === "removebadge") {
    var possible = ['Gym_Badges']
    if(!args[2]) return msg.reply(`Choose a badge of ${possible}`)
    if(!possible.includes(args[2])) return msg.reply(`Choose a badge of ${possible}`)
    const user = msg.mentions.users.first();
    if(!user) return msg.reply(`<@user>`)
    if(!args[4]) return msg.reply(`Send the amount of badges you want to remove from this user`)
    if (isNaN(args[4]))return msg.reply(`Hey this must be a number!`) 
    database.ref(`Users/${user.id}`).once("value",function(data) {
        if(args[2] === "Gym_Badges") {
            if(!data.val().Gym_Badges) {
                return msg.reply(`This is don't have any Gym_Badges yet!`)             
            }else {
                database.ref(`Users/${user.id}`).update({
                    Gym_Badges: Number(data.val().Gym_Badges - parseInt(args[4]))
                })                     
            }
        }            
        msg.reply(`You removed X${args[4]} **${args[2]}** from the  **${user.username}'s badges**`)
    })         
}

if(args[1] === "spawnpokemon") {
    if(!args[2]) return msg.reply(`Usage: **${prefix}adm spawnpokemon <Name> <level> <(public/User ID)> <isShiny(true/false)>**`)
    if(!args[3]) return msg.reply(`Usage: **${prefix}adm spawnpokemon <Name> <level> <(public/User ID)> <isShiny(true/false)>**`)
    if (isNaN(args[3]))return msg.reply(`Hey this must be a number!`)
    var ishiny = ['true','false']

    if(!args[4]) return msg.reply(`Usage: **${prefix}adm spawnpokemon <Name> <level> <(public/User ID)> <isShiny(true/false)>**`)

    if(!args[5]) return msg.reply(`Choose one of **${ishiny}**`)
    if(! ishiny.includes(args[5])) return msg.reply(`Choose one of **${ishiny}**`)

    var pokemon_r = pokedex.pokemon(args[2].toLowerCase())
    var pokemons = JSON.parse(Pokedex_specs.id(pokemon_r.id).get())[0]
    var level = args[3]
    var hash = cripto({length: 10, type: 'numeric'});
   if(pokemon_r === undefined) return msg.reply(`No Pokémon found!`)
    var image = ""
    var name = ""
    if(pokemon_r === undefined) return msg.reply("No Pokémon Appeared! Try again!")
    if(args[5] === "false") {
        name = pokemons.name
        if(!pokemon_r.sprites.animated) {
            image = pokemon_r.sprites.normal
          }else {
            image = pokemon_r.sprites.animated
          }
    }else { 
        name = `${pokemons.name} ★`
        P.getPokemonByName(args[2].toLowerCase()) // with Promise ★
        .then(async function(response) { 
            image = response.sprites.front_shiny
        })     
    }

    var ability = ""
    for(let i in pokemons.ability) {
      ability += `\`\`${pokemons.ability[i].name} (${pokemons.ability[i].hidden})\`\`\n`
    }
    const exampleEmbed = new discord.MessageEmbed()
    .setColor('#ff0000')
      .setTitle(`${msg.author.username} Spawned a ${name} | LVL ${level}`)
      .setDescription(`Type: **${pokemons.type}**
  
      **Ability: **
      **${ability}**
      \`\`\`Health: ${parseInt(pokemons.baseStats.H * 1 + (50 * 1/level))} \nAttack: ${parseInt(pokemons.baseStats.A * 1 + (50 * 1/level))}\nDefense: ${parseInt(pokemons.baseStats.D * 1 + (50 * 1/level))}\nGeneration: ${parseInt(pokemons.generation)}\`\`\`
  
      `)
	.setImage( image)
	.setTimestamp()
if(args[4] === "public") {
    msg.reply(exampleEmbed).then(message => { //718828229707956244

   
      message.react("718223690940284969")
      let filtro2 = (reaction, usuario) =>
      reaction.emoji.id === "718223690940284969" &&
      usuario.id !== "717852794396213328";
     // usuario.id === `${msg.author.id}`;
    const collector2 = message.createReactionCollector(filtro2, { max: 1 });
    collector2.on("collect", async react => { 
        react.users.cache.forEach(user => {
            if (user.id != "717852794396213328") {         
    
                 database.ref(`Users/${user.id}/pokedex/${hash}`).update({
                    pokemon:`${name}`,    
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
                 message.delete()
                 msg.channel.send(`**${user.username}** got a ***${name}*** `)

            }
          });  
         
   
    })
      
  
        
        });  
}else {
    msg.reply(exampleEmbed).then(message => { //718828229707956244
        message.react("718828229707956244")
        let filtro1 = (reaction, usuario) =>
        reaction.emoji.id === "718828229707956244" &&
        usuario.id !== "717852794396213328" && usuario.id ===`${args[4]}`;
       // usuario.id === `${msg.author.id}`;
      const collector = message.createReactionCollector(filtro1, { max: 1 });
      collector.on("collect", async react => { 
        message.delete()
      })
   
      message.react("718223690940284969")
      let filtro2 = (reaction, usuario) =>
      reaction.emoji.id === "718223690940284969" &&
      usuario.id !== "717852794396213328" && usuario.id ===`${args[4]}`;;
     // usuario.id === `${msg.author.id}`;
    const collector2 = message.createReactionCollector(filtro2, { max: 1 });
    collector2.on("collect", async react => { 
        react.users.cache.forEach(user => {
            if (user.id != "717852794396213328") {         
    
                 database.ref(`Users/${args[4]}/pokedex/${hash}`).update({
                    pokemon:`${name}`,    
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
                 message.delete()
                 msg.channel.send(`**${user.username}** got a ***${name}*** `)

            }
          });  
   
    })
      
  
        
        });  
}
 
}

};

module.exports.config = {
  name: "adm",
  permission: "Owner",
  description: "ADMIN Commands",
  usage: "p!adm",
  aliases: []
}