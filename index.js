const pokemon = require('pokemon');
const fs = require("fs");
var firebase = require("firebase");
var xp_cooldown = new Set();
var cron = require('node-cron');

var Legendary= 
[
'Articuno',
'Zapdos',
'Moltres',
'Mewtwo',
'Mew',
'Raikou',
'Entei',
'Suicune',
'Ho-Oh',
'Lugia',
'Celebi',
'Jirachi',
'Manaphy',
'Phione',
'Regirock',
'Regice',
'Registeel',
'Latias',
'Latios',
'Kyogre',
'Groudon',
'Rayquaza',
'Uxie',
'Zekrom',
'Mesprit',
'Azelf',
'Dialga',
'Palkia',
'Arceus',
'Cresselia',
'Darkrai',
'Heatran',
'Regigigas',
'Silvally',
'Solgaleo',
'Lunala',
'Cosmog',
'Cosmoem',
'Necrozma',
'Genesect',
'Volcanion',
'Magearna',
'Diancie',
'Marshadow',
'Zeraora',


]

const config = {
    apiKey: "AIzaSyDv86kzPPzXHlaPP0ziFf4SyvKMx4OVXr4",
    authDomain: "pokebot-5e8ef.firebaseapp.com",
    databaseURL: "https://pokebot-5e8ef.firebaseio.com",
    projectId: "pokebot-5e8ef",
    storageBucket: "pokebot-5e8ef.appspot.com",
    messagingSenderId: "959169116808",
    appId: "1:959169116808:web:73a89b1115cd197e6d3d3d"
};
firebase.initializeApp(config);
const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
const database = firebase.database();
var cdl = require("cloud-list")  
var cloud_client = new cdl("717852794396213328",'074d5876bd04b9d5b30328846aa') 
                
var prefix = "p!"
var pokedex = require('pokedex'),
    pokedex = new pokedex();

const Discord = require('discord.js');

const client = new Discord.Client({ disableEveryone: true });
client.login('NzE3ODUyNzk0Mzk2MjEzMzI4.XvKOow.ICJJBDwExGi2JdKg1spHhbPYOK4');
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.description = new Discord.Collection();
client.usage = new Discord.Collection();
client.permission = new Discord.Collection();
         
  
cloud_client.on("voted", (data) => {
  let channel = client.channels.cache.get("721739940593008721")
  database.ref(`Users/${data.user_id}`).once("value",function(inv) {
      if(inv.val() === null) return     
      database.ref(`Users/${data.user_id}`).update({
         pokeballs: inv.val().pokeballs + 5,
         coins:inv.val().coins + 500,
        })        
    
 
    }).then(function() {
  let guild = client.guilds.cache.get("701459490507325461")
      channel.send(`The User **${data.user_name}** has voted to our bot and Got 7 extra Pokeballs! <:pokeball:718223690940284969> + 500 PokeDollars  <:coins:718800872058126347>  `)
    })
  
})

fs.readdir("./commands/", (err, files) => {
    if (err) {
      console.log(err);
    }
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length === 0) {
      console.log("Couldn't execute files");
    }
    jsfile.forEach((f, i) => {
      console.log(`Command ${f} executed`);
      let pull = require(`./commands/${f}`);
      client.commands.set(pull.config.name, pull);
      pull.config.aliases.forEach(alias => {
        client.aliases.set(alias, pull.config.name);
      });
      client.description.set(pull.config.name);
      client.usage.set(pull.config.name);
      client.permission.set(pull.config.name);
    });
  });

client.on('ready', () => {
  cron.schedule('0 59 23 * * *', () => {
    database.ref(`Users/`).once("value",function(data) {
      data.forEach(function(user) {
        var new_number = Math.floor(Math.random() * 10) + 1
        if(user.val().id != undefined) {

        
        var quests_names =['Buy','Capture']
        var quests = [{
             Capture:{
              type:'Capture',
              number:new_number ,
              reward:(new_number* 100) + 500,
              msg:`You need to capture **${new_number}** Pokémon in order to get **${(new_number* 100) + 500}** <:coins:718800872058126347> `
                },
             Buy:{
             type:'Buy',
             number:new_number,
             reward:(new_number* 100) + 800,
             msg:`You need to buy **${new_number}** Item in the shop in order to get **${(new_number* 100) + 800}** <:coins:718800872058126347> `              
             }, 
             Sell:{
              type:'Sell',
              number:new_number,
              reward:(new_number* 100) + 900,
              msg:`You need to Sell **${new_number}** Pokémon in the marketplace in order to get **${(new_number* 100) + 900}** <:coins:718800872058126347> `              
              },    
             Trade:{
                type:'Trade',
                number:1,
                reward:(new_number* 100) + 900,
                msg:`Trade **${new_number}** Pokémon in order to get **${(new_number* 100) + 900}** <:coins:718800872058126347> `              
                },
               Slots:{
                  type:'Slots',
                  number:new_number,
                  reward:(new_number* 100) + 200,
                  msg:`You need to play **${new_number}** in Sloots in order to get **${(new_number* 100) + 200}** <:coins:718800872058126347> `              
                  },      
                 Coinflip:{
                    type:'Coinflip',
                    number:new_number,
                    reward:(new_number* 100) + 200,
                    msg:`You need to play **${new_number}** in Coinflip in order to get **${(new_number* 100) + 200}** <:coins:718800872058126347> `              
                    },    
                  roulette:{
                      type:'Roulette',
                      number:new_number,
                      reward:(new_number* 100) + 200,
                      msg:`You need to play **${new_number}** in Roulette in order to get **${(new_number* 100) + 200}** <:coins:718800872058126347> `              
                      },                                                                            
        }]
        var quest = quests[0][`${quests_names[Math.floor(Math.random() * quests_names.length)]}`]
        database.ref(`Users/${user.val().id}/Quest`).update({
          quest_type:quest.type,
          quest_number:quest.number,
          quest_reward:quest.reward,
          quest_msg:quest.msg,
          quest_on:true,
          user_quest_items:0,
        })    
      }
      })
    })
  })
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    var args = msg.content.substring(prefix.length).split(" ");
    let messageArray = msg.content.split(" ");
    let msgcontent = msg.content.substring(prefix.length).slice(" ");
    let cmd = messageArray[0];
    let commandFile =
      client.commands.get(cmd.slice(prefix.length)) ||
      client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
    if (commandFile)  {
      database.ref(`Users/${msg.author.id}`).once("value",function(data) {
        if(data.val() === null) return msg.reply("So you are new,huh? Start now with `p!start`")
        return commandFile.run(client, msg, args, prefix,database,Legendary);
      })
    }
    switch (args[0]) {
      case "help":
        if (!args[1]) {
          let embed = new Discord.MessageEmbed()
          embed.setTitle(`Command Help`);
          embed.setColor("#02f781");
          embed.setDescription(
            `For more information,use : ***${prefix}help*** + "Command name" `
          );
          client.commands.forEach(command => {
            embed.addField(
              `Command: ${command.config.name}`,
              `Permission: ${command.config.permission}`
            );
          });
          msg.channel.send(embed);
        }
        if (args[1]) {
          let command = args[1];
          let embed = new Discord.MessageEmbed()
          embed.setColor("#02f781");
          if (client.commands.has(command)) {
            command = client.commands.get(command);
            embed.setTitle(`Command **${command.config.name}**`);
            embed.setDescription(
              `__Description:__ \n **${command.config.description}**`
            );
            embed.addField(`__Usage:__`, `${command.config.usage} | `, true);
            embed.addField(
              `__Permission:__`,
              ` | ${command.config.permission}`,
              true
            );
          }
          msg.channel.send(embed);
        }
        break;
    }   
    switch(args[0]) {
      case "start":
        const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
        var starter_pokemons= ["Charmander","Bulbasaur","Squirtle"]
        database.ref(`Users/${msg.author.id}/main_pokemon`).once("value",function(data) {  
        
        if(data.val() != null ) return msg.reply(`You already have **${data.val().pokemon}** as main pokémon `)
        if(!args[1]) return msg.reply(`You Need to specify one of this pokémon **${starter_pokemons}**`)
        if(!starter_pokemons.includes(capitalize(args[1]))) return  msg.reply(`You Need to specify one of this pokémon **${starter_pokemons}**`)
        var pokemon_r = pokedex.pokemon(args[1].toLowerCase())
        var image = ""
        if(!pokemon_r.sprites.animated) {
          image = pokemon_r.sprites.normal
        }else {
          image = pokemon_r.sprites.animated
        }
        var pokemons = JSON.parse(Pokedex_specs.id(pokemon_r.id).get())[0]
        database.ref(`Users/${msg.author.id}`).update({
          id:msg.author.id,
          coins:1000,
          location:"Pokeverse",
          Gym_Badges:0,
          League_Trophies:0,
          points:0,
          pokeballs:5,
          greatballs:0,
          ultraballs:0,
          masterballs:0,
        })
        var level = Math.floor(Math.random() * 50) + 1
        var pokemon_r = pokedex.pokemon(args[1].toLowerCase())
        var pokemon = JSON.parse(Pokedex_specs.id(pokemon_r.id).get())[0]
         database.ref(`Users/${msg.author.id}/main_pokemon`).update({
            pokemon:`${args[1].toLowerCase()}`,    
            pokemon_level:5,
            xp: 0,
            sprite:image,
            pokemon_ability:pokemon.ability,
            pokemon_health_full:parseInt(pokemon.baseStats.H),

            pokemon_health:parseInt(pokemon.baseStats.H),
            pokemon_attack:parseInt(pokemon.baseStats.A),
            pokemon_defence:parseInt(pokemon.baseStats.D),
            pokemon_generation:parseInt(pokemon.generation),
         })
         return msg.reply(`**${args[1].toLowerCase()}** was added to your party`)
        })       
        break;
    }
    if(xp_cooldown.has(msg.author.id)) return
    const xp = 100
    database.ref(`Users/${msg.author.id}/main_pokemon`).once("value",function(data) {
      if(data.val() === null) return
      database.ref(`Users/${msg.author.id}/main_pokemon`).update({
        xp:data.val().xp + xp,
      })
      var require_xp =  parseInt((data.val().pokemon_level + 1/data.val().pokemon_level) * data.val().pokemon_health + data.val().pokemon_attack *50 )
      if(data.val().xp >= require_xp) {
        database.ref(`Users/${msg.author.id}/main_pokemon`).update({
          xp:0,
        })
        const xp = new Discord.MessageEmbed()
    
        .setColor('Green')
        .setTitle(`***${data.val().pokemon}*** level up ***${data.val().pokemon_level + 1}***`)
        .setDescription(`Health: **${data.val().pokemon_health} + (5)**
        Attack: **${data.val().pokemon_attack} + (5)**
        Defense: **${data.val().pokemon_defence } + (5)**`)
        .setTimestamp()      
        .setImage(data.val().sprite)
        msg.channel.send(xp)      
        database.ref(`Users/${msg.author.id}/main_pokemon`).update({
          pokemon_level:data.val().pokemon_level +  1,
          pokemon_health_full:data.val().pokemon_health + 5,

          pokemon_health:data.val().pokemon_health + 5,
          pokemon_attack:data.val().pokemon_attack + 5,
          pokemon_defence:data.val().pokemon_defence + 5,
        })
        const evolutions = require('evolutions');
        if(evolutions.exists(data.val().pokemon) === true) {
          var evol = evolutions.getEvolutionChain(data.val().pokemon)
          var index = evol.findIndex(x => x ===data.val().pokemon);
          if(index <= -1) return 
          if(data.val().pokemon_level + 1 >= (index + 1 ) * 20) {
            console.log(evol.length)   
            if(evol.length <= 1) return;    

            
          var poke = pokedex.pokemon(`${evol[index + 1]}`)
          database.ref(`Users/${msg.author.id}/main_pokemon`).update({
            pokemon:`${evol[index + 1]}`,
            pokemon_health_full:data.val().pokemon_health + 5,
            pokemon_level:data.val().pokemon_level +  1,
            pokemon_health:data.val().pokemon_health + 5,
            pokemon_attack:data.val().pokemon_attack + 5,
            pokemon_defence:data.val().pokemon_defence + 5,
            sprite:poke.sprites.animated,
          }) 
          const evolve = new Discord.MessageEmbed() 
          .setColor('Green')
          .setTitle(`<:lvlup2:718800977855250492> ***${data.val().pokemon}*** Evolved to ***${poke.name}***`)
          .setDescription(`Health: **${data.val().pokemon_health + 5} + (5)**
          Attack: **${data.val().pokemon_attack + 5} + (5)**
          Defense: **${data.val().pokemon_defence + 5 } + (5)**`)
          .setTimestamp()      
          .setImage(poke.sprites.animated)
          msg.channel.send(evolve)         
        }          
        }
      }
      
    })
    xp_cooldown.add(msg.author.id)
    setInterval(function(){ 
      xp_cooldown.delete(msg.author.id)
      },  2 *60000);
});

