const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
var Pokedex = require('pokedex'),
    pokedex = new Pokedex();
    var Pokedex2 = require('pokedex-promise-v2');
var P = new Pokedex2();
const Pagination = require('discord-paginationembed');


module.exports.run = async (bot,msg, args, prefix,database) => {
    if(!args[1]) {
        P.resource([`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10`,])
        .then(async function(response) {
            var descri = ""
            var ability = ""
          for(let i in response) {
    for(let e in response[i].results) {
    
        var pokemon_r = pokedex.pokemon(response[i].results[e].name.toLowerCase())
        var pokemon = JSON.parse(Pokedex_specs.id(pokemon_r.id).get())[0]
        if(pokemon === null) return
        var IsMine = await database.ref(`Users/${msg.author.id}/pokedex`).orderByChild("pokemon").equalTo(pokemon.name).once("value")
        if(IsMine.val() != null) {
         descri += `\n${pokemon.name} |  Type:${pokemon.type} | Generation:${pokemon.generation} ✅\n`
   
        }else {
         descri += `\n${pokemon.name} |  Type:${pokemon.type} | Generation:${pokemon.generation}\n`

        }     
    }
          }
          var page = 1
          var index = 1
     
          const embeds = [];
     
          for (let i = 1; i <= 5; ++i)
            embeds.push(new discord.MessageEmbed());
           
          const Embeds = new Pagination.Embeds()
            .setArray(embeds)
            .setAuthorizedUsers([msg.author.id])
            .setChannel(msg.channel)
            .setPageIndicator(false)
            .setTitle('Pokeverse National Pokedex')
            .setDescription(`${descri}
            **Type p!pokedex claim to get your rewards!**`)
            .setURL('https://www.pokemon.com/pokedex/')
            .setColor(0xFF00AE)
            // Sets the client's assets to utilise. Available options:
            //  - message: the client's Message object (edits the message instead of sending new one for this instance)
            //  - prompt: custom content for the message sent when prompted to jump to a page
            //      {{user}} is the placeholder for the user mention
            .setClientAssets({ msg, prompt: 'Page plz {{user}}' })
            .setDeleteOnTimeout(true)
            .setDisabledNavigationEmojis(['forward','back','jump'])
            .setFunctionEmojis({
              '◀️': (_, instance) => {
                  var new_index = index - 1
                 var page =  20 *  new_index
                 if(page < 0) return;
                 descri= ""
                var description = instance.array[0].description;
                P.resource([`https://pokeapi.co/api/v2/pokemon/?offset=${page}&limit=10`,])
                .then(async function(response) {
                  for(let i in response) {
            for(let e in response[i].results) {
            //✅
                var pokemon_r = pokedex.pokemon(response[i].results[e].name.toLowerCase())
                var pokemon = JSON.parse(Pokedex_specs.id(pokemon_r.id).get())[0]
                var IsMine = await database.ref(`Users/${msg.author.id}/pokedex`).orderByChild("pokemon").equalTo(pokemon.name).once("value")
                if(IsMine.val() != null) {
                 descri += `\n${pokemon.name} |  Type:${pokemon.type} | Generation:${pokemon.generation} ✅\n`
           
                }else {
                 descri += `\n${pokemon.name} |  Type:${pokemon.type} | Generation:${pokemon.generation}\n`
 
                } 
    
            }
        }
        Embeds.setDescription(`${descri}
        **Type p!pokedex claim to get your rewards!**`)

        Embeds.setTitle(`Pokeverse National Pokedex ${new_index}`)
                  })         
              },
              '▶️': (_, instance) => {
                  index++
                var page = index * 20
               var description = instance.array[0].description;
               descri= ""
                P.resource([`https://pokeapi.co/api/v2/pokemon/?offset=${page}&limit=10`,])
                .then(async function(response) {
                    var descri = ""
                  for(let i in response) {
            for(let e in response[i].results) {
            
                var pokemon_r = pokedex.pokemon(response[i].results[e].name.toLowerCase())
                var pokemon = JSON.parse(Pokedex_specs.id(pokemon_r.id).get())[0]
                var IsMine = await database.ref(`Users/${msg.author.id}/pokedex`).orderByChild("pokemon").equalTo(pokemon.name).once("value")
                if(IsMine.val() != null) {
                 descri += `\n${pokemon.name} |  Type:${pokemon.type} | Generation:${pokemon.generation} ✅\n`
           
                }else {
                 descri += `\n${pokemon.name} |  Type:${pokemon.type} | Generation:${pokemon.generation}\n`
 
                }                
            }
        }
        Embeds.setDescription(`${descri}
        **Type p!pokedex claim to get your rewards!**`)

        Embeds.setTitle(`Pokeverse National Pokedex ${index}`)
                  })               
              }
            })
    
           
          Embeds.build();
          }) 
    }else {
        if (isNaN(args[1]))return msg.reply(`This must be a number!`)
        var page = parseInt(args[1]) * 20
        var descri = ""
        P.resource([`https://pokeapi.co/api/v2/pokemon/?offset=${page}&limit=10`,])
        .then(async function(response) {
          for(let i in response) {
    for(let e in response[i].results) { 
        var pokemon_r = pokedex.pokemon(response[i].results[e].name.toLowerCase())
        var pokemon = JSON.parse(Pokedex_specs.id(pokemon_r.id).get())[0]
        var IsMine = await database.ref(`Users/${msg.author.id}/pokedex`).orderByChild("pokemon").equalTo(pokemon.name).once("value")
        if(IsMine.val() != null) {
         descri += `\n${pokemon.name} |  Type:${pokemon.type} | Generation:${pokemon.generation} ✅\n`
   
        }else {
         descri += `\n${pokemon.name} |  Type:${pokemon.type} | Generation:${pokemon.generation}\n`

        }     }
          }
          const embed = new discord.MessageEmbed()
          .setColor('RED')
          .setTitle(`Pokeverse National Pokedex ${args[1]}`)
          .setDescription(`${descri}
          **Type p!pokedex claim to get your rewards!**`)
          msg.reply(embed)             
        })       

    }
       


};

module.exports.config = {
  name: "pokedex",
  permission: "EveryOne",
  description: "See the pokedex",
  usage: "p!pokedex",
  aliases: []
}