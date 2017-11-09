const Discord = require("discord.js");

//Bot info embed
module.exports.infoEmbed = new Discord.RichEmbed()
.setColor(0x85171d)
.setAuthor(``, 'https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png')
.setThumbnail('http://screeninvasion.com/wp-content/uploads/2013/03/Butters-Awesom-O.jpg')
.setTitle('Your all purpose South Park Bot! Crafted with love by Mattheous. ♥')
.setDescription("-help for a list of commands")
.setFooter("This bot is pretty schweet!")

//Help Embeds
module.exports.helpEmbed = new Discord.RichEmbed()
.setColor(0x85171d)
.setAuthor("NOMAC // Commands", 'https://a.thumbs.redditmedia.com/CK3mlJPLodayl_2bTbFkxC8FBuyevfeCTu0b6gK-_x8.png')
.setThumbnail("https://cdn.shopify.com/s/files/1/1061/1924/files/Thinking_Face_Emoji.png")
.addField("ping", "Pong!")
.addField("botinfo", "Displays a short description of the bot")
.addField("help", "Type this if you want to cause inception")
.addField("times", "Displays a list of times in different timezones.")
.setFooter("Page 1 of 2 :: Use -help2 to view page 2 (Non serious commands)")

module.exports.helpEmbedTwo = new Discord.RichEmbed()
.setColor(0x85171d)
.setAuthor("NOMAC // Commands", 'https://a.thumbs.redditmedia.com/CK3mlJPLodayl_2bTbFkxC8FBuyevfeCTu0b6gK-_x8.png')
.setThumbnail("https://cdn.shopify.com/s/files/1/1061/1924/files/Thinking_Face_Emoji.png")


module.exports.helpEmbedInstrument = new Discord.RichEmbed()
.setColor(0x85171d)
.setAuthor("NOMAC // Instrument Commands", 'https://a.thumbs.redditmedia.com/CK3mlJPLodayl_2bTbFkxC8FBuyevfeCTu0b6gK-_x8.png')
.setThumbnail("https://cdn.shopify.com/s/files/1/1061/1924/files/Thinking_Face_Emoji.png")
.addField("Guitar", "You become the Petruccinator")
.addField("Bass", "You become one with Ying and Yang")
.addField("Drums", "Mike is better than Mike")
.addField("Keyboard", "You become a wizard, Harry!")
.addField("Vocals", "You unleash a banshee scream")
.setFooter("Note: These commands are not case sensitive")