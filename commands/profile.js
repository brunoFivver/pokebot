const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
var Pokedex = require('pokedex'),
    pokedex = new Pokedex();
    const capitalize = (s) => {
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    }
module.exports.run = async (bot,msg, args, prefix,database) => {
    const user = msg.mentions.users.first() || msg.author;
    var is_new = await  database.ref(`Users/${msg.author.id}`).once("value")
    if(is_new.val() === null) return msg.reply("So you are new,huh? Start now with `p!start`")
    var main_poke = await database.ref(`Users/${user.id}/main_pokemon`).once("value")
    var pokedex = await database.ref(`Users/${user.id}/pokedex`).once("value")
database.ref(`Users/${user.id}`).once("value",function(data) {
if(data.val() === null) return msg.reply("This User Must be new, tell him to use `p!start`")
var require_xp =  parseInt((main_poke.val().pokemon_level + 1/main_poke.val().pokemon_level) * main_poke.val().pokemon_health +main_poke.val().pokemon_attack *50 )

const exampleEmbed = new discord.MessageEmbed()
.setColor('GREEN')
.setTitle(`***${user.username}*** Profile`)
.setDescription(`
Poke Dollars: **${data.val().coins}** <:coins:718800872058126347> 
Pokedex Length: **${pokedex.numChildren()}**

Gym Badges: **${data.val().Gym_Badges}**
League Trophies: **${data.val().League_Trophies}**
Trophies: **${data.val().League_Trophies}**

Main Pokémon: **${capitalize(main_poke.val().pokemon)}**
Level: **${main_poke.val().pokemon_level}**
Xp: **${main_poke.val().xp}**
Required Xp : **${require_xp}** (${parseInt((main_poke.val().xp/require_xp) * 100)}%)

Health: **${main_poke.val().pokemon_health}**
Attack: **${main_poke.val().pokemon_attack}**
Defense: **${main_poke.val().pokemon_defence}**
Generation: **${main_poke.val().pokemon_generation}**

Item: 
PokeBalls: **${data.val().pokeballs}** <:pokeball:718223690940284969>
GreatBalls: **${data.val().greatballs}** <:greatball:718831043058204722> 
UltraBalls: **${data.val().ultraballs}** <:ultraball:718831353478643853> 
MasterBalls: **${data.val().masterballs}** <:masterball:718831673403506688>

Hold Item:
**None**
`)
.setTimestamp()
.setThumbnail(user.displayAvatarURL())
.setImage(main_poke.val().sprite)
msg.reply(exampleEmbed)
})
};

module.exports.config = {
  name: "profile",
  permission: "EveryOne",
  description: "See profile",
  usage: "p!profile",
  aliases: []
}