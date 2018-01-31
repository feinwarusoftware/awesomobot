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
        "total": 5713,
        "list": [{
            "id": "174754869595471873",
            "name": "ButterScotch Kyrion",
            "shits": 611,
            "activity": 98374
        }, {
            "id": "331641326816854028",
            "name": "Goth Tweek",
            "shits": 517,
            "activity": 77914
        }, {
            "id": 168232762862600200,
            "name": "kratosgow342",
            "shits": 475,
            "activity": 67304
        }, {
            "id": 217486439380811780,
            "name": "canadian piss",
            "shits": 461,
            "activity": 32259
        }, {
            "id": "228887919689990144",
            "name": "NitroSage",
            "shits": 422,
            "activity": 68414
        }, {
            "id": 168690518899949570,
            "name": "!Dragon1320",
            "shits": 239,
            "activity": 14971
        }, {
            "id": "385149322716643348",
            "name": "Stfu",
            "shits": 217,
            "activity": 11394
        }, {
            "id": 262345465306021900,
            "name": "TowelRoyale",
            "shits": 216,
            "activity": 55185
        }, {
            "id": 191579984274522100,
            "name": "Bell",
            "shits": 200,
            "activity": 30024
        }, {
            "id": 190914446774763520,
            "name": "Mattheous",
            "shits": 163,
            "activity": 17279
        }, {
            "id": "142896162955984896",
            "name": "Goth CSI.",
            "shits": 158,
            "activity": 20058
        }, {
            "id": "99626024181968896",
            "name": "Airborn56",
            "shits": 152,
            "activity": 15744
        }, {
            "id": "215982178046181376",
            "name": "Tweekerino",
            "shits": 135,
            "activity": 51920
        }, {
            "id": "198005882586398721",
            "name": "Durr tea kem | children eggs™",
            "shits": 120,
            "activity": 28220
        }, {
            "id": "312808956340731905",
            "name": "6king Ashe",
            "shits": 110,
            "activity": 9803
        }, {
            "id": 230875863644635140,
            "name": "Fa99les",
            "shits": 100,
            "activity": 25114
        }, {
            "id": "375586532527964160",
            "name": "utbvm9",
            "shits": 85,
            "activity": 10095
        }, {
            "id": "275397087485755392",
            "name": "Annierror",
            "shits": 82,
            "activity": 13616
        }, {
            "id": "395090104491966474",
            "name": "officalchespiny",
            "shits": 68,
            "activity": 13968
        }, {
            "id": "355901469804855297",
            "name": "Made an attempt",
            "shits": 62,
            "activity": 7016,
            "lastmsg": 273
        }, {
            "id": "277581652484554752",
            "name": "dany, the tweek enthusiast",
            "shits": 55,
            "activity": 7988
        }, {
            "id": "280031103761514507",
            "name": "Stratagem",
            "shits": 50,
            "activity": 18477
        }, {
            "id": "213884331838406656",
            "name": "Kyle Schwartz",
            "shits": 49,
            "activity": 22112
        }, {
            "id": "372758178321924108",
            "name": "o r a n g",
            "shits": 46,
            "activity": 1866
        }, {
            "id": "201014010395623424",
            "name": "stan darsh",
            "shits": 42,
            "activity": 4187
        }, {
            "id": 194652191896764400,
            "name": "kiyo (craig)",
            "shits": 35,
            "activity": 940
        }, {
            "id": "117783098623655936",
            "name": "Fenny",
            "shits": 35,
            "activity": 6298
        }, {
            "id": "170229410014822400",
            "name": "Brizzlefrocter",
            "shits": 32,
            "activity": 0
        }, {
            "id": "296211279083995136",
            "name": "0utofbody",
            "shits": 29,
            "activity": 5200
        }, {
            "id": "319999952350740481",
            "name": "why tf do you look at my name",
            "shits": 28,
            "activity": 3156
        }, {
            "id": "198687342079246336",
            "name": "Sinnamo'omnf",
            "shits": 26,
            "activity": 8179
        }, {
            "id": "171798358153887744",
            "name": "(Mako)",
            "shits": 24,
            "activity": 9352
        }, {
            "id": "157615456826556416",
            "name": "Engikirby",
            "shits": 20,
            "activity": 10734
        }, {
            "id": "273409276725166081",
            "name": "Carrie Enright",
            "shits": 19,
            "activity": 0
        }, {
            "id": "228561869852508172",
            "name": "Lei",
            "shits": 18,
            "activity": 0
        }, {
            "id": "326447343840788480",
            "name": "Noice",
            "shits": 18,
            "activity": 4138
        }, {
            "id": "345336838376128512",
            "name": "gAH AAAAAAA",
            "shits": 17,
            "activity": 3020.2360914668166,
            "lastmsg": 196
        }, {
            "id": "150687833353486337",
            "name": "ag fucj aka endless nameless",
            "shits": 17,
            "activity": 0
        }, {
            "id": "307248302397718529",
            "name": "Grajowiec",
            "shits": 17,
            "activity": 2316
        }, {
            "id": "270588978741116938",
            "name": "Kyle",
            "shits": 16,
            "activity": 3811
        }, {
            "id": "329020358911066113",
            "name": "yes, definitely, absolutely.",
            "shits": 16,
            "activity": 4228.44109778791,
            "lastmsg": 198
        }, {
            "id": "349513129538879490",
            "name": "Elly",
            "shits": 15,
            "activity": 2233
        }, {
            "id": "303133450796400642",
            "name": "shanny",
            "shits": 14,
            "activity": 0
        }, {
            "id": 349886534989643800,
            "name": "WonderTweek",
            "shits": 14,
            "activity": 5371
        }, {
            "id": 220257478296862720,
            "name": "Ravus פון מאַראַנץ",
            "shits": 14,
            "activity": 21
        }, {
            "id": "383901109288173568",
            "name": "Zoewie",
            "shits": 13,
            "activity": 2409
        }, {
            "id": "219562678371352577",
            "name": "UmbreonRogue",
            "shits": 13,
            "activity": 32
        }, {
            "id": 122649425062395900,
            "name": "Ghost Ryder",
            "shits": 13,
            "activity": 8027
        }, {
            "id": "164195026258231297",
            "name": "Kenny McCormick",
            "shits": 13,
            "activity": 3664
        }, {
            "id": "299075711983943681",
            "name": "Xeno",
            "shits": 12,
            "activity": 292
        }, {
            "id": "226106120446541824",
            "name": "Lextreme",
            "shits": 11,
            "activity": 908.7846527702945,
            "lastmsg": 387
        }, {
            "id": "242044514255110145",
            "name": "OOFthatsroughbuddy",
            "shits": 10,
            "activity": 0
        }, {
            "id": "254381166700920832",
            "name": "Detective Sandy Vagina",
            "shits": 9,
            "activity": 4584
        }, {
            "id": "161573813379792899",
            "name": "Wonderful Tweek",
            "shits": 9,
            "activity": 29182
        }, {
            "id": "319941812230029312",
            "name": "vit",
            "shits": 8,
            "activity": 0,
            "lastmsg": 1681
        }, {
            "id": "158971865392611328",
            "name": "Wokesy",
            "shits": 8,
            "activity": 0
        }, {
            "id": "248950499150266369",
            "name": "BaconTheUber",
            "shits": 8,
            "activity": 0
        }, {
            "id": "267818273389674497",
            "name": "Icy Boi",
            "shits": 7,
            "activity": 0,
            "lastmsg": 4500
        }, {
            "id": "230502782623285248",
            "name": "Kyle",
            "shits": 6,
            "activity": 2708.434730205927,
            "lastmsg": 185
        }, {
            "id": "397306538949214209",
            "name": "Weak noodle arm gal",
            "shits": 6,
            "activity": 960
        }, {
            "id": "233832353468907521",
            "name": "Polnareff",
            "shits": 5,
            "activity": 2578.8806026505536,
            "lastmsg": 1
        }, {
            "id": "346750957373227029",
            "name": "cloudshaped",
            "shits": 4,
            "activity": 0,
            "lastmsg": 4141
        }, {
            "id": "277338703884582923",
            "name": "Polterpup",
            "shits": 4,
            "activity": 0
        }, {
            "id": "214458285242187777",
            "name": "Calvin Craig",
            "shits": 4,
            "activity": 42
        }, {
            "id": 144015500974751740,
            "name": "Alexander Hamilton",
            "shits": 4,
            "activity": 0
        }, {
            "id": "342296352853721092",
            "name": "VaderSpawn",
            "shits": 4,
            "activity": 0,
            "lastmsg": 13859
        }, {
            "id": "341761717614804993",
            "name": "Stan",
            "shits": 4,
            "activity": 0
        }, {
            "id": "213079375434874880",
            "name": "Rev",
            "shits": 4,
            "activity": 2
        }, {
            "id": "287951569809309696",
            "name": "PiggyTerry",
            "shits": 4,
            "activity": 954
        }, {
            "id": "361206071253139457",
            "name": "Venhedis",
            "shits": 4,
            "activity": 2620
        }, {
            "id": "286242060271484928",
            "name": "nuke",
            "shits": 3,
            "activity": 64,
            "lastmsg": 72
        }, {
            "id": "199339588790124546",
            "name": "Scoots",
            "shits": 3,
            "activity": 0
        }, {
            "id": "346833866645962753",
            "name": "VATSman892",
            "shits": 3,
            "activity": 873.2469056914688,
            "lastmsg": 198
        }, {
            "id": "317142052620206083",
            "name": "I have no soul",
            "shits": 3,
            "activity": 288
        }, {
            "id": "332990864538468354",
            "name": "shit",
            "shits": 3,
            "activity": 0
        }, {
            "id": "215046363526725632",
            "name": "Draumr",
            "shits": 3,
            "activity": 0,
            "lastmsg": 1965
        }, {
            "id": "196270492208988162",
            "name": "CREPS",
            "shits": 3,
            "activity": 0
        }, {
            "id": "327185764720836608",
            "name": "I'm NoT jUsT gAy I'm A cAtAmiTe.",
            "shits": 3,
            "activity": 0,
            "lastmsg": 1093
        }, {
            "id": "385872274034524161",
            "name": "Samaaah",
            "shits": 3,
            "activity": 0
        }, {
            "id": "281033556833206272",
            "name": "Phin",
            "shits": 2,
            "activity": 1615.821301915937,
            "lastmsg": 2
        }, {
            "id": "119147779795714048",
            "name": "Pokefan993",
            "shits": 2,
            "activity": 0
        }, {
            "id": "342086358010953728",
            "name": "KlausHeissler",
            "shits": 2,
            "activity": 11925.847372835122,
            "lastmsg": 180
        }, {
            "id": "254751031001481216",
            "name": "stinky",
            "shits": 2,
            "activity": 0
        }, {
            "id": "315618699715411969",
            "name": "JamesRogers",
            "shits": 2,
            "activity": 0,
            "lastmsg": 9765
        }, {
            "id": 325285208805081100,
            "name": "SilverFoxtail",
            "shits": 2,
            "activity": 0,
            "lastmsg": 19218
        }, {
            "id": "395675681574354944",
            "name": "nathan",
            "shits": 2,
            "activity": 0
        }, {
            "id": "234586765523025920",
            "name": "Vern",
            "shits": 2,
            "activity": 0,
            "lastmsg": 2032
        }, {
            "id": "322273717612969987",
            "name": "Facepalm Marsh",
            "shits": 2,
            "activity": 0,
            "lastmsg": 3646
        }, {
            "id": "382852098057961496",
            "name": "Brendon",
            "shits": 1,
            "activity": 0,
            "lastmsg": 5576
        }, {
            "id": "357294876058189825",
            "name": "Edgy Kenny",
            "shits": 1,
            "activity": 6
        }, {
            "id": "342377686422913025",
            "name": "matts alt plz dont worry",
            "shits": 1,
            "activity": 0
        }, {
            "id": "204415305580150785",
            "name": "Blizix",
            "shits": 1,
            "activity": 0,
            "lastmsg": 1433
        }, {
            "id": "356941255579533313",
            "name": "A Dead Kenny",
            "shits": 1,
            "activity": 0,
            "lastmsg": 915
        }, {
            "id": "290328985328549898",
            "name": "Felipe The Sudowoodo God",
            "shits": 1,
            "activity": 0
        }, {
            "id": "208603371710578688",
            "name": "CompressedWizard",
            "shits": 1,
            "activity": 0,
            "lastmsg": 15915
        }, {
            "id": "396344307902054401",
            "name": "Mr. Mantis",
            "shits": 1,
            "activity": 0,
            "lastmsg": 3435
        }, {
            "id": "264563883153293312",
            "name": "Shuichi",
            "shits": 1,
            "activity": 0,
            "lastmsg": 13208
        }, {
            "id": "194634079197462529",
            "name": "Shit lord",
            "shits": 1,
            "activity": 0
        }, {
            "id": "221021977043795969",
            "name": "A Sad Sangheili",
            "shits": 1,
            "activity": 0,
            "lastmsg": 13280
        }, {
            "id": "133099495411023872",
            "name": "Female Trans Ginger New Kid",
            "shits": 1,
            "activity": 0
        }, {
            "id": "352947555501473793",
            "name": "Owl",
            "shits": 1,
            "activity": 0,
            "lastmsg": 13555
        }, {
            "id": "214584733395451905",
            "name": "birbz with a z bc im cool",
            "shits": 1,
            "activity": 288
        }, {
            "id": "294093612029837323",
            "name": "Banjo Unleashed",
            "shits": 1,
            "activity": 0,
            "lastmsg": 17162
        }, {
            "id": "272336984104763393",
            "name": "★ Savөк | Croissant ★",
            "shits": 1,
            "activity": 0
        }, {
            "id": "195586396310732800",
            "name": "Neccria",
            "shits": 1,
            "activity": 0
        }, {
            "id": "264088740375429121",
            "name": "GeraltOfEthiopia",
            "shits": 1,
            "activity": 0,
            "lastmsg": 16695
        }, {
            "id": "238704543196643328",
            "name": "MisterFireTango",
            "shits": 1,
            "activity": 0,
            "lastmsg": 731
        }, {
            "id": "140204090486423552",
            "name": "Dellen",
            "shits": 1,
            "activity": 0,
            "lastmsg": 17527
        }, {
            "id": "304819781838700546",
            "name": "Th3 R4nd0m P3rs0n",
            "shits": 1,
            "activity": 80,
            "lastmsg": 201
        }, {
            "id": "302317832807383041",
            "name": "From God's Perspective",
            "shits": 1,
            "activity": 0,
            "lastmsg": 5757
        }, {
            "id": "170773798918946816",
            "name": "TheRockzSG",
            "shits": 1,
            "activity": 0,
            "lastmsg": 16570
        }, {
            "id": "382011429059821569",
            "name": "Ghost Mysterion",
            "shits": 1,
            "activity": 0
        }, {
            "id": "222749933588054016",
            "name": "Tintin",
            "shits": 1,
            "activity": 0,
            "lastmsg": 6086
        }, {
            "id": "282258121701720066",
            "name": "Gracie",
            "shits": 1,
            "activity": 0,
            "lastmsg": 9456
        }, {
            "id": "348292774870908929",
            "name": "axoloto",
            "shits": 1,
            "activity": 591.6645319898618,
            "lastmsg": 2
        }, {
            "id": "364619266852388864",
            "name": "warmachinerox7192",
            "shits": 1,
            "activity": 0
        }, {
            "id": "372462428690055169",
            "name": "betabot",
            "shits": 5,
            "activity": 1972
        }, {
            "id": "382201054043045888",
            "name": "pingQ",
            "shits": 0,
            "activity": 0,
            "lastmsg": 17495
        }, {
            "id": "234518776454840320",
            "name": "ＺＵＣＣ",
            "shits": 0,
            "activity": 0,
            "lastmsg": 19090
        }, {
            "id": "364804540635152386",
            "name": "P0rtals",
            "shits": 0,
            "activity": 0,
            "lastmsg": 7855
        }, {
            "id": "201421675558862848",
            "name": "Gonso a secas",
            "shits": 0,
            "activity": 0,
            "lastmsg": 10334
        }, {
            "id": "293477659781103616",
            "name": "KDbeast42813",
            "shits": 0,
            "activity": 0,
            "lastmsg": 15638
        }, {
            "id": "340224253494558731",
            "name": "BlakeIsLIT",
            "shits": 0,
            "activity": 0,
            "lastmsg": 12430
        }, {
            "id": "385827419610808340",
            "name": "Patrick",
            "shits": 0,
            "activity": 0,
            "lastmsg": 15892
        }, {
            "id": "244240370450432001",
            "name": "Crystalpyg613",
            "shits": 0,
            "activity": 0,
            "lastmsg": 17872
        }, {
            "id": "220726653117136897",
            "name": "Saurav",
            "shits": 0,
            "activity": 0,
            "lastmsg": 10605
        }, {
            "id": "300947353060507648",
            "name": "Ray~Kun",
            "shits": 0,
            "activity": 0,
            "lastmsg": 15308
        }, {
            "id": "323413101149945857",
            "name": "Hey",
            "shits": 0,
            "activity": 0,
            "lastmsg": 18972
        }, {
            "id": "395167253533818880",
            "name": "waqasvic",
            "shits": 0,
            "activity": 0,
            "lastmsg": 3404
        }, {
            "id": "142885328724819969",
            "name": "Samurai",
            "shits": 0,
            "activity": 0,
            "lastmsg": 15133
        }, {
            "id": "96373682871492608",
            "name": "Hexxie 🍒",
            "shits": 0,
            "activity": 0,
            "lastmsg": 3693
        }, {
            "id": "348989621742600194",
            "name": "Eli",
            "shits": 0,
            "activity": 0,
            "lastmsg": 17841
        }, {
            "id": "199740565753954304",
            "name": "Centrist16",
            "shits": 0,
            "activity": 0,
            "lastmsg": 14889
        }, {
            "id": "399391251717160960",
            "name": "JOJ0STAR",
            "shits": 0,
            "activity": 0,
            "lastmsg": 4792
        }, {
            "id": "399997184595984395",
            "name": "Captain Hook",
            "shits": 0,
            "activity": 0,
            "lastmsg": 4366
        }, {
            "id": "314099741459873802",
            "name": "Poke/Professer Chaos",
            "shits": 0,
            "activity": 0,
            "lastmsg": 2897
        }, {
            "id": "165350085683576832",
            "name": "Shira-DT",
            "shits": 0,
            "activity": 0,
            "lastmsg": 3724
        }, {
            "id": "356560547245981697",
            "name": "leodood",
            "shits": 0,
            "activity": 0,
            "lastmsg": 5441
        }, {
            "id": "253691181970489344",
            "name": "×+",
            "shits": 0,
            "activity": 0,
            "lastmsg": 3345
        }, {
            "id": "369888521797894165",
            "name": "StickyBlues",
            "shits": 0,
            "activity": 0,
            "lastmsg": 2929
        }, {
            "id": "174253045096382474",
            "name": "Mathep",
            "shits": 0,
            "activity": 0,
            "lastmsg": 1998
        }, {
            "id": "365957462333063170",
            "name": "Alexdewa",
            "shits": 0,
            "activity": 0,
            "lastmsg": 8538
        }, {
            "id": "342135357233430528",
            "name": "Festive Toast n' Jam",
            "shits": 0,
            "activity": 0,
            "lastmsg": 18947
        }, {
            "id": "321484369145495552",
            "name": "Kumama",
            "shits": 0,
            "activity": 0,
            "lastmsg": 1463
        }, {
            "id": "308665976231165953",
            "name": "super craig",
            "shits": 0,
            "activity": 154
        }, {
            "id": "295721447995736064",
            "name": "jka0004",
            "shits": 0,
            "activity": 0,
            "lastmsg": 17826
        }, {
            "id": "245721080671502338",
            "name": "Decibyte",
            "shits": 0,
            "activity": 24,
            "lastmsg": 191
        }, {
            "id": "107560034455543808",
            "name": "Midnight",
            "shits": 0,
            "activity": 0,
            "lastmsg": 18348
        }, {
            "id": "292497046353477633",
            "name": "Kae",
            "shits": 0,
            "activity": 0,
            "lastmsg": 13880
        }, {
            "id": "349149314372861953",
            "name": "MateiTheSouthParkFan",
            "shits": 0,
            "activity": 0,
            "lastmsg": 15117
        }, {
            "id": "366750726640107520",
            "name": "dieandfuckingloveme",
            "shits": 0,
            "activity": 0,
            "lastmsg": 12890
        }, {
            "id": "254243953828823041",
            "name": "yuri",
            "shits": 0,
            "activity": 0,
            "lastmsg": 13559
        }, {
            "id": "295577134259240962",
            "name": "bkr121",
            "shits": 0,
            "activity": 0,
            "lastmsg": 13533
        }, {
            "id": "308912385325006848",
            "name": "DragonFart",
            "shits": 0,
            "activity": 0,
            "lastmsg": 13265
        }, {
            "id": "336851422639554560",
            "name": "Policeman Clyde",
            "shits": 0,
            "activity": 514
        }, {
            "id": "382245126409551873",
            "name": "LORDE",
            "shits": 0,
            "activity": 0,
            "lastmsg": 3406
        }, {
            "id": "370800063427117059",
            "name": "Revvy",
            "shits": 0,
            "activity": 0,
            "lastmsg": 11990
        }, {
            "id": "273558514784403466",
            "name": "•sad-cormick•",
            "shits": 0,
            "activity": 0,
            "lastmsg": 1921
        }, {
            "id": "293891845908594689",
            "name": "bluh",
            "shits": 0,
            "activity": 0,
            "lastmsg": 7130
        }, {
            "id": "387263906508308500",
            "name": "Ice....",
            "shits": 0,
            "activity": 0,
            "lastmsg": 13108
        }, {
            "id": "223967777898102784",
            "name": "emithecheme",
            "shits": 0,
            "activity": 0,
            "lastmsg": 13696
        }, {
            "id": "98542850995650560",
            "name": "slat3",
            "shits": 0,
            "activity": 0,
            "lastmsg": 14026
        }, {
            "id": "237825448862547978",
            "name": "....🥃",
            "shits": 0,
            "activity": 0,
            "lastmsg": 13315
        }, {
            "id": "186877285771509761",
            "name": "irene",
            "shits": 0,
            "activity": 0,
            "lastmsg": 17717
        }, {
            "id": "281967911680081923",
            "name": "the bard",
            "shits": 0,
            "activity": 8
        }, {
            "id": "262354819652517888",
            "name": "Gook Jr.",
            "shits": 0,
            "activity": 0,
            "lastmsg": 16364
        }, {
            "id": "177092979155140608",
            "name": "Star 🎄",
            "shits": 0,
            "activity": 0,
            "lastmsg": 10629
        }, {
            "id": "195206033558339584",
            "name": "Surgt11",
            "shits": 0,
            "activity": 0,
            "lastmsg": 12999
        }, {
            "id": "250366258741116928",
            "name": "Shmow",
            "shits": 0,
            "activity": 0,
            "lastmsg": 1404
        }, {
            "id": "197336283176108032",
            "name": "Syncro37",
            "shits": 0,
            "activity": 0,
            "lastmsg": 12040
        }, {
            "id": "352605872704192513",
            "name": "TheShareBear",
            "shits": 0,
            "activity": 0,
            "lastmsg": 10313
        }, {
            "id": "133950904226414593",
            "name": "Quaxo",
            "shits": 0,
            "activity": 0,
            "lastmsg": 17548
        }, {
            "id": "199762100183105536",
            "name": "Yuriprime",
            "shits": 0,
            "activity": 0,
            "lastmsg": 11093
        }, {
            "id": "343417573880102912",
            "name": "Cookie",
            "shits": 0,
            "activity": 0,
            "lastmsg": 18363
        }, {
            "id": "173168799506235392",
            "name": "Craig Tucker",
            "shits": 0,
            "activity": 0,
            "lastmsg": 10819
        }, {
            "id": "333162055542767619",
            "name": "najen",
            "shits": 0,
            "activity": 0,
            "lastmsg": 15352
        }, {
            "id": "347502445103939586",
            "name": "PinkPawedProductions",
            "shits": 0,
            "activity": 0,
            "lastmsg": 11058
        }, {
            "id": "155149108183695360",
            "name": "Dyno",
            "shits": 0,
            "activity": 0,
            "lastmsg": 15840
        }, {
            "id": "248958355996016662",
            "name": "Noerdy",
            "shits": 0,
            "activity": 0,
            "lastmsg": 12607
        }, {
            "id": "144872569525239809",
            "name": "nitroyoshi9",
            "shits": 0,
            "activity": 0,
            "lastmsg": 3452
        }, {
            "id": "314917673123446786",
            "name": "Alkalye",
            "shits": 0,
            "activity": 0,
            "lastmsg": 4332
        }, {
            "id": "253903514391150592",
            "name": "That One South Park Fan",
            "shits": 0,
            "activity": 0,
            "lastmsg": 11183
        }, {
            "id": "391393163186798594",
            "name": "Bitterra",
            "shits": 0,
            "activity": 0,
            "lastmsg": 3093
        }, {
            "id": "307976961064435713",
            "name": "RedBot",
            "shits": 0,
            "activity": 0,
            "lastmsg": 18976
        }, {
            "id": "389259207750451201",
            "name": "csensang",
            "shits": 0,
            "activity": 0,
            "lastmsg": 10804
        }, {
            "id": "374108952746786818",
            "name": "Tweak",
            "shits": 0,
            "activity": 0,
            "lastmsg": 9886
        }, {
            "id": "333369502026956802",
            "name": "fat",
            "shits": 0,
            "activity": 0,
            "lastmsg": 2659
        }, {
            "id": "331010622760288257",
            "name": "Xheraldo",
            "shits": 0,
            "activity": 0,
            "lastmsg": 4984
        }, {
            "id": "331766123924160533",
            "name": "Rodent",
            "shits": 0,
            "activity": 0,
            "lastmsg": 8734
        }, {
            "id": "190837075183009792",
            "name": "Lightning",
            "shits": 0,
            "activity": 0,
            "lastmsg": 15903
        }, {
            "id": "373089771771396099",
            "name": "FrightfulDread",
            "shits": 0,
            "activity": 0,
            "lastmsg": 2501
        }, {
            "id": "388838167119396864",
            "name": "CreekShipper64",
            "shits": 0,
            "activity": 0,
            "lastmsg": 8377
        }, {
            "id": "104984717891223552",
            "name": "2th",
            "shits": 0,
            "activity": 53
        }, {
            "id": "255472639261409281",
            "name": "Nappy",
            "shits": 0,
            "activity": 0,
            "lastmsg": 636
        }, {
            "id": "270343911581417482",
            "name": "blizz",
            "shits": 0,
            "activity": 0,
            "lastmsg": 8855
        }, {
            "id": "267907982115864576",
            "name": "Ryan eats 20 peppers and dies",
            "shits": 0,
            "activity": 0,
            "lastmsg": 5921
        }, {
            "id": "216377334431744004",
            "name": "Mengo",
            "shits": 0,
            "activity": 0,
            "lastmsg": 6021
        }, {
            "id": "202609552804282368",
            "name": "Karachoice07",
            "shits": 0,
            "activity": 0,
            "lastmsg": 2756
        }, {
            "id": "156055487618482176",
            "name": "🎄 マフィン 🍊",
            "shits": 0,
            "activity": 0,
            "lastmsg": 15659
        }, {
            "id": "334785919674613761",
            "name": "Kylie The Badass Ginger",
            "shits": 0,
            "activity": 17.18344879451451,
            "lastmsg": 684
        }, {
            "id": "245408198713016320",
            "name": "Mysterion?",
            "shits": 0,
            "activity": 0,
            "lastmsg": 16043
        }, {
            "id": "262071124463058944",
            "name": "Ghostler",
            "shits": 0,
            "activity": 0,
            "lastmsg": 3728
        }, {
            "id": "195968053123481601",
            "name": "Jay Frost",
            "shits": 0,
            "activity": 0,
            "lastmsg": 15551
        }, {
            "id": "323190010964869120",
            "name": "фHiф",
            "shits": 0,
            "activity": 0,
            "lastmsg": 18118
        }, {
            "id": "379142078048894976",
            "name": "MLGesus",
            "shits": 0,
            "activity": 10
        }, {
            "id": "192752976606003201",
            "name": "LANES",
            "shits": 0,
            "activity": 0,
            "lastmsg": 7148
        }, {
            "id": "168758473587163137",
            "name": "Oneironaut",
            "shits": 0,
            "activity": 0,
            "lastmsg": 15796
        }, {
            "id": "368352414409162752",
            "name": "Abeldor",
            "shits": 0,
            "activity": 0,
            "lastmsg": 15389
        }, {
            "id": "325600863865274379",
            "name": "Mieon (≚ᄌ≚)ƶƵ",
            "shits": 0,
            "activity": 0,
            "lastmsg": 18449
        }, {
            "id": "280425545886597131",
            "name": "Super Adam",
            "shits": 0,
            "activity": 0,
            "lastmsg": 12114
        }, {
            "id": "229183531006296064",
            "name": "Yasoran",
            "shits": 0,
            "activity": 0,
            "lastmsg": 18800
        }, {
            "id": "258397522207178753",
            "name": "Wyatt",
            "shits": 0,
            "activity": 0,
            "lastmsg": 14036
        }, {
            "id": "262655459658432514",
            "name": "Travall",
            "shits": 0,
            "activity": 0,
            "lastmsg": 6877
        }, {
            "id": "205744975663595520",
            "name": "Bananazcakies",
            "shits": 0,
            "activity": 0,
            "lastmsg": 6381
        }, {
            "id": "225049951032311808",
            "name": "Robin ✨",
            "shits": 0,
            "activity": 0,
            "lastmsg": 6459
        }, {
            "id": "262251455510085632",
            "name": "Dr.Flug",
            "shits": 0,
            "activity": 0,
            "lastmsg": 5251
        }, {
            "id": "297914902163488768",
            "name": "Germ",
            "shits": 0,
            "activity": 0,
            "lastmsg": 6249
        }, {
            "id": "280844846904770561",
            "name": "Woodland Critters",
            "shits": 0,
            "activity": 0,
            "lastmsg": 1425
        }, {
            "id": "372357341758226443",
            "name": "Craig Tucker / super craig",
            "shits": 0,
            "activity": 0,
            "lastmsg": 3803
        }, {
            "id": "248977438191648769",
            "name": "2ndparty",
            "shits": 0,
            "activity": 0,
            "lastmsg": 14927
        }, {
            "id": "244141448142782474",
            "name": "avacadoloki",
            "shits": 0,
            "activity": 0,
            "lastmsg": 3724
        }, {
            "id": "324313543753203723",
            "name": "GhostCPYT",
            "shits": 0,
            "activity": 0,
            "lastmsg": 18364
        }, {
            "id": "336280106198630400",
            "name": "Croissant ( ͡~ ͜ʖ ͡°)",
            "shits": 0,
            "activity": 0,
            "lastmsg": 3724
        }, {
            "id": "215651576356929546",
            "name": "l1nka7",
            "shits": 0,
            "activity": 1609.1815399414402,
            "lastmsg": 931
        }, {
            "id": "372155002396868614",
            "name": "Edgy Wizard",
            "shits": 0,
            "activity": 3174
        }, {
            "id": "372696152929468417",
            "name": "red_daedra",
            "shits": 0,
            "activity": 0,
            "lastmsg": 5465
        }, {
            "id": "338403341455327242",
            "name": "A tua irmã de quatro",
            "shits": 0,
            "activity": 0,
            "lastmsg": 19204
        }, {
            "id": "300686182021332992",
            "name": "Jamey - Inactive On Discord",
            "shits": 0,
            "activity": 0,
            "lastmsg": 5056
        }, {
            "id": "361498162378047488",
            "name": "A Silent Night 2 Remember",
            "shits": 0,
            "activity": 0,
            "lastmsg": 16289
        }, {
            "id": "143772403829309440",
            "name": "tarm",
            "shits": 0,
            "activity": 0,
            "lastmsg": 3717
        }, {
            "id": "328975199926222848",
            "name": "phantomtroupe99",
            "shits": 0,
            "activity": 0,
            "lastmsg": 5733
        }, {
            "id": "178850358452289538",
            "name": "Cass",
            "shits": 0,
            "activity": 0,
            "lastmsg": 4070
        }, {
            "id": "107810822859821056",
            "name": "swiggaswayslit",
            "shits": 0,
            "activity": 0,
            "lastmsg": 15827
        }, {
            "id": "257126987066376202",
            "name": "Trash panda",
            "shits": 0,
            "activity": 0,
            "lastmsg": 3827
        }, {
            "id": "227887535748153346",
            "name": "Kit",
            "shits": 0,
            "activity": 46,
            "lastmsg": 343
        }, {
            "id": "138515790029783041",
            "name": "samuel",
            "shits": 0,
            "activity": 0,
            "lastmsg": 3728
        }, {
            "id": "304980605207183370",
            "name": "Sigma",
            "shits": 0,
            "activity": 0,
            "lastmsg": 9692
        }, {
            "id": "106466168063176704",
            "name": "rattus",
            "shits": 0,
            "activity": 0,
            "lastmsg": 3452
        }, {
            "id": "162608595966492672",
            "name": "Alex_The_Geat2",
            "shits": 0,
            "activity": 0,
            "lastmsg": 663
        }, {
            "id": "282229456964419584",
            "name": "SpaceBoy",
            "shits": 0,
            "activity": 0,
            "lastmsg": 3234
        }, {
            "id": "208236738915598337",
            "name": "i watch too much cartoons",
            "shits": 0,
            "activity": 0,
            "lastmsg": 2767
        }, {
            "id": "326728154511048708",
            "name": "Noka",
            "shits": 0,
            "activity": 0,
            "lastmsg": 13607
        }, {
            "id": "316569538789638146",
            "name": "koeru",
            "shits": 0,
            "activity": 0,
            "lastmsg": 2973
        }, {
            "id": "297544042718298125",
            "name": "necks_lvl",
            "shits": 0,
            "activity": 0,
            "lastmsg": 7409
        }, {
            "id": "243163105834696705",
            "name": "Dantelukas",
            "shits": 0,
            "activity": 0,
            "lastmsg": 1751
        }, {
            "id": "367677246040702976",
            "name": "haru mystery-u",
            "shits": 0,
            "activity": 2569.633724543921,
            "lastmsg": 1
        }, {
            "id": "93766974877741056",
            "name": "meowzzies",
            "shits": 0,
            "activity": 0,
            "lastmsg": 15809
        }, {
            "id": "383164960509001740",
            "name": "Cu-Miun",
            "shits": 0,
            "activity": 0,
            "lastmsg": 18256
        }, {
            "id": "283348709595676674",
            "name": "Jazzles",
            "shits": 0,
            "activity": 0,
            "lastmsg": 1992
        }, {
            "id": "254764670806654977",
            "name": "bigmat526",
            "shits": 0,
            "activity": 120,
            "lastmsg": 537
        }, {
            "id": "189569939991035904",
            "name": "aaron",
            "shits": 0,
            "activity": 294,
            "lastmsg": 193
        }, {
            "id": "273268037837127690",
            "name": "MonstoBusta2000",
            "shits": 0,
            "activity": 0,
            "lastmsg": 6553
        }, {
            "id": "380386997350432768",
            "name": "Pyxus",
            "shits": 0,
            "activity": 0,
            "lastmsg": 1169
        }, {
            "id": "259939492922654721",
            "name": "freddyairmail",
            "shits": 0,
            "activity": 0,
            "lastmsg": 12561
        }, {
            "id": "175361312484884482",
            "name": "corylulu",
            "shits": 0,
            "activity": 0,
            "lastmsg": 14007
        }, {
            "id": "127206060904677376",
            "name": "evey119",
            "shits": 0,
            "activity": 0,
            "lastmsg": 16048
        }, {
            "id": "404960790941270016",
            "name": "ＭＩＲＹＡＭ",
            "shits": 0,
            "activity": 100,
            "lastmsg": 539
        }, {
            "id": "405141617872207874",
            "name": "tweek.coffee",
            "shits": 0,
            "activity": 14,
            "lastmsg": 544
        }, {
            "id": "167383298895511562",
            "name": "Mysterios",
            "shits": 0,
            "activity": 178,
            "lastmsg": 201
        }, {
            "id": "196308513520222208",
            "name": "Minji",
            "shits": 0,
            "activity": 210,
            "lastmsg": 168
        }, {
            "id": "356340645947899906",
            "name": "AVinkingofvinland",
            "shits": 0,
            "activity": 30,
            "lastmsg": 42
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
    if (!(guild.permissions & 36)) {
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