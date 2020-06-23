const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
var Pokedex = require('pokedex'),
    pokedex = new Pokedex();
module.exports.run = async (bot,msg, args, prefix,database) => {
  if(!args[1]) {
    var is_new = await  database.ref(`Users/${msg.author.id}`).once("value")
    if(is_new.val() === null) return msg.reply("So you are new,huh? Start now with `p!start`")

    database.ref(`Users/${msg.author.id}/pokedex`).orderByChild("pokemon_attack").limitToFirst(10).once("value",function(data) {
      if(data.val() === null) return msg.reply(`You don't have any pokemon on your pokedex!`)
        var descri = ""
        data.forEach(function(poke) { 
          descri+= `\`\`\` ${poke.val().pokemon}  | [Level ${poke.val().pokemon_level}] | ID: (${poke.val().pokemon_id}) \`\`\` `
        })
        const exampleEmbed = new discord.MessageEmbed()
        .setColor('grey')
          .setTitle(`${msg.author.username} Pokémon / Showing 10 pokémon!!`)
          .setDescription(`${descri}

          Want to see their stats? Use: **p!pokemon stats <id>**`)
        .setTimestamp()
      
      msg.reply(exampleEmbed) 
      })
  }else {
    if(args[1] === "stats") {
      if(!args[2]) return msg.reply(`Hey you need to specify the id of the pokémon!`)
      database.ref(`Users/${msg.author.id}/pokedex/${args[2]}`).once("value",function(data) {
        if(data.val() === null) return msg.reply(`Pokémon not found!`)
        var ability = ""
        for(let i in data.val().pokemon_ability) {
            ability += `-> ${data.val().pokemon_ability[i].name} (${data.val().pokemon_ability[i].hidden}) \n`
        }    
        const marketplace = new discord.MessageEmbed()
    
        .setColor('Green')
        .setTitle(`***${data.val().pokemon}*** (lvl ${data.val().pokemon_level}) Overview`)
        .setDescription(`Health: **${data.val().pokemon_health}**,
        Attack: **${data.val().pokemon_attack}**,
        Defense: **${data.val().pokemon_defence}**,
        Ability: 
        **${ability}**
        `)
        .setTimestamp()      
        .setImage(data.val().pokemon_sprite)

        msg.channel.send(marketplace)          
      })
    }
  }

};

module.exports.config = {
  name: "pokemon",
  permission: "EveryOne",
  description: "See your pokemons",
  usage: "p!pokemons",
  aliases: []
}