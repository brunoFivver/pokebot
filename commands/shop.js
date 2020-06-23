const discord = require("discord.js");
var firebase = require("firebase");
const specs = require('pokedex.js')
const Pokedex_specs = new  specs('en')
var Pokedex = require('pokedex'),
    pokedex = new Pokedex();
var shop_items = [{
    balls: {
        pokeball:{
            name:"pokeball",
            price:100,
        },
    },
    equipments: {
        shovel: {
            name:'shovel',
            price:1000,
        },
    fishing_rod: {
        name:'fishing_rod',
        price:1000,
    }
    },
    item: {
        potion: {
            name:'potion',
            price:1000,
            restore:10,
        },
        super_potion: {
            name:'super_potion',
            price:5000,
            restore:30,
        },
        hyper_potion: {
            name:'hyper_potion',
            price:10000,
            restore:60,
        },
        full_restore: {
            name:'full_restore',
            price:20000,
            restore:100,
        },               
    },    
    pokemoneggs: {
        pokemonegg: {
            name:'pokemonegg',
            price:10000,     
            chances_legendary:1,
        },
        shinyegg: {
                name:'shinyegg',
                price:100000,    
                chances_legendary:1,      
        
        },
        legendaryegg : {
                name:'legendaryegg',
                price:500000,  
                chances_legendary:100,     
        }, 
    },
       
}]
module.exports.run = async (bot,msg, args, prefix,database) => {
    var quest = await database.ref(`Users/${msg.author.id}/Quest`).once("value")

    var shop_category = ['balls','equipments','pokemoneggs','item']

database.ref(`Users/${msg.author.id}`).once("value",function(data) {
    if(!args[1]) {
        msg.reply(`use p!shop buy [**${shop_category}**] to see what the shop is selling!`)       
    }
    if(args[1]==="buy") {
        if(!args[2]) return msg.reply(`You need to say the category: ***${shop_category}***`)
        if(!shop_items[0][args[2]]) return msg.reply(`This Is not a Valid Category,use one of:  ***${shop_category}***`)
        if(!args[3]) {
            var descri= ""
            for(let i in shop_items[0][args[2]]) {
                descri+=`\`\`\`${shop_items[0][args[2]][i].name}: \nPrice:(${shop_items[0][args[2]][i].price})\`\`\`` 
            }
            const shop = new discord.MessageEmbed()
            .setColor('GREEN')
            .setAuthor(msg.author.username, msg.author.displayAvatarURL())
            .setTitle(`${args[2]} Item Shop`)
            .setDescription(`${descri}           
            Want to Buy ${args[2]}? Use:
            ***p!shop buy ${args[2]} <item name> <amount>***`)
            .setTimestamp()
            msg.reply(shop)              
        }else {
            if(!args[4]) return msg.reply(`hey you need to send the amount that you want to buy!`)
            if (isNaN(args[4]))return msg.reply(`Hey this must be a number!`)
            if(!shop_items[0][args[2]][args[3]]) return msg.reply(`This is not a valid item!`)
            if(data.val().coins < parseInt(args[4]) * shop_items[0][args[2]][args[3]].price)return msg.reply(`You don't have this amount of PokeDollars!
            You can Buy a max of **${parseInt(data.val().coins/shop_items[0][args[2]][args[3]].price)} ${args[2]}**`)
            if(quest.val() != null) {
                if(quest.val().quest_type === 'Buy') {
                  if(quest.val().user_quest_items + args[4] >= quest.val().quest_number) {
                    const quest_embed = new discord.MessageEmbed()
                    .setColor('GREY')
                    .setTitle(`You Completed Your Quest: Buy **${quest.val().quest_number}** Item `)
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
                      user_quest_items:quest.val().user_quest_items + args[4],
                    })
                    const quest_embed = new discord.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(`Quest: **${quest.val().user_quest_items + args[4]}/${quest.val().quest_number}** Item Bought`)
                    .setDescription(`Almost there!`)
                    .setTimestamp()      
                    msg.reply(quest_embed)
                  }
                }
              }
        if(args[2] ==="balls") {            
            if(args[3] === "pokeball") {
                database.ref(`Users/${msg.author.id}`).update({
                    pokeballs:data.val().pokeballs + parseInt(args[4])
                })  
            }
            if(args[3] === "MasterBalls") {
                database.ref(`Users/${msg.author.id}`).update({
                    masterballs:data.val().masterballs+  parseInt(args[4])
                })  
            }  
            if(args[3] === "UltraBalls") {
                database.ref(`Users/${msg.author.id}`).update({
                    ultraballs:data.val().ultraballs +  parseInt(args[4])
                })  
            }     
            if(args[3] === "GreatBalls") {
                database.ref(`Users/${msg.author.id}`).update({
                    greatballs:data.val().greatballs +  parseInt(args[4])
                })  
            } 
            msg.reply(`You Bought **X${args[4]} ${args[3]}**`)
            database.ref(`Users/${msg.author.id}`).update({
                coins:data.val().coins -  parseInt(args[4]) * shop_items[0][args[2]][args[3]].price
            })
        }
           
        if(args[2] === "equipments") {
            msg.reply(`You Bought Only One **${args[3]}**`)
            database.ref(`Users/${msg.author.id}`).update({
                coins:data.val().coins -  shop_items[0][args[2]][args[3]].price
            })            
            database.ref(`Users/${msg.author.id}/Equipaments/${args[3]}`).update({
                name:`${args[3]}`,
                durability:100,
            })
        }  
        if(args[2] === "pokemoneggs") {
            msg.reply(`You Bought **X${args[4]} ${args[3]}**`)
            database.ref(`Users/${msg.author.id}`).update({
                coins:data.val().coins -  shop_items[0][args[2]][args[3]].price
            })            
            database.ref(`Users/${msg.author.id}/Inventory/${args[3]}`).once("value",function(data) {
                var a = 0
                if(data.val() != null) {
                a=data.val().amount
                }
                var amount = a + parseInt(args[4])
                database.ref(`Users/${msg.author.id}/Inventory/${args[3]}`).update({
                    name:`${args[3]}`,
                    amount:parseInt(amount),
                    legendary_chances: shop_items[0][args[2]][args[3]].chances_legendary               
                 })
            })

        }   
        if(args[2] === "item") {
            msg.reply(`You Bought **X${args[4]} ${args[3]}**`)
            database.ref(`Users/${msg.author.id}`).update({
                coins:data.val().coins -  shop_items[0][args[2]][args[3]].price
            })            
            database.ref(`Users/${msg.author.id}/Inventory/items/${args[3]}`).once("value",function(data) {
                var a = 0
                if(data.val() != null) {
                a=data.val().amount
                }
                var amount = a + parseInt(args[4])
                database.ref(`Users/${msg.author.id}/Inventory/items/${args[3]}`).update({
                    name:`${args[3]}`,
                    amount:parseInt(amount),
                    restore: shop_items[0][args[2]][args[3]].restore


                })
            })

        }                     
        }

    }

})
};

module.exports.config = {
  name: "shop",
  permission: "EveryOne",
  description: "See the shop",
  usage: "p!shop",
  aliases: []
}