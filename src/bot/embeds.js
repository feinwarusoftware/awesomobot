"use strict";

const discord = require("discord.js");
const moment = require("moment");
const momentTz = require("moment-timezone");
const lastfm = require("../bot/api-lastfm");

function deletion(message) {

    let embed = new discord.RichEmbed();
    const avatarUrl = message.author.avatarURL;

    embed.setColor(0xf44336);
    embed.setAuthor("AWESOM-O // log-deletion", "https://vignette.wikia.nocookie.net/southpark/images/1/14/AwesomeO06.jpg/revision/latest/scale-to-width-down/250?cb=20100310004846");
    embed.addField("**Author:**", "<@" + message.author.id + ">");
    embed.addField("**Channel:**", "<#" + message.channel.id + ">");

    if (message.content) {
        embed.addField("**Message:**", message.content);
    } else {
        embed.addField("**Attachment:**", message.attachments.array()[0].url);
    }

    embed.setThumbnail(avatarUrl.substring(0, avatarUrl.length - 4) + "512");

    return embed;
}

function times(message) {

    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Times");
    embed.addField("PST", momentTz().tz("America/Los_Angeles").format("Do MMMM YYYY, h:mm:ss a"));
    embed.addField("EST", momentTz().tz("America/New_York").format("Do MMMM YYYY, h:mm:ss a"));
    embed.addField("GMT", momentTz().tz("Europe/Dublin").format("Do MMMM YYYY, h:mm:ss a"));
    embed.addField("CST", momentTz().tz("Asia/Hong_Kong").format("Do MMMM YYYY, h:mm:ss a"));
    embed.setThumbnail("https://cdn.discordapp.com/attachments/379432139856412682/401485874040143872/hmmwhatsthetime.png");

    return embed;
}

function info(message) {

    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Info", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setThumbnail("https://vignette.wikia.nocookie.net/southpark/images/6/6d/Awesomo-0.png/revision/latest?cb=20170601014435")
    embed.setTitle("Your all purpose South Park Bot!")
    embed.addField("-help for a list of commands", "If a command is missing, feel free to inform us")
    embed.addField("Crafted with love by Dragon1320 and Mattheous. ♥", "Additional credit goes out to SmashRoyale for the amazing art")
    embed.addField("Online Dashboard", "http://localhost/")
    embed.setFooter("This bot is pretty schweet!");

    return embed;
}

function help(message) {

    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Help", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setThumbnail("https://images.emojiterra.com/twitter/512px/1f914.png")
    embed.addField("List of Commands", "http://localhost/commands")
    embed.addField("Help & Support", "https://help.awesomobot.com/")
    embed.setFooter("These dev people are very helpful!");

    return embed;
}

function harvest(message) {

    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Harvest", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setImage("http://diymag.com/media/img/Artists/D/Dua_Lipa/_1500x1000_crop_center-center_75/Dua-Lipa-4-lo-res-1.jpg")
    embed.setTitle("Dua Lipa")
    embed.setDescription("Dua Lipa is an English singer, songwriter, and model. Her musical career began at age 14, when she began covering songs by other artists on YouTube. In 2015, she was signed with Warner Music Group and released her first single soon after. In December 2016, a documentary about Lipa was commissioned by The Fader magazine, titled See in Blue.")
    embed.setFooter("Ave, ave versus christus!")
    embed.setURL("https://youtu.be/6H3UiwU1N5I?t=3m2s");
    return embed;
}

const data = {};
lastfm.topArtists({}, (d1) => {
    lastfm.topArtists({
        period: "7day"
    }, (d2) => {
        lastfm.topArtists({
            period: "1month"
        }, (d3) => {
            // all time artist name
            data.topAllArtistName = d1.topartists.artist[0].name;
            data.topAllArtist2Name = d1.topartists.artist[1].name;
            data.topAllArtist3Name = d1.topartists.artist[2].name;
            data.topAllArtist4Name = d1.topartists.artist[3].name;
            data.topAllArtist5Name = d1.topartists.artist[4].name;
            // all time artist plays
            data.topAllArtistPlays = d1.topartists.artist[0].playcount;
            data.topAllArtist2Plays = d1.topartists.artist[1].playcount;
            data.topAllArtist3Plays = d1.topartists.artist[2].playcount;
            data.topAllArtist4Plays = d1.topartists.artist[3].playcount;
            data.topAllArtist5Plays = d1.topartists.artist[4].playcount;
            // weekly artist names
            data.topWeekArtistName = d2.topartists.artist[0].name;
            data.topWeekArtist2Name = d2.topartists.artist[1].name;
            data.topWeekArtist3Name = d2.topartists.artist[2].name;
            data.topWeekArtist4Name = d2.topartists.artist[3].name;
            data.topWeekArtist5Name = d2.topartists.artist[4].name;
            // weekly artist plays
            data.topWeekArtistPlays = d2.topartists.artist[0].playcount;
            data.topWeekArtist2Plays = d2.topartists.artist[1].playcount;
            data.topWeekArtist3Plays = d2.topartists.artist[2].playcount;
            data.topWeekArtist4Plays = d2.topartists.artist[3].playcount;
            data.topWeekArtist5Plays = d2.topartists.artist[4].playcount;
            // monthly artist names
            data.topMonthArtistName = d3.topartists.artist[0].name;
            data.topMonthArtist2Name = d3.topartists.artist[1].name;
            data.topMonthArtist3Name = d3.topartists.artist[2].name;
            data.topMonthArtist4Name = d3.topartists.artist[3].name;
            data.topMonthArtist5Name = d3.topartists.artist[4].name;
            // monthly artist plays
            data.topMonthArtistPlays = d3.topartists.artist[0].playcount;
            data.topMonthArtist2Plays = d3.topartists.artist[1].playcount;
            data.topMonthArtist3Plays = d3.topartists.artist[2].playcount;
            data.topMonthArtist4Plays = d3.topartists.artist[3].playcount;
            data.topMonthArtist5Plays = d3.topartists.artist[4].playcount;
            // images
            data.artistImg = d1.topartists.artist[0].image[d1.topartists.artist[0].image.length - 1]["#text"];
            data.artistWeekImg = d2.topartists.artist[0].image[d1.topartists.artist[0].image.length - 1]["#text"];
            data.artistMonthImg = d3.topartists.artist[0].image[d1.topartists.artist[0].image.length - 1]["#text"];
        })
    })
})
lastfm.topAlbums({}, (d1) => {
    lastfm.topAlbums({
        period: "7day"
    }, (d2) => {
        lastfm.topAlbums({
            period: "1month"
        }, (d3) => {
            // all time album name
            data.topAllAlbumName = d1.topalbums.album[0].name;
            data.topAllAlbum2Name = d1.topalbums.album[1].name;
            data.topAllAlbum3Name = d1.topalbums.album[2].name;
            data.topAllAlbum4Name = d1.topalbums.album[3].name;
            data.topAllAlbum5Name = d1.topalbums.album[4].name;
            // all time album artist
            data.topAllAlbumArtist = d1.topalbums.album[0].artist.name;
            data.topAllAlbum2Artist = d1.topalbums.album[1].artist.name;
            data.topAllAlbum3Artist = d1.topalbums.album[2].artist.name;
            data.topAllAlbum4Artist = d1.topalbums.album[3].artist.name;
            data.topAllAlbum5Artist = d1.topalbums.album[4].artist.name;
            // all time album plays
            data.topAllAlbumPlays = d1.topalbums.album[0].playcount;
            data.topAllAlbum2Plays = d1.topalbums.album[1].playcount;
            data.topAllAlbum3Plays = d1.topalbums.album[2].playcount;
            data.topAllAlbum4Plays = d1.topalbums.album[3].playcount;
            data.topAllAlbum5Plays = d1.topalbums.album[4].playcount;
            // weekly album names
            data.topWeekAlbumName = d2.topalbums.album[0].name;
            data.topWeekAlbum2Name = d2.topalbums.album[1].name;
            data.topWeekAlbum3Name = d2.topalbums.album[2].name;
            data.topWeekAlbum4Name = d2.topalbums.album[3].name;
            data.topWeekAlbum5Name = d2.topalbums.album[4].name;
            // weekly album artist
            data.topWeekAlbumArtist = d2.topalbums.album[0].artist.name;
            data.topWeekAlbum2Artist = d2.topalbums.album[1].artist.name;
            data.topWeekAlbum3Artist = d2.topalbums.album[2].artist.name;
            data.topWeekAlbum4Artist = d2.topalbums.album[3].artist.name;
            data.topWeekAlbum5Artist = d2.topalbums.album[4].artist.name;
            // weekly album plays
            data.topWeekAlbumPlays = d2.topalbums.album[0].playcount;
            data.topWeekAlbum2Plays = d2.topalbums.album[1].playcount;
            data.topWeekAlbum3Plays = d2.topalbums.album[2].playcount;
            data.topWeekAlbum4Plays = d2.topalbums.album[3].playcount;
            data.topWeekAlbum5Plays = d2.topalbums.album[4].playcount;
            // monthly album names
            data.topMonthAlbumName = d3.topalbums.album[0].name;
            data.topMonthAlbum2Name = d3.topalbums.album[1].name;
            data.topMonthAlbum3Name = d3.topalbums.album[2].name;
            data.topMonthAlbum4Name = d3.topalbums.album[3].name;
            data.topMonthAlbum5Name = d3.topalbums.album[4].name;
            // monthly album artist
            data.topMonthAlbumArtist = d3.topalbums.album[0].artist.name;
            data.topMonthAlbum2Artist = d3.topalbums.album[1].artist.name;
            data.topMonthAlbum3Artist = d3.topalbums.album[2].artist.name;
            data.topMonthAlbum4Artist = d3.topalbums.album[3].artist.name;
            data.topMonthAlbum5Artist = d3.topalbums.album[4].artist.name;
            // monthly album plays
            data.topMonthAlbumPlays = d3.topalbums.album[0].playcount;
            data.topMonthAlbum2Plays = d3.topalbums.album[1].playcount;
            data.topMonthAlbum3Plays = d3.topalbums.album[2].playcount;
            data.topMonthAlbum4Plays = d3.topalbums.album[3].playcount;
            data.topMonthAlbum5Plays = d3.topalbums.album[4].playcount;
            // images
            data.albumImg = d1.topalbums.album[0].image[d1.topalbums.album[0].image.length - 1]["#text"];
            data.albumWeekImg = d2.topalbums.album[0].image[d1.topalbums.album[0].image.length - 1]["#text"];
            data.albumMonthImg = d3.topalbums.album[0].image[d1.topalbums.album[0].image.length - 1]["#text"];
        })
    })
})
lastfm.topTracks({}, (d1) => {
    lastfm.topTracks({
        period: "7day"
    }, (d2) => {
        lastfm.topTracks({
            period: "1month"
        }, (d3) => {
            // all time track name
            data.topAllTrackName = d1.toptracks.track[0].name;
            data.topAllTrack2Name = d1.toptracks.track[1].name;
            data.topAllTrack3Name = d1.toptracks.track[2].name;
            data.topAllTrack4Name = d1.toptracks.track[3].name;
            data.topAllTrack5Name = d1.toptracks.track[4].name;
            // all time track artist
            data.topAllTrackArtist = d1.toptracks.track[0].artist.name;
            data.topAllTrack2Artist = d1.toptracks.track[1].artist.name;
            data.topAllTrack3Artist = d1.toptracks.track[2].artist.name;
            data.topAllTrack4Artist = d1.toptracks.track[3].artist.name;
            data.topAllTrack5Artist = d1.toptracks.track[4].artist.name;
            // all time track plays
            data.topAllTrackPlays = d1.toptracks.track[0].playcount;
            data.topAllTrack2Plays = d1.toptracks.track[1].playcount;
            data.topAllTrack3Plays = d1.toptracks.track[2].playcount;
            data.topAllTrack4Plays = d1.toptracks.track[3].playcount;
            data.topAllTrack5Plays = d1.toptracks.track[4].playcount;
            // weekly track names
            data.topWeekTrackName = d2.toptracks.track[0].name;
            data.topWeekTrack2Name = d2.toptracks.track[1].name;
            data.topWeekTrack3Name = d2.toptracks.track[2].name;
            data.topWeekTrack4Name = d2.toptracks.track[3].name;
            data.topWeekTrack5Name = d2.toptracks.track[4].name;
            // weekly track artist
            data.topWeekTrackArtist = d2.toptracks.track[0].artist.name;
            data.topWeekTrack2Artist = d2.toptracks.track[1].artist.name;
            data.topWeekTrack3Artist = d2.toptracks.track[2].artist.name;
            data.topWeekTrack4Artist = d2.toptracks.track[3].artist.name;
            data.topWeekTrack5Artist = d2.toptracks.track[4].artist.name;
            // weekly track plays
            data.topWeekTrackPlays = d2.toptracks.track[0].playcount;
            data.topWeekTrack2Plays = d2.toptracks.track[1].playcount;
            data.topWeekTrack3Plays = d2.toptracks.track[2].playcount;
            data.topWeekTrack4Plays = d2.toptracks.track[3].playcount;
            data.topWeekTrack5Plays = d2.toptracks.track[4].playcount;
            // monthly track names
            data.topMonthTrackName = d3.toptracks.track[0].name;
            data.topMonthTrack2Name = d3.toptracks.track[1].name;
            data.topMonthTrack3Name = d3.toptracks.track[2].name;
            data.topMonthTrack4Name = d3.toptracks.track[3].name;
            data.topMonthTrack5Name = d3.toptracks.track[4].name;
            // monthly track artist
            data.topMonthTrackArtist = d3.toptracks.track[0].artist.name;
            data.topMonthTrack2Artist = d3.toptracks.track[1].artist.name;
            data.topMonthTrack3Artist = d3.toptracks.track[2].artist.name;
            data.topMonthTrack4Artist = d3.toptracks.track[3].artist.name;
            data.topMonthTrack5Artist = d3.toptracks.track[4].artist.name;
            // monthly track plays
            data.topMonthTrackPlays = d3.toptracks.track[0].playcount;
            data.topMonthTrack2Plays = d3.toptracks.track[1].playcount;
            data.topMonthTrack3Plays = d3.toptracks.track[2].playcount;
            data.topMonthTrack4Plays = d3.toptracks.track[3].playcount;
            data.topMonthTrack5Plays = d3.toptracks.track[4].playcount;
            // images
            data.trackImg = d1.toptracks.track[0].image[d1.toptracks.track[0].image.length - 1]["#text"];
            data.trackWeekImg = d2.toptracks.track[0].image[d1.toptracks.track[0].image.length - 1]["#text"];
            data.trackMonthImg = d3.toptracks.track[0].image[d1.toptracks.track[0].image.length - 1]["#text"];
        })
    })
})

function fmartist(message) {
    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Last.fm", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setThumbnail(data.artistImg)
    embed.setTitle("Last.fm Top Artists")
    embed.addField("Last 7 Days", data.topWeekArtistName + " (" + data.topWeekArtistPlays + " plays)")
    embed.addField("Last 30 Days", data.topMonthArtistName + " (" + data.topMonthArtistPlays + " plays)")
    embed.addField("All Time", data.topAllArtistName + " (" + data.topAllArtistPlays + " plays)")
    embed.setFooter("View full stats on last.fm")
    embed.setURL("https://last.fm/user/mattheous");
    return embed;
}

function fmartistall(message) {
    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Last.fm", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setThumbnail(data.artistImg)
    embed.setTitle("Last.fm Top All Time Albums")
    embed.addField(data.topAllArtistName, data.topAllArtistPlays + " plays")
    embed.addField(data.topAllArtist2Name, data.topAllArtist2Plays + " plays")
    embed.addField(data.topAllArtist3Name, data.topAllArtist3Plays + " plays")
    embed.addField(data.topAllArtist4Name, data.topAllArtist4Plays + " plays")
    embed.addField(data.topAllArtist5Name, data.topAllArtist5Plays + " plays")
    embed.setFooter("View full stats on last.fm")
    embed.setURL("https://last.fm/user/mattheous");
    return embed;
}
function fmartistmonth(message) {
    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Last.fm", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setThumbnail(data.albumMonthImg)
    embed.setTitle("Last.fm Top Artists of this Month")
    embed.addField(data.topMonthArtistName, data.topMonthArtistPlays + " plays")
    embed.addField(data.topMonthArtist2Name, data.topMonthArtist2Plays + " plays")
    embed.addField(data.topMonthArtist3Name, data.topMonthArtist3Plays + " plays")
    embed.addField(data.topMonthArtist4Name, data.topMonthArtist4Plays + " plays")
    embed.addField(data.topMonthArtist5Name, data.topMonthArtist5Plays + " plays")
    embed.setFooter("View full stats on last.fm")
    embed.setURL("https://last.fm/user/mattheous");
    return embed;
}
function fmartistweek(message) {
    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Last.fm", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setThumbnail(data.artistWeekImg)
    embed.setTitle("Last.fm Top Artists of this Week")
    embed.addField(data.topWeekArtistName, data.topWeekArtistPlays + " plays")
    embed.addField(data.topWeekArtist2Name, data.topWeekArtist2Plays + " plays")
    embed.addField(data.topWeekArtist3Name, data.topWeekArtist3Plays + " plays")
    embed.addField(data.topWeekArtist4Name, data.topWeekArtist4Plays + " plays")
    embed.addField(data.topWeekArtist5Name, data.topWeekArtist5Plays + " plays")
    embed.setFooter("View full stats on last.fm")
    embed.setURL("https://last.fm/user/mattheous");
    return embed;
}

function fmalbum(message) {
    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Last.fm", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setThumbnail(data.albumImg)
    embed.setTitle("Last.fm Top Albums")
    embed.addField("Last 7 Days", data.topWeekAlbumArtist + " - " + data.topWeekAlbumName + " (" + data.topWeekAlbumPlays + " plays)")
    embed.addField("Last 30 Days", data.topMonthAlbumArtist + " - " + data.topMonthAlbumName + " (" + data.topMonthAlbumPlays + " plays)")
    embed.addField("All Time", data.topAllAlbumArtist + " - " + data.topAllAlbumName + " (" + data.topAllAlbumPlays + " plays)")
    embed.setFooter("View full stats on last.fm")
    embed.setURL("https://last.fm/user/mattheous");
    return embed;
}

function fmalbumall(message) {
    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Last.fm", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setThumbnail(data.albumImg)
    embed.setTitle("Last.fm Top All Time Albums")
    embed.addField(data.topAllAlbumArtist + " - " + data.topAllAlbumName, data.topAllAlbumPlays + " plays")
    embed.addField(data.topAllAlbum2Artist + " - " + data.topAllAlbum2Name, data.topAllAlbum2Plays + " plays")
    embed.addField(data.topAllAlbum3Artist + " - " + data.topAllAlbum3Name, data.topAllAlbum3Plays + " plays")
    embed.addField(data.topAllAlbum4Artist + " - " + data.topAllAlbum4Name, data.topAllAlbum4Plays + " plays")
    embed.addField(data.topAllAlbum5Artist + " - " + data.topAllAlbum5Name, data.topAllAlbum5Plays + " plays")
    embed.setFooter("View full stats on last.fm")
    embed.setURL("https://last.fm/user/mattheous");
    return embed;
}

function fmalbummonth(message) {
    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Last.fm", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setThumbnail(data.albumMonthImg)
    embed.setTitle("Last.fm Top Albums of the Month")
    embed.addField(data.topMonthAlbumArtist + " - " + data.topMonthAlbumName, data.topMonthAlbumPlays + " plays")
    embed.addField(data.topMonthAlbum2Artist + " - " + data.topMonthAlbum2Name, data.topMonthAlbum2Plays + " plays")
    embed.addField(data.topMonthAlbum3Artist + " - " + data.topMonthAlbum3Name, data.topMonthAlbum3Plays + " plays")
    embed.addField(data.topMonthAlbum4Artist + " - " + data.topMonthAlbum4Name, data.topMonthAlbum4Plays + " plays")
    embed.addField(data.topMonthAlbum5Artist + " - " + data.topMonthAlbum5Name, data.topMonthAlbum5Plays + " plays")
    embed.setFooter("View full stats on last.fm")
    embed.setURL("https://last.fm/user/mattheous");
    return embed;
}

function fmalbumweek(message) {
    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Last.fm", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setThumbnail(data.albumWeekImg)
    embed.setTitle("Last.fm Top Albums of the Week")
    embed.addField(data.topWeekAlbumArtist + " - " + data.topWeekAlbumName, data.topWeekAlbumPlays + " plays")
    embed.addField(data.topWeekAlbum2Artist + " - " + data.topWeekAlbum2Name, data.topWeekAlbum2Plays + " plays")
    embed.addField(data.topWeekAlbum3Artist + " - " + data.topWeekAlbum3Name, data.topWeekAlbum3Plays + " plays")
    embed.addField(data.topWeekAlbum4Artist + " - " + data.topWeekAlbum4Name, data.topWeekAlbum4Plays + " plays")
    embed.addField(data.topWeekAlbum5Artist + " - " + data.topWeekAlbum5Name, data.topWeekAlbum5Plays + " plays")
    embed.setFooter("View full stats on last.fm")
    embed.setURL("https://last.fm/user/mattheous");
    return embed;
}

function fmtrack(message) {
    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Last.fm", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setThumbnail(data.trackImg)
    embed.setTitle("Last.fm Top Tracks")
    embed.addField("Last 7 Days", data.topWeekTrackArtist + " - " + data.topWeekTrackName + " (" + data.topWeekTrackPlays + " plays)")
    embed.addField("Last 30 Days", data.topMonthTrackArtist + " - " + data.topMonthTrackName + " (" + data.topMonthTrackPlays + " plays)")
    embed.addField("All Time", data.topAllTrackArtist + " - " + data.topAllTrackName + " (" + data.topAllTrackPlays + " plays)")
    embed.setFooter("View full stats on last.fm")
    embed.setURL("https://last.fm/user/mattheous");
    return embed;
}

function fmtrackall(message) {
    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Last.fm", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setThumbnail(data.trackImg)
    embed.setTitle("Last.fm Top All Time Tracks")
    embed.addField(data.topAllTrackArtist + " - " + data.topAllTrackName, data.topAllTrackPlays + " plays")
    embed.addField(data.topAllTrack2Artist + " - " + data.topAllTrack2Name, data.topAllTrack2Plays + " plays")
    embed.addField(data.topAllTrack3Artist + " - " + data.topAllTrack3Name, data.topAllTrack3Plays + " plays")
    embed.addField(data.topAllTrack4Artist + " - " + data.topAllTrack4Name, data.topAllTrack4Plays + " plays")
    embed.addField(data.topAllTrack5Artist + " - " + data.topAllTrack5Name, data.topAllTrack5Plays + " plays")
    embed.setFooter("View full stats on last.fm")
    embed.setURL("https://last.fm/user/mattheous");
    return embed;
}

function fmtrackmonth(message) {
    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Last.fm", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setThumbnail(data.trackMonthImg)
    embed.setTitle("Last.fm Top Tracks of the Month")
    embed.addField(data.topMonthTrackArtist + " - " + data.topMonthTrackName, data.topMonthTrackPlays + " plays")
    embed.addField(data.topMonthTrack2Artist + " - " + data.topMonthTrack2Name, data.topMonthTrack2Plays + " plays")
    embed.addField(data.topMonthTrack3Artist + " - " + data.topMonthTrack3Name, data.topMonthTrack3Plays + " plays")
    embed.addField(data.topMonthTrack4Artist + " - " + data.topMonthTrack4Name, data.topMonthTrack4Plays + " plays")
    embed.addField(data.topMonthTrack5Artist + " - " + data.topMonthTrack5Name, data.topMonthTrack5Plays + " plays")
    embed.setFooter("View full stats on last.fm")
    embed.setURL("https://last.fm/user/mattheous");
    return embed;
}

function fmtrackweek(message) {
    let embed = new discord.RichEmbed();
    embed.setColor(0x8bc34a);
    embed.setAuthor("AWESOM-O // Last.fm", "https://b.thumbs.redditmedia.com/9JuhorqoOt0_VAPO6vvvewcuy1Fp-oBL3ejJkQjjpiQ.png")
    embed.setThumbnail(data.trackWeekImg)
    embed.setTitle("Last.fm Top Tracks of the Week")
    embed.addField(data.topWeekTrackArtist + " - " + data.topWeekTrackName, data.topWeekTrackPlays + " plays")
    embed.addField(data.topWeekTrack2Artist + " - " + data.topWeekTrack2Name, data.topWeekTrack2Plays + " plays")
    embed.addField(data.topWeekTrack3Artist + " - " + data.topWeekTrack3Name, data.topWeekTrack3Plays + " plays")
    embed.addField(data.topWeekTrack4Artist + " - " + data.topWeekTrack4Name, data.topWeekTrack4Plays + " plays")
    embed.addField(data.topWeekTrack5Artist + " - " + data.topWeekTrack5Name, data.topWeekTrack5Plays + " plays")
    embed.setFooter("View full stats on last.fm")
    embed.setURL("https://last.fm/user/mattheous");
    return embed;
}

module.exports = {
    deletion,
    times,
    info,
    help,
    harvest,
    fmartist,
    fmalbum,
    fmartistall,
    fmartistmonth,
    fmartistweek,
    fmalbumall,
    fmalbummonth,
    fmalbumweek,
    fmtrack,
    fmtrackall,
    fmtrackmonth,
    fmtrackweek
}