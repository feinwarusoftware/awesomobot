"use strict"

const express = require("express");
const rquest = require("../../bot/rquest");
const bot = require("../../bot/main");
const router = express.Router();

const Server = require("../../common/models/server");

router.get("/", (req, res, next) => {

    var queries = [];
    for (var i = 0; i < req.user.guilds.length; i++) {
        queries.push(Server.findById(req.user.guilds[i].id));
    }

    Promise.all(queries).then(servers => {
        
        for (var i = 0; i < servers.length; i++) {
            req.user.guilds[i].bot = false;
            if (servers[i] != null) {
                req.user.guilds[i].bot = true;
            }
        }

        res.render("dashboard/select", { user: req.user });
    });
});

router.get("/home", (req, res) => {

    if (!req.user.currentGuild) {
        res.render("dashboard/noselect");
        return;
    }

    Server.findById(req.user.currentGuild, (err, server) => {
        if (err) {
            res.send(err);
        }

        rquest.performRequest("discordapp.com", "/api/guilds/" + req.user.currentGuild + "/widget.json", "GET", {}, (data) => {

            res.render("dashboard/", { user: req.user, server: server, online: data.members.length });
        });
    });
});

router.get("/developer", (req, res) => {

    if (!req.user.currentGuild) {
        res.render("dashboard/noselect");
        return;
    }

    Server.findById(req.user.currentGuild, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/developer", { user: req.user, server: server });
    });
});

router.get("/games", (req, res) => {

    if (!req.user.currentGuild) {
        res.render("dashboard/noselect");
        return;
    }

    Server.findById(req.user.currentGuild, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/games", { user: req.user, server: server });
    });
});

router.get("/leaderboards", (req, res) => {

    if (!req.user.currentGuild) {
        res.render("dashboard/noselect");
        return;
    }

    Server.findById(req.user.currentGuild, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/leaderboards", { user: req.user, server: server });
    });
});

const temp = {
    "total": 5060,
    "list": [{
        "id": "174754869595471873",
        "name": "Kyrion",
        "shits": 555,
        "activity": 91578,
        "lastmsg": 2
    }, {
        "id": 217486439380811780,
        "name": "superfloree",
        "shits": 443,
        "activity": 30980.772924033245,
        "lastmsg": 252
    }, {
        "id": "331641326816854028",
        "name": "Tweek Tweak",
        "shits": 422,
        "activity": 71230,
        "lastmsg": 71
    }, {
        "id": "228887919689990144",
        "name": "Paladin Butters",
        "shits": 414,
        "activity": 63698,
        "lastmsg": 1
    }, {
        "id": 168232762862600200,
        "name": "kratosgow342",
        "shits": 362,
        "activity": 63402,
        "lastmsg": 57
    }, {
        "id": 168690518899949570,
        "name": "!Dragon1320",
        "shits": 237,
        "activity": 14559,
        "lastmsg": 41
    }, {
        "id": 262345465306021900,
        "name": "SmashRoyale",
        "shits": 196,
        "activity": 50761.140772982006,
        "lastmsg": 1
    }, {
        "id": 191579984274522100,
        "name": "Bell",
        "shits": 181,
        "activity": 27660,
        "lastmsg": 254
    }, {
        "id": "385149322716643348",
        "name": "Stfu",
        "shits": 179,
        "activity": 8864,
        "lastmsg": 107
    }, {
        "id": 190914446774763520,
        "name": "Mattheous",
        "shits": 152,
        "activity": 15734.621594137521,
        "lastmsg": 58
    }, {
        "id": "142896162955984896",
        "name": "kajcsi",
        "shits": 144,
        "activity": 19018,
        "lastmsg": 65
    }, {
        "id": "99626024181968896",
        "name": "Airborn56",
        "shits": 137,
        "activity": 14226,
        "lastmsg": 9
    }, {
        "id": "215982178046181376",
        "name": "Tweekerino",
        "shits": 108,
        "activity": 44406,
        "lastmsg": 2
    }, {
        "id": 230875863644635140,
        "name": "Fa99les",
        "shits": 95,
        "activity": 22124,
        "lastmsg": 58
    }, {
        "id": "312808956340731905",
        "name": "しろ",
        "shits": 87,
        "activity": 7513.264047908058,
        "lastmsg": 2
    }, {
        "id": "375586532527964160",
        "name": "BBush",
        "shits": 84,
        "activity": 9625.39093047814,
        "lastmsg": 26
    }, {
        "id": "275397087485755392",
        "name": "*name change",
        "shits": 75,
        "activity": 11850,
        "lastmsg": 2
    }, {
        "id": "210577042998034433",
        "name": "ファックオフ、縮退❤",
        "shits": 66,
        "activity": 5683.847258990232,
        "lastmsg": 6130
    }, {
        "id": "395090104491966474",
        "name": "officalchespiny",
        "shits": 64,
        "activity": 12066.247090474646,
        "lastmsg": 25
    }, {
        "id": "355901469804855297",
        "name": "Made an attempt",
        "shits": 61,
        "activity": 6816,
        "lastmsg": 48
    }, {
        "id": "280031103761514507",
        "name": "MINTBERRYCRRRRRRRRRRRRUNCH!",
        "shits": 48,
        "activity": 18024.866443553132,
        "lastmsg": 2
    }, {
        "id": "213884331838406656",
        "name": "OkAycase",
        "shits": 47,
        "activity": 20330,
        "lastmsg": 60
    }, {
        "id": "277581652484554752",
        "name": "Festive Dany",
        "shits": 44,
        "activity": 6286,
        "lastmsg": 28
    }, {
        "id": "198005882586398721",
        "name": "everydaykemkem",
        "shits": 42,
        "activity": 22390,
        "lastmsg": 199
    }, {
        "id": "201014010395623424",
        "name": "alfredo2006",
        "shits": 40,
        "activity": 3881.0596528926744,
        "lastmsg": 8
    }, {
        "id": "372758178321924108",
        "name": "dankparodies213",
        "shits": 37,
        "activity": 1162,
        "lastmsg": 245
    }, {
        "id": 194652191896764400,
        "name": "kiyomitsuuu",
        "shits": 35,
        "activity": 1239.5636896743356,
        "lastmsg": 910
    }, {
        "id": "170229410014822400",
        "name": "AlbinoClock",
        "shits": 32,
        "activity": 20,
        "lastmsg": 373
    }, {
        "id": "117783098623655936",
        "name": "Fennwayz",
        "shits": 30,
        "activity": 5354,
        "lastmsg": 75
    }, {
        "id": "296211279083995136",
        "name": "skinny penis",
        "shits": 29,
        "activity": 4988,
        "lastmsg": 5
    }, {
        "id": "319999952350740481",
        "name": "Karkat Vantas",
        "shits": 28,
        "activity": 3158.430307203321,
        "lastmsg": 283
    }, {
        "id": "198687342079246336",
        "name": "play that music funky white boi",
        "shits": 26,
        "activity": 8904.978770205493,
        "lastmsg": 604
    }, {
        "id": "157615456826556416",
        "name": "Engikirby",
        "shits": 20,
        "activity": 9732,
        "lastmsg": 18
    }, {
        "id": "273409276725166081",
        "name": "Ceres",
        "shits": 19,
        "activity": 0,
        "lastmsg": 587
    }, {
        "id": "171798358153887744",
        "name": "Lolwutburger",
        "shits": 19,
        "activity": 7095.587778076295,
        "lastmsg": 120
    }, {
        "id": "326447343840788480",
        "name": "DeadMemes",
        "shits": 18,
        "activity": 4855.767023511967,
        "lastmsg": 586
    }, {
        "id": "228561869852508172",
        "name": "Lei",
        "shits": 18,
        "activity": 48,
        "lastmsg": 495
    }, {
        "id": "150687833353486337",
        "name": "Endless Nameless (godo)",
        "shits": 17,
        "activity": 0,
        "lastmsg": 2115
    }, {
        "id": "330756704985808909",
        "name": "Rick-C137",
        "shits": 17,
        "activity": 1943.3181543735343,
        "lastmsg": 3778
    }, {
        "id": "329020358911066113",
        "name": "yes, definitely, absolutely.",
        "shits": 16,
        "activity": 4152.44109778791,
        "lastmsg": 219
    }, {
        "id": "307248302397718529",
        "name": "GrajowiecPL",
        "shits": 16,
        "activity": 2010,
        "lastmsg": 73
    }, {
        "id": "313768840188395521",
        "name": "🎄 Lania",
        "shits": 16,
        "activity": 0,
        "lastmsg": 9525
    }, {
        "id": "270588978741116938",
        "name": "Dont know who i am",
        "shits": 16,
        "activity": 3932.7823946634016,
        "lastmsg": 10
    }, {
        "id": "303133450796400642",
        "name": "shanny 🚀",
        "shits": 14,
        "activity": 0,
        "lastmsg": 10768
    }, {
        "id": 220257478296862720,
        "name": "Ravus",
        "shits": 14,
        "activity": 104,
        "lastmsg": 433
    }, {
        "id": 349886534989643800,
        "name": "WonderTweek",
        "shits": 14,
        "activity": 4959.204556061076,
        "lastmsg": 30
    }, {
        "id": "383901109288173568",
        "name": "fuckmewahddytilmyfacefallsoff",
        "shits": 13,
        "activity": 2724.8624363638273,
        "lastmsg": 921
    }, {
        "id": "219562678371352577",
        "name": "Umbreon",
        "shits": 13,
        "activity": 261.3399196548006,
        "lastmsg": 579
    }, {
        "id": 122649425062395900,
        "name": "Ryder",
        "shits": 13,
        "activity": 8003.147076456855,
        "lastmsg": 120
    }, {
        "id": "160088262231195648",
        "name": "Porter",
        "shits": 12,
        "activity": 0,
        "lastmsg": 12893
    }, {
        "id": "299075711983943681",
        "name": "Xeno",
        "shits": 11,
        "activity": 247.84129540678043,
        "lastmsg": 788
    }, {
        "id": "226106120446541824",
        "name": "Lextreme",
        "shits": 11,
        "activity": 955.8733663039886,
        "lastmsg": 357
    }, {
        "id": "242044514255110145",
        "name": "OOFthatsroughbuddy",
        "shits": 10,
        "activity": 0,
        "lastmsg": 3382
    }, {
        "id": "345336838376128512",
        "name": "gAH AAAAAAA",
        "shits": 9,
        "activity": 750.2360914668166,
        "lastmsg": 455
    }, {
        "id": "254381166700920832",
        "name": "DSV",
        "shits": 9,
        "activity": 4660,
        "lastmsg": 21
    }, {
        "id": "212761441676165120",
        "name": "Vex (Creatur3)",
        "shits": 9,
        "activity": 0,
        "lastmsg": 4316
    }, {
        "id": "319941812230029312",
        "name": "vit",
        "shits": 8,
        "activity": 14,
        "lastmsg": 562
    }, {
        "id": "161573813379792899",
        "name": "Kamui",
        "shits": 8,
        "activity": 24778,
        "lastmsg": 1
    }, {
        "id": "158971865392611328",
        "name": "Wokesy",
        "shits": 8,
        "activity": 0,
        "lastmsg": 11763
    }, {
        "id": "248950499150266369",
        "name": "BaconTheUber",
        "shits": 8,
        "activity": 0,
        "lastmsg": 1997
    }, {
        "id": "239482850062237707",
        "name": "0utofbody",
        "shits": 7,
        "activity": 0,
        "lastmsg": 6068
    }, {
        "id": "289830409397731338",
        "name": "tweek is my best gay sonn",
        "shits": 7,
        "activity": 0,
        "lastmsg": 8840
    }, {
        "id": "267818273389674497",
        "name": "Icy Boi",
        "shits": 7,
        "activity": 0,
        "lastmsg": 3381
    }, {
        "id": "230502782623285248",
        "name": "Kyle",
        "shits": 6,
        "activity": 2566.434730205927,
        "lastmsg": 61
    }, {
        "id": "233832353468907521",
        "name": "Polnareff",
        "shits": 5,
        "activity": 2134.8806026505536,
        "lastmsg": 17
    }, {
        "id": "230225521277927424",
        "name": "ellaisgrumpy",
        "shits": 4,
        "activity": 0,
        "lastmsg": 4211
    }, {
        "id": "342296352853721092",
        "name": "VaderSpawn",
        "shits": 4,
        "activity": 0,
        "lastmsg": 12740
    }, {
        "id": "214458285242187777",
        "name": "Calvin Craig",
        "shits": 4,
        "activity": 61.3894028177093,
        "lastmsg": 876
    }, {
        "id": "257221980426731530",
        "name": "KA E DET SOM SKJEEEER?!!!!",
        "shits": 4,
        "activity": 0,
        "lastmsg": 5818
    }, {
        "id": "277338703884582923",
        "name": "Polturkey",
        "shits": 4,
        "activity": 0,
        "lastmsg": 842
    }, {
        "id": "287951569809309696",
        "name": "PiggyTerry",
        "shits": 4,
        "activity": 1210.7156909164098,
        "lastmsg": 963
    }, {
        "id": "341761717614804993",
        "name": "Kyle Broflovski",
        "shits": 4,
        "activity": 0,
        "lastmsg": 2089
    }, {
        "id": "213079375434874880",
        "name": "Rev. B",
        "shits": 4,
        "activity": 0,
        "lastmsg": 664
    }, {
        "id": "346750957373227029",
        "name": "cloudshaped",
        "shits": 4,
        "activity": 0,
        "lastmsg": 3022
    }, {
        "id": 144015500974751740,
        "name": "Alexander Hamilton",
        "shits": 4,
        "activity": 0,
        "lastmsg": 8758
    }, {
        "id": "349513129538879490",
        "name": "bitch",
        "shits": 4,
        "activity": 803.1507860584461,
        "lastmsg": 115
    }, {
        "id": "326678360812158986",
        "name": "werewolf2814",
        "shits": 3,
        "activity": 0,
        "lastmsg": 10271
    }, {
        "id": "199339588790124546",
        "name": "Scoots",
        "shits": 3,
        "activity": 0,
        "lastmsg": 4316
    }, {
        "id": "215046363526725632",
        "name": "Draumr",
        "shits": 3,
        "activity": 0,
        "lastmsg": 846
    }, {
        "id": "252747964903063552",
        "name": "dumb",
        "shits": 3,
        "activity": 0,
        "lastmsg": 13369
    }, {
        "id": "259787857802035201",
        "name": "Floatie",
        "shits": 3,
        "activity": 2,
        "lastmsg": 56
    }, {
        "id": "332990864538468354",
        "name": "Free Man",
        "shits": 3,
        "activity": 0,
        "lastmsg": 10416
    }, {
        "id": "363425165536919552",
        "name": "abc",
        "shits": 3,
        "activity": 0,
        "lastmsg": 9058
    }, {
        "id": "327185764720836608",
        "name": "I'm NoT jUsT gAy I'm A cAtAmiTe.",
        "shits": 3,
        "activity": 0,
        "lastmsg": 873
    }, {
        "id": "385872274034524161",
        "name": "Samaaah",
        "shits": 3,
        "activity": 0,
        "lastmsg": 8355
    }, {
        "id": "196270492208988162",
        "name": "CREPS",
        "shits": 3,
        "activity": 0,
        "lastmsg": 1992
    }, {
        "id": "322273717612969987",
        "name": "Facepalm Marsh",
        "shits": 2,
        "activity": 0,
        "lastmsg": 2527
    }, {
        "id": "157241268991164416",
        "name": "Bnm",
        "shits": 2,
        "activity": 0,
        "lastmsg": 12333
    }, {
        "id": "335461949250863115",
        "name": "JaimeSimpson05",
        "shits": 2,
        "activity": 0,
        "lastmsg": 2082
    }, {
        "id": "278308356433772544",
        "name": "Kurt Cobain",
        "shits": 2,
        "activity": 0,
        "lastmsg": 4306
    }, {
        "id": "342086358010953728",
        "name": "KlausHeissler",
        "shits": 2,
        "activity": 8695.847372835122,
        "lastmsg": 5
    }, {
        "id": "119147779795714048",
        "name": "Pokefan993",
        "shits": 2,
        "activity": 0,
        "lastmsg": 12725
    }, {
        "id": "351781671844053004",
        "name": "boaredaoc",
        "shits": 2,
        "activity": 0,
        "lastmsg": 10939
    }, {
        "id": "395675681574354944",
        "name": "Cloyster//LunalaDalaShala",
        "shits": 2,
        "activity": 0,
        "lastmsg": 1728
    }, {
        "id": "315618699715411969",
        "name": "JamesRogers",
        "shits": 2,
        "activity": 0,
        "lastmsg": 8646
    }, {
        "id": "281033556833206272",
        "name": "Phin",
        "shits": 2,
        "activity": 1232.8698505656437,
        "lastmsg": 144
    }, {
        "id": "268936097399177218",
        "name": "angelkenny",
        "shits": 2,
        "activity": 472.9767268827857,
        "lastmsg": 1071
    }, {
        "id": "399732686908030997",
        "name": "Mr. Mantis",
        "shits": 2,
        "activity": 14,
        "lastmsg": 27
    }, {
        "id": "254751031001481216",
        "name": "stinky",
        "shits": 2,
        "activity": 249.10918944922096,
        "lastmsg": 1122
    }, {
        "id": 325285208805081100,
        "name": "SilverFoxtail",
        "shits": 2,
        "activity": 0,
        "lastmsg": 18099
    }, {
        "id": "234586765523025920",
        "name": "Vern",
        "shits": 2,
        "activity": 0,
        "lastmsg": 913
    }, {
        "id": "361206071253139457",
        "name": "Venhedis",
        "shits": 2,
        "activity": 1620.0499909437337,
        "lastmsg": 1220
    }, {
        "id": "346833866645962753",
        "name": "VATSman892",
        "shits": 2,
        "activity": 541.2469056914688,
        "lastmsg": 221
    }, {
        "id": "194634079197462529",
        "name": "A Loser Named Michael",
        "shits": 1,
        "activity": 0,
        "lastmsg": 2609
    }, {
        "id": "302317832807383041",
        "name": "From God's Perspective",
        "shits": 1,
        "activity": 0,
        "lastmsg": 4638
    }, {
        "id": "272336984104763393",
        "name": "☆ Savөк ☆",
        "shits": 1,
        "activity": 4.405613151731335,
        "lastmsg": 585
    }, {
        "id": "396344307902054401",
        "name": "Mr. Mantis",
        "shits": 1,
        "activity": 0,
        "lastmsg": 2316
    }, {
        "id": "302931516936290304",
        "name": "R A I N",
        "shits": 1,
        "activity": 38,
        "lastmsg": 136
    }, {
        "id": "377202675596394496",
        "name": "protocol",
        "shits": 1,
        "activity": 0,
        "lastmsg": 12913
    }, {
        "id": "282258121701720066",
        "name": "Gracie",
        "shits": 1,
        "activity": 0,
        "lastmsg": 8337
    }, {
        "id": "382852098057961496",
        "name": "Brendon",
        "shits": 1,
        "activity": 0,
        "lastmsg": 4457
    }, {
        "id": "382011429059821569",
        "name": "TheInkDemon678",
        "shits": 1,
        "activity": 0,
        "lastmsg": 8259
    }, {
        "id": "301123744796114944",
        "name": "「❝🍰🌹Coffee Scented Boyfriend🌹🍰❞」",
        "shits": 1,
        "activity": 0,
        "lastmsg": 1992
    }, {
        "id": "341127145801646080",
        "name": "Delereno",
        "shits": 1,
        "activity": 0,
        "lastmsg": 12917
    }, {
        "id": "204415305580150785",
        "name": "Blizix",
        "shits": 1,
        "activity": 4,
        "lastmsg": 314
    }, {
        "id": "195586396310732800",
        "name": "Neccria",
        "shits": 1,
        "activity": 0,
        "lastmsg": 7865
    }, {
        "id": "170773798918946816",
        "name": "TheRockzSG",
        "shits": 1,
        "activity": 0,
        "lastmsg": 15451
    }, {
        "id": "352947555501473793",
        "name": "Owl",
        "shits": 1,
        "activity": 0,
        "lastmsg": 12436
    }, {
        "id": "208603371710578688",
        "name": "CompressedWizard",
        "shits": 1,
        "activity": 0,
        "lastmsg": 14796
    }, {
        "id": "356941255579533313",
        "name": "A Dead Kenny",
        "shits": 1,
        "activity": 6,
        "lastmsg": 277
    }, {
        "id": "356138814332207104",
        "name": "Ducky Claus",
        "shits": 1,
        "activity": 0,
        "lastmsg": 11281
    }, {
        "id": "336842890527375363",
        "name": "Maya",
        "shits": 1,
        "activity": 0,
        "lastmsg": 7288
    }, {
        "id": "222749933588054016",
        "name": "Tintin",
        "shits": 1,
        "activity": 0,
        "lastmsg": 4967
    }, {
        "id": "364619266852388864",
        "name": "warmachinerox7192",
        "shits": 1,
        "activity": 0,
        "lastmsg": 5847
    }, {
        "id": "262979877005688832",
        "name": "Mr.SnowBones",
        "shits": 1,
        "activity": 8,
        "lastmsg": 1
    }, {
        "id": "276488010726637578",
        "name": "MayContainWheat",
        "shits": 1,
        "activity": 0,
        "lastmsg": 3056
    }, {
        "id": "264563883153293312",
        "name": "Shuichi",
        "shits": 1,
        "activity": 0,
        "lastmsg": 12089
    }, {
        "id": "164195026258231297",
        "name": "Stan Marsh",
        "shits": 1,
        "activity": 0,
        "lastmsg": 961
    }, {
        "id": "372462428690055169",
        "name": "betabot",
        "shits": 1,
        "activity": 650,
        "lastmsg": 16
    }, {
        "id": "221021977043795969",
        "name": "A Sad Sangheili",
        "shits": 1,
        "activity": 0,
        "lastmsg": 12161
    }, {
        "id": "133099495411023872",
        "name": "Nerd Letter",
        "shits": 1,
        "activity": 0,
        "lastmsg": 845
    }, {
        "id": "272713885155328000",
        "name": "The Confused Owp",
        "shits": 1,
        "activity": 0,
        "lastmsg": 964
    }, {
        "id": "306436950842146816",
        "name": "dead meme🤔",
        "shits": 1,
        "activity": 0,
        "lastmsg": 3987
    }, {
        "id": "290328985328549898",
        "name": "Felipe",
        "shits": 1,
        "activity": 0,
        "lastmsg": 8580
    }, {
        "id": "294093612029837323",
        "name": "Banjo Unleashed",
        "shits": 1,
        "activity": 0,
        "lastmsg": 16043
    }, {
        "id": "358652850047287296",
        "name": "furornocturna",
        "shits": 1,
        "activity": 0,
        "lastmsg": 4041
    }, {
        "id": "305815788894289941",
        "name": "RandomComrade",
        "shits": 1,
        "activity": 0,
        "lastmsg": 12374
    }, {
        "id": "210274015682494466",
        "name": "Philip_Daniel ('a=452.89)",
        "shits": 1,
        "activity": 0,
        "lastmsg": 6344
    }, {
        "id": "264088740375429121",
        "name": "GeraltOfEthiopia",
        "shits": 1,
        "activity": 0,
        "lastmsg": 15576
    }, {
        "id": 203602726892863500,
        "name": "!Zerobyte",
        "shits": 1,
        "activity": 0,
        "lastmsg": 18099
    }, {
        "id": "238704543196643328",
        "name": "MisterFireTango",
        "shits": 1,
        "activity": 46,
        "lastmsg": 164
    }, {
        "id": "248913176291180545",
        "name": "elijah",
        "shits": 1,
        "activity": 0,
        "lastmsg": 3525
    }, {
        "id": "140204090486423552",
        "name": "Dellen",
        "shits": 1,
        "activity": 0,
        "lastmsg": 16408
    }, {
        "id": "256545543398883329",
        "name": "randall",
        "shits": 1,
        "activity": 790.2178854258708,
        "lastmsg": 609
    }, {
        "id": "304819781838700546",
        "name": "Th3 R4nd0m P3rs0n",
        "shits": 1,
        "activity": 60,
        "lastmsg": 274
    }, {
        "id": "314587513018646529",
        "name": "[¿] Kenny McCormick [?]",
        "shits": 1,
        "activity": 0,
        "lastmsg": 10621
    }, {
        "id": "259939492922654721",
        "name": "freddyairmail",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11442
    }, {
        "id": "368618417684611072",
        "name": "zdub350",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14940
    }, {
        "id": "127206060904677376",
        "name": "evey119",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14929
    }, {
        "id": "299170703255535616",
        "name": "bunny",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7371
    }, {
        "id": "143866772360134656",
        "name": "Scarlet",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6866
    }, {
        "id": "194920411958476816",
        "name": "TGF",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14884
    }, {
        "id": "338403341455327242",
        "name": "A tua irmã de quatro",
        "shits": 0,
        "activity": 0,
        "lastmsg": 18085
    }, {
        "id": "131244146324144137",
        "name": "lilpumpkin2000",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14927
    }, {
        "id": "370800063427117059",
        "name": "Revvy",
        "shits": 0,
        "activity": 0,
        "lastmsg": 10871
    }, {
        "id": "215285904963665920",
        "name": "Ionic Ass Cannon",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12910
    }, {
        "id": "382201054043045888",
        "name": "pingQ",
        "shits": 0,
        "activity": 0,
        "lastmsg": 16376
    }, {
        "id": "313428733899964417",
        "name": "Hayleycakes2009",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14913
    }, {
        "id": "234518776454840320",
        "name": "ＺＵＣＣ",
        "shits": 0,
        "activity": 0,
        "lastmsg": 17971
    }, {
        "id": "371070223882780682",
        "name": "NoobVanNoob",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12872
    }, {
        "id": "364804540635152386",
        "name": "P0rtals",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6736
    }, {
        "id": "221803637591113729",
        "name": "smokeymicpot",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9262
    }, {
        "id": "201421675558862848",
        "name": "Gonso a secas",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9215
    }, {
        "id": "384489695238684673",
        "name": "The Space",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14524
    }, {
        "id": "293477659781103616",
        "name": "KDbeast42813",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14519
    }, {
        "id": "283285670795935745",
        "name": "Ilkay",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11363
    }, {
        "id": "340224253494558731",
        "name": "BlakeIsLIT",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11311
    }, {
        "id": "328367483775877120",
        "name": "loop",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9834
    }, {
        "id": "385827419610808340",
        "name": "Patrick",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14773
    }, {
        "id": "381575867672821760",
        "name": "Wonder Tweek",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14267
    }, {
        "id": "244240370450432001",
        "name": "Crystalpyg613",
        "shits": 0,
        "activity": 0,
        "lastmsg": 16753
    }, {
        "id": "158150240715800576",
        "name": "Shadok123",
        "shits": 0,
        "activity": 0,
        "lastmsg": 15039
    }, {
        "id": "220726653117136897",
        "name": "Saurav",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9486
    }, {
        "id": "329430391872159755",
        "name": "F.Dank",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14866
    }, {
        "id": "300947353060507648",
        "name": "Ray~Kun",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14189
    }, {
        "id": "361636825170706442",
        "name": "heyitsbailey",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14148
    }, {
        "id": "323413101149945857",
        "name": "Hey",
        "shits": 0,
        "activity": 0,
        "lastmsg": 17853
    }, {
        "id": "173275217722998786",
        "name": "Edgar",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12927
    }, {
        "id": "395167253533818880",
        "name": "waqasvic",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2285
    }, {
        "id": "330463266918629376",
        "name": "Sk8tr b0i",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4687
    }, {
        "id": "142885328724819969",
        "name": "Samurai",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14014
    }, {
        "id": "306529134744436746",
        "name": "PrincessYana",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4871
    }, {
        "id": "96373682871492608",
        "name": "Hexxie 🍒",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2574
    }, {
        "id": "394912617400893451",
        "name": "TheCoolKid",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1747
    }, {
        "id": "348989621742600194",
        "name": "Eli",
        "shits": 0,
        "activity": 0,
        "lastmsg": 16722
    }, {
        "id": "321808794160070657",
        "name": "el barmo",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2331
    }, {
        "id": "199740565753954304",
        "name": "Centrist16",
        "shits": 0,
        "activity": 0,
        "lastmsg": 13770
    }, {
        "id": "265547706905264152",
        "name": "oncelier",
        "shits": 0,
        "activity": 0,
        "lastmsg": 13763
    }, {
        "id": "399391251717160960",
        "name": "JOJ0STAR",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3673
    }, {
        "id": "371143800590041089",
        "name": "Jarabe",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11226
    }, {
        "id": "399997184595984395",
        "name": "Captain Hook",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3247
    }, {
        "id": "148969884615704576",
        "name": "saku",
        "shits": 0,
        "activity": 3.8901958767854685,
        "lastmsg": 587
    }, {
        "id": "314099741459873802",
        "name": "Poke/Professer Chaos",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1778
    }, {
        "id": "327238996683915267",
        "name": "K1NG L0P3Z",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8639
    }, {
        "id": "165350085683576832",
        "name": "Shira-DT",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2605
    }, {
        "id": "272986016242204672",
        "name": "nathanielcwm",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14761
    }, {
        "id": "356560547245981697",
        "name": "leodood",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4322
    }, {
        "id": "337082933733097474",
        "name": "Kathiyar",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12856
    }, {
        "id": "253691181970489344",
        "name": "×+",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2226
    }, {
        "id": "401512902101827605",
        "name": "Gothguy7989",
        "shits": 0,
        "activity": 12,
        "lastmsg": 87
    }, {
        "id": "369888521797894165",
        "name": "StickyBlues",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1810
    }, {
        "id": "230748237206650880",
        "name": "Zando",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1583
    }, {
        "id": "174253045096382474",
        "name": "Mathep",
        "shits": 0,
        "activity": 0,
        "lastmsg": 879
    }, {
        "id": "209192627306889216",
        "name": "Habri",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12873
    }, {
        "id": "365957462333063170",
        "name": "Alexdewa",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7419
    }, {
        "id": "341052233929981953",
        "name": "pee pee",
        "shits": 0,
        "activity": 0,
        "lastmsg": 905
    }, {
        "id": "342135357233430528",
        "name": "Festive Toast n' Jam",
        "shits": 0,
        "activity": 0,
        "lastmsg": 17828
    }, {
        "id": "66021750319620096",
        "name": "Tobled",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12889
    }, {
        "id": "321484369145495552",
        "name": "Kumama",
        "shits": 0,
        "activity": 60,
        "lastmsg": 344
    }, {
        "id": "308665976231165953",
        "name": "pokemonmaster!",
        "shits": 0,
        "activity": 336.27431845352595,
        "lastmsg": 13
    }, {
        "id": "174961449330802689",
        "name": "Ricky",
        "shits": 0,
        "activity": 0,
        "lastmsg": 902
    }, {
        "id": "295721447995736064",
        "name": "jka0004",
        "shits": 0,
        "activity": 0,
        "lastmsg": 16707
    }, {
        "id": "175361312484884482",
        "name": "corylulu",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12888
    }, {
        "id": "348292774870908929",
        "name": "axoloto",
        "shits": 0,
        "activity": 0,
        "lastmsg": 951
    }, {
        "id": "324864375817240577",
        "name": "hatrack",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12777
    }, {
        "id": "107560034455543808",
        "name": "Midnight",
        "shits": 0,
        "activity": 0,
        "lastmsg": 17229
    }, {
        "id": "308362412908871682",
        "name": "Highlandcatt",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11355
    }, {
        "id": "292497046353477633",
        "name": "Kae",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12761
    }, {
        "id": "268650976460668929",
        "name": "somevietlove",
        "shits": 0,
        "activity": 0,
        "lastmsg": 15246
    }, {
        "id": "349149314372861953",
        "name": "MateiTheSouthParkFan",
        "shits": 0,
        "activity": 0,
        "lastmsg": 13998
    }, {
        "id": "111910654452989952",
        "name": "RosstheBossy",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12910
    }, {
        "id": "366750726640107520",
        "name": "dieandfuckingloveme",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11771
    }, {
        "id": "202967811285450752",
        "name": "HyyDee",
        "shits": 0,
        "activity": 0,
        "lastmsg": 16603
    }, {
        "id": "254243953828823041",
        "name": "yuri",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12440
    }, {
        "id": "286268252730949633",
        "name": "The Great Garbo",
        "shits": 0,
        "activity": 0,
        "lastmsg": 17304
    }, {
        "id": "295577134259240962",
        "name": "bkr121",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12414
    }, {
        "id": "171493147292073984",
        "name": "Syntrick",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11179
    }, {
        "id": "308912385325006848",
        "name": "DragonFart",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12146
    }, {
        "id": "336851422639554560",
        "name": "Policeman Craig",
        "shits": 0,
        "activity": 120,
        "lastmsg": 24
    }, {
        "id": "300373645555924993",
        "name": "MCMAYNERBERRY",
        "shits": 0,
        "activity": 0,
        "lastmsg": 16684
    }, {
        "id": "382245126409551873",
        "name": "LORDE",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2287
    }, {
        "id": "173866620844900352",
        "name": "jokerj4513",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9736
    }, {
        "id": "286242060271484928",
        "name": "nuke",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2933
    }, {
        "id": "213402490752729089",
        "name": "victorREZNOV12",
        "shits": 0,
        "activity": 0,
        "lastmsg": 17258
    }, {
        "id": "273558514784403466",
        "name": "•sad-cormick•",
        "shits": 0,
        "activity": 0,
        "lastmsg": 802
    }, {
        "id": "288988292588896256",
        "name": "Catharsis",
        "shits": 0,
        "activity": 0,
        "lastmsg": 942
    }, {
        "id": "293891845908594689",
        "name": "bluh",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6011
    }, {
        "id": "212027945211002880",
        "name": "Dexter (Kitkat)",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9450
    }, {
        "id": "387263906508308500",
        "name": "Ice....",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11989
    }, {
        "id": "311676229898076170",
        "name": "Master Assassin",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12104
    }, {
        "id": "223967777898102784",
        "name": "emithecheme",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12577
    }, {
        "id": "126131102153834497",
        "name": "Δbility",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12507
    }, {
        "id": "98542850995650560",
        "name": "slat3",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12907
    }, {
        "id": "247338595839377418",
        "name": "Samuel_420",
        "shits": 0,
        "activity": 0,
        "lastmsg": 13074
    }, {
        "id": "237825448862547978",
        "name": "....🥃",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12196
    }, {
        "id": "220010763593580545",
        "name": "pornjesus",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12426
    }, {
        "id": "186877285771509761",
        "name": "irene",
        "shits": 0,
        "activity": 0,
        "lastmsg": 16598
    }, {
        "id": "281967911680081923",
        "name": "the bard",
        "shits": 0,
        "activity": 0,
        "lastmsg": 15248
    }, {
        "id": "318211176930738177",
        "name": "4in",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9636
    }, {
        "id": "262354819652517888",
        "name": "Gook Jr.",
        "shits": 0,
        "activity": 0,
        "lastmsg": 15245
    }, {
        "id": "230841624685445120",
        "name": "Ben | Gongon",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1488
    }, {
        "id": "177092979155140608",
        "name": "Star 🎄",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9510
    }, {
        "id": "322586251280515082",
        "name": "Beth.",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11010
    }, {
        "id": "195206033558339584",
        "name": "Surgt11",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11880
    }, {
        "id": "135821957844172800",
        "name": "Poker1st",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11487
    }, {
        "id": "250366258741116928",
        "name": "Shmow",
        "shits": 0,
        "activity": 8,
        "lastmsg": 285
    }, {
        "id": "315285185778155522",
        "name": "eGg eGgg eGggg",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4622
    }, {
        "id": "197336283176108032",
        "name": "Syncro37",
        "shits": 0,
        "activity": 0,
        "lastmsg": 10921
    }, {
        "id": "250235216155639808",
        "name": "Husk le Pups",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11163
    }, {
        "id": "352605872704192513",
        "name": "TheShareBear",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9194
    }, {
        "id": "192806211534585856",
        "name": "shiki",
        "shits": 0,
        "activity": 0,
        "lastmsg": 17035
    }, {
        "id": "133950904226414593",
        "name": "Quaxo",
        "shits": 0,
        "activity": 0,
        "lastmsg": 16429
    }, {
        "id": "164752496982491136",
        "name": "The Christmas Egg",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9546
    }, {
        "id": "199762100183105536",
        "name": "Yuriprime",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9974
    }, {
        "id": "327292206354399235",
        "name": "ducc",
        "shits": 0,
        "activity": 0,
        "lastmsg": 16632
    }, {
        "id": "343417573880102912",
        "name": "Cookie",
        "shits": 0,
        "activity": 0,
        "lastmsg": 17244
    }, {
        "id": "374270368522698753",
        "name": "BlueSah89",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14930
    }, {
        "id": "173168799506235392",
        "name": "Craig Tucker",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9700
    }, {
        "id": "363857633998012416",
        "name": "Sophelia",
        "shits": 0,
        "activity": 24,
        "lastmsg": 544
    }, {
        "id": "333162055542767619",
        "name": "najen",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14233
    }, {
        "id": "281550411058642946",
        "name": "Xor",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8462
    }, {
        "id": "347502445103939586",
        "name": "PinkPawedProductions",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9939
    }, {
        "id": "294613651808190464",
        "name": "She's the one I love",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6757
    }, {
        "id": "155149108183695360",
        "name": "Dyno",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14721
    }, {
        "id": "316372939157012481",
        "name": "Witt",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9505
    }, {
        "id": "248958355996016662",
        "name": "Noerdy",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11488
    }, {
        "id": "292562717527506944",
        "name": "PurpleShlurp",
        "shits": 0,
        "activity": 0,
        "lastmsg": 15972
    }, {
        "id": "144872569525239809",
        "name": "nitroyoshi9",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2333
    }, {
        "id": "330044916216365056",
        "name": "Micavolg2344",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9528
    }, {
        "id": "314917673123446786",
        "name": "Alkalye",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3213
    }, {
        "id": "255764664938528784",
        "name": "1998CR",
        "shits": 0,
        "activity": 8.152496874088712,
        "lastmsg": 586
    }, {
        "id": "253903514391150592",
        "name": "That One South Park Fan",
        "shits": 0,
        "activity": 0,
        "lastmsg": 10064
    }, {
        "id": "396468761311313931",
        "name": "fandom queer trash",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6315
    }, {
        "id": "391393163186798594",
        "name": "Bitterra",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1974
    }, {
        "id": "349968272738877440",
        "name": "Blu Haired Boi",
        "shits": 0,
        "activity": 0,
        "lastmsg": 16155
    }, {
        "id": "307976961064435713",
        "name": "RedBot",
        "shits": 0,
        "activity": 0,
        "lastmsg": 17857
    }, {
        "id": "181370713817612289",
        "name": "Kawa",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9136
    }, {
        "id": "389259207750451201",
        "name": "csensang",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9685
    }, {
        "id": "324313543753203723",
        "name": "GhostCPYT",
        "shits": 0,
        "activity": 0,
        "lastmsg": 17245
    }, {
        "id": "374108952746786818",
        "name": "Tweak",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8767
    }, {
        "id": "148170360406147075",
        "name": "Seaner23",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2609
    }, {
        "id": "333369502026956802",
        "name": "fat",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1540
    }, {
        "id": "305792949193539584",
        "name": "Max is Festive",
        "shits": 0,
        "activity": 0,
        "lastmsg": 15648
    }, {
        "id": "331010622760288257",
        "name": "Xheraldo",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3865
    }, {
        "id": "390208355873849355",
        "name": "Perroloco",
        "shits": 0,
        "activity": 0,
        "lastmsg": 9283
    }, {
        "id": "331766123924160533",
        "name": "Rodent",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7615
    }, {
        "id": "169152171873533952",
        "name": "why",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14490
    }, {
        "id": "190837075183009792",
        "name": "Lightning",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14784
    }, {
        "id": "289829303565156353",
        "name": "feliz hannkuah",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8028
    }, {
        "id": "373089771771396099",
        "name": "FrightfulDread",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1382
    }, {
        "id": "248084943522103296",
        "name": "Katsura",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2609
    }, {
        "id": "388838167119396864",
        "name": "CreekShipper64",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7258
    }, {
        "id": "104984717891223552",
        "name": "2th",
        "shits": 0,
        "activity": 156.40561315173133,
        "lastmsg": 242
    }, {
        "id": "271410220419383297",
        "name": "LimeFlavouredLibertarian24",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4428
    }, {
        "id": "255472639261409281",
        "name": "Nappy",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3543
    }, {
        "id": "156564558368997376",
        "name": "boop",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5868
    }, {
        "id": "270343911581417482",
        "name": "blizz",
        "shits": 0,
        "activity": 0,
        "lastmsg": 7736
    }, {
        "id": "330672414880956419",
        "name": "Bubbly",
        "shits": 0,
        "activity": 0,
        "lastmsg": 18051
    }, {
        "id": "267907982115864576",
        "name": "Ryan eats 20 peppers and dies",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4802
    }, {
        "id": "383370313611870218",
        "name": "Magnet Cloud",
        "shits": 0,
        "activity": 0,
        "lastmsg": 13769
    }, {
        "id": "216377334431744004",
        "name": "Mengo",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4902
    }, {
        "id": "67773365326184448",
        "name": "Meoin",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14934
    }, {
        "id": "202609552804282368",
        "name": "Karachoice07",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1637
    }, {
        "id": "267056064527073280",
        "name": "Ice",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8924
    }, {
        "id": "156055487618482176",
        "name": "🎄 マフィン 🍊",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14540
    }, {
        "id": "352657542452609024",
        "name": "tit slit",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12899
    }, {
        "id": "334785919674613761",
        "name": "Kylie The Badass Ginger",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5828
    }, {
        "id": "352452842801332226",
        "name": "Jelly",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5120
    }, {
        "id": "245408198713016320",
        "name": "Mysterion?",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14924
    }, {
        "id": "395727962512556033",
        "name": "jesuiskelli",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4493
    }, {
        "id": "262071124463058944",
        "name": "Ghostler",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2609
    }, {
        "id": "227482342309101568",
        "name": "what the FUCK is up kyle",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6012
    }, {
        "id": "195968053123481601",
        "name": "Jay Frost",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14432
    }, {
        "id": "381481841636671498",
        "name": "Shanmalon",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6271
    }, {
        "id": "323190010964869120",
        "name": "фHiф",
        "shits": 0,
        "activity": 0,
        "lastmsg": 16999
    }, {
        "id": "379142078048894976",
        "name": "MLGesus",
        "shits": 0,
        "activity": 42.22790638024584,
        "lastmsg": 598
    }, {
        "id": "273864312206917634",
        "name": "Wheatley",
        "shits": 0,
        "activity": 128,
        "lastmsg": 309
    }, {
        "id": "192752976606003201",
        "name": "LANES",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6029
    }, {
        "id": "369188529965760535",
        "name": "!.[!Heidi Turner].!",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1765
    }, {
        "id": "168758473587163137",
        "name": "Oneironaut",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14677
    }, {
        "id": "297737269140389888",
        "name": "DoorKnobCum4938",
        "shits": 0,
        "activity": 0,
        "lastmsg": 13198
    }, {
        "id": "368352414409162752",
        "name": "Abeldor",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14270
    }, {
        "id": "307446347559206922",
        "name": "skankhunt42",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14233
    }, {
        "id": "325600863865274379",
        "name": "Mieon (≚ᄌ≚)ƶƵ",
        "shits": 0,
        "activity": 0,
        "lastmsg": 17330
    }, {
        "id": "377183753061138444",
        "name": "jazzeuopho",
        "shits": 0,
        "activity": 0,
        "lastmsg": 13636
    }, {
        "id": "280425545886597131",
        "name": "Super Adam",
        "shits": 0,
        "activity": 0,
        "lastmsg": 10995
    }, {
        "id": "320130681265192960",
        "name": "OPERA",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8560
    }, {
        "id": "229183531006296064",
        "name": "Yasoran",
        "shits": 0,
        "activity": 0,
        "lastmsg": 17681
    }, {
        "id": "104747875782660096",
        "name": "Sorathomos",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2605
    }, {
        "id": "258397522207178753",
        "name": "Wyatt",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12917
    }, {
        "id": "357552726789324800",
        "name": "Spirit Chan",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3239
    }, {
        "id": "262655459658432514",
        "name": "Travall",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5758
    }, {
        "id": "321584659911933952",
        "name": "StayInDrugsAndDontGoToSchoolKids",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1061
    }, {
        "id": "205744975663595520",
        "name": "Bananazcakies",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5262
    }, {
        "id": "346325792399032323",
        "name": "Freddie \"SJFreak\"",
        "shits": 0,
        "activity": 118,
        "lastmsg": 63
    }, {
        "id": "225049951032311808",
        "name": "Robin ✨",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5340
    }, {
        "id": "248023454928994315",
        "name": "absof/bert",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5305
    }, {
        "id": "262251455510085632",
        "name": "Dr.Flug",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4132
    }, {
        "id": "272395601591664640",
        "name": "kenny mccormic/ mysterion",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2610
    }, {
        "id": "297914902163488768",
        "name": "Germ",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5130
    }, {
        "id": "376939941638176770",
        "name": "Butters the Futa King",
        "shits": 0,
        "activity": 0,
        "lastmsg": 16395
    }, {
        "id": "280844846904770561",
        "name": "Woodland Critters",
        "shits": 0,
        "activity": 14,
        "lastmsg": 306
    }, {
        "id": "330193848137678848",
        "name": "Raven",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1285
    }, {
        "id": "372357341758226443",
        "name": "Craig Tucker / super craig",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2684
    }, {
        "id": "313466406563872769",
        "name": "theboss",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1960
    }, {
        "id": "248977438191648769",
        "name": "2ndparty",
        "shits": 0,
        "activity": 0,
        "lastmsg": 13808
    }, {
        "id": "363003387031191553",
        "name": "Xero",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11223
    }, {
        "id": "244141448142782474",
        "name": "avacadoloki",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2605
    }, {
        "id": "256379238230392833",
        "name": "pure irony",
        "shits": 0,
        "activity": 0,
        "lastmsg": 13325
    }, {
        "id": "214584733395451905",
        "name": "merry birbmas",
        "shits": 0,
        "activity": 151.55303941483123,
        "lastmsg": 274
    }, {
        "id": "326045308184166400",
        "name": "Tweek Tweak",
        "shits": 0,
        "activity": 0,
        "lastmsg": 16457
    }, {
        "id": "336280106198630400",
        "name": "Croissant ( ͡~ ͜ʖ ͡°)",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2605
    }, {
        "id": "272862527900221440",
        "name": "rikkun",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14009
    }, {
        "id": "215651576356929546",
        "name": "l1nka7",
        "shits": 0,
        "activity": 1884.8416705680493,
        "lastmsg": 645
    }, {
        "id": "372155002396868614",
        "name": "ＷＩＺＡＲＤ",
        "shits": 0,
        "activity": 3220,
        "lastmsg": 42
    }, {
        "id": "133046540074876929",
        "name": "Tyeiz",
        "shits": 0,
        "activity": 0,
        "lastmsg": 13498
    }, {
        "id": "372696152929468417",
        "name": "red_daedra",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4346
    }, {
        "id": "115459908215767041",
        "name": "TheAveragePxtseryu",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4276
    }, {
        "id": "357294876058189825",
        "name": "WizardIllusion",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1111
    }, {
        "id": "275754534285082624",
        "name": "himiko",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14420
    }, {
        "id": "300686182021332992",
        "name": "Jamey - Inactive On Discord",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3937
    }, {
        "id": "281699315930628097",
        "name": "GreenB_Techman🐎",
        "shits": 0,
        "activity": 0,
        "lastmsg": 3821
    }, {
        "id": "361498162378047488",
        "name": "A Silent Night 2 Remember",
        "shits": 0,
        "activity": 0,
        "lastmsg": 15170
    }, {
        "id": "145181137197596672",
        "name": "POWER",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4065
    }, {
        "id": "143772403829309440",
        "name": "tarm",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2598
    }, {
        "id": "384236051952173056",
        "name": "kyle",
        "shits": 0,
        "activity": 0,
        "lastmsg": 15514
    }, {
        "id": "328975199926222848",
        "name": "phantomtroupe99",
        "shits": 0,
        "activity": 0,
        "lastmsg": 4614
    }, {
        "id": "316768012407668756",
        "name": "Girble",
        "shits": 0,
        "activity": 0,
        "lastmsg": 16010
    }, {
        "id": "178850358452289538",
        "name": "Cass",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2951
    }, {
        "id": "399988960354500609",
        "name": "AWESOM-O Developers",
        "shits": 0,
        "activity": 0,
        "lastmsg": 841
    }, {
        "id": "107810822859821056",
        "name": "swiggaswayslit",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14708
    }, {
        "id": "257907655002030080",
        "name": "Az-coder",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1354
    }, {
        "id": "257126987066376202",
        "name": "Trash panda",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2708
    }, {
        "id": "145284235354308608",
        "name": "definiteely",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14230
    }, {
        "id": "227887535748153346",
        "name": "Kit",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2889
    }, {
        "id": "375102731993743360",
        "name": "danny devito",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2005
    }, {
        "id": "138515790029783041",
        "name": "samuel",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2609
    }, {
        "id": "245745641022554112",
        "name": "RSTvidya",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2609
    }, {
        "id": "304980605207183370",
        "name": "Sigma",
        "shits": 0,
        "activity": 0,
        "lastmsg": 8573
    }, {
        "id": "256649934722301955",
        "name": "Ardentis",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2336
    }, {
        "id": "106466168063176704",
        "name": "rattus",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2333
    }, {
        "id": "224661038216249345",
        "name": "Lord Foxy Boy",
        "shits": 0,
        "activity": 0,
        "lastmsg": 16277
    }, {
        "id": "162608595966492672",
        "name": "Alex_The_Geat2",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2265
    }, {
        "id": "368984815174680577",
        "name": "SouthPark_CreekFan",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2292
    }, {
        "id": "282229456964419584",
        "name": "SpaceBoy",
        "shits": 0,
        "activity": 0,
        "lastmsg": 2115
    }, {
        "id": "219941104189964289",
        "name": "Infadull",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1738
    }, {
        "id": "208236738915598337",
        "name": "i watch too much cartoons",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1648
    }, {
        "id": "397306538949214209",
        "name": "ImperfectApollo",
        "shits": 0,
        "activity": 652,
        "lastmsg": 153
    }, {
        "id": "326728154511048708",
        "name": "Noka",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12488
    }, {
        "id": "298610959335948289",
        "name": "Scancilen",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12996
    }, {
        "id": "316569538789638146",
        "name": "koeru",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1854
    }, {
        "id": "293884532753432587",
        "name": "SW1774",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14893
    }, {
        "id": "297544042718298125",
        "name": "necks_lvl",
        "shits": 0,
        "activity": 0,
        "lastmsg": 6290
    }, {
        "id": "252303783785136138",
        "name": "Zipphy",
        "shits": 0,
        "activity": 0,
        "lastmsg": 11426
    }, {
        "id": "243163105834696705",
        "name": "Dantelukas",
        "shits": 0,
        "activity": 203.38006232095105,
        "lastmsg": 632
    }, {
        "id": "327862719392776194",
        "name": "itsyaboyjp",
        "shits": 0,
        "activity": 202,
        "lastmsg": 15
    }, {
        "id": "367677246040702976",
        "name": "haru mystery-u",
        "shits": 0,
        "activity": 37.82285852838879,
        "lastmsg": 507
    }, {
        "id": "392321014551281665",
        "name": "Archie",
        "shits": 0,
        "activity": 0,
        "lastmsg": 1289
    }, {
        "id": "93766974877741056",
        "name": "meowzzies",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14690
    }, {
        "id": "173525714409226240",
        "name": "DaimeowSparklez",
        "shits": 0,
        "activity": 0,
        "lastmsg": 14616
    }, {
        "id": "383164960509001740",
        "name": "Cu-Miun",
        "shits": 0,
        "activity": 0,
        "lastmsg": 17137
    }, {
        "id": "368879871239389184",
        "name": "Cloudy",
        "shits": 0,
        "activity": 0,
        "lastmsg": 923
    }, {
        "id": "283348709595676674",
        "name": "Jazzles",
        "shits": 0,
        "activity": 0,
        "lastmsg": 873
    }, {
        "id": "403468834415312896",
        "name": "butters 💕",
        "shits": 0,
        "activity": 39.16815088462658,
        "lastmsg": 696
    }, {
        "id": "254764670806654977",
        "name": "bigmat526",
        "shits": 0,
        "activity": 92,
        "lastmsg": 74
    }, {
        "id": "388165140152844288",
        "name": "pickwickjesus",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12911
    }, {
        "id": "189569939991035904",
        "name": "aaron",
        "shits": 0,
        "activity": 382,
        "lastmsg": 560
    }, {
        "id": "202572103059243021",
        "name": "doctor Eleven",
        "shits": 0,
        "activity": 6,
        "lastmsg": 313
    }, {
        "id": "273268037837127690",
        "name": "MonstoBusta2000",
        "shits": 0,
        "activity": 0,
        "lastmsg": 5434
    }, {
        "id": "139478949779603465",
        "name": "Dank Tree",
        "shits": 0,
        "activity": 0,
        "lastmsg": 12909
    }, {
        "id": "380386997350432768",
        "name": "Pyxus",
        "shits": 0,
        "activity": 82,
        "lastmsg": 50
    }, {
        "id": "304492680178827265",
        "name": "jimbeaux",
        "shits": 0,
        "activity": 2,
        "lastmsg": 63
    }, {
        "id": "342377686422913025",
        "name": "MrDreamTheater2",
        "shits": 1,
        "activity": 4,
        "lastmsg": 52
    }, {
        "id": "268768664411439115",
        "name": "MauriceX",
        "shits": 0,
        "activity": 18,
        "lastmsg": 8
    }]
};

router.get("/leaderboards/legacy", (req, res) => {

    if (!req.user.currentGuild) {
        res.render("dashboard/noselect");
        return;
    }

    Server.findById(req.user.currentGuild, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/leaderboards-legacy", { user: req.user, server: server, legacy: temp });
    });
});

router.get("/moderation", (req, res) => {

    if (!req.user.currentGuild) {
        res.render("dashboard/noselect");
        return;
    }

    const guild = req.user.guilds.find(e => {
        return e.id == req.user.currentGuild;
    });
    if (!guild) {
        res.send("Error: the devs fucked up! Blame !Dragon1320 for this.");
    }
    if (!(guild.permissions & 32)) {
        res.render("dashboard/notmod");
        return;
    }

    Server.findById(req.user.currentGuild, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/moderation", { user: req.user, server: server });
    });
});

router.get("/music", (req, res) => {

    if (!req.user.currentGuild) {
        res.render("dashboard/noselect");
        return;
    }

    Server.findById(req.user.currentGuild, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/music", { user: req.user, server: server });
    });
});

router.get("/stats", (req, res) => {

    if (!req.user.currentGuild) {
        res.render("dashboard/noselect");
        return;
    }

    Server.findById(req.user.currentGuild, (err, server) => {
        if (err) {
            res.send(err);
        }

        res.render("dashboard/stats", { user: req.user, server: server });
    });
});

router.get("/:server_id", (req, res, next) => {

    if (parseInt(req.params.server_id)) {

        req.user.currentGuild = req.params.server_id;
        res.redirect("/dashboard/home");
    } else {

        return next();
    }
});

module.exports = router;