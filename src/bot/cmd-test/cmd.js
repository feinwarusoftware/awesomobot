const prefix = "-";
var server = {
    id: "354987628308987904",
    premium: true,
    stats: [
        {
            name: "shits",
            edit: true,
            now: 999,
            day: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            week: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            month: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        }
    ],
    members: [
        {
            id: "168690518899949569",
            stats: [
                {
                    name: "shits",
                    value: 27,
                }
            ]
        }
    ],
    groups: [
        {
            name: "#default",
            server: true,
        },
        {
            name: "test",
            server: true,
            channels: [
                {
                    id: "*",
                    value: true,
                },
                {
                    id: "168690518899949569",
                    value: true,
                }
            ],
            roles: [
                {
                    id: "*",
                    value: true,
                },
                {
                    id: "168690518899949569",
                    value: true,
                }
            ],
            members: [
                {
                    id: "*",
                    value: true,
                },
                {
                    id: "168690518899949569",
                    value: true,
                }
            ]
        }
    ],
    commands: [
        {
            name: "test",
            type: "command",
            value: "test",
            group: "test",
            script: `   
                        #channel.send(testing_2, hai);
                    `,
        }
    ],
};
class Group {
    constructor(groupJson) {
        this.group = groupJson;
    }
    inherit(other) {
        const temp = other.getJson();
        const server = (temp.server && this.group.server) || this.group.server;
        const combine = function(from, to, prop, cmp, comb) {
            var found;
            for (var i = 0; i < (from[prop] == undefined ? 0 : from[prop].length); i++) {
                for (var j = 0; j < (to[prop] == undefined ? 0 : to[prop].length); j++) {
                    if (cmp(from[prop][i], to[prop][j])) {
                        comb(from[prop][i], to[prop][j]);
                        found = true;
                    }
                }
                if (!found) {
                    if (to[prop] == undefined) {
                        to[prop] = [];
                    }
                    to[prop].push(from[prop][i]);
                }
            }
        }
        var cmp, comb;
        cmp = function(from, to) { return from.id == to.id; }
        comb = function(from, to) { to.value = (from.value && to.value) || to.value; }
        combine(temp, this.group, "channels", cmp, comb);
        combine(temp, this.group, "roles", cmp, comb);
        combine(temp, this.group, "members", cmp, comb);
        cmp = function(from, to) {
            return ((from.name == to.name) && (from.operator == to.operator));
        }
        comb = function(from, to) {
            to.value = from.value;
        }
        combine(temp, this.group, "stats", cmp, comb);
    }
    resolve(message, stats, command) {
        const info = {
            error: false,
            embed: null,
        };
        var final = true;
        // Server.
        const server = this.group.server;
        final = final && server;
        if (!final) {
            info.error = true;
            info.embed = embeds.groupError(command, [
                {
                    head: "Command disabled on the server.",
                    desc: "So basically you can't use it here.",
                }
            ]);
            return info;
        }
        // Channels.
        if (this.group.channels != undefined) {
            var channelWc = this.group.channels.find(e => {
                return e.id == "*";
            });
            var channelOv = this.group.channels.find(e => {
                return e.id == message.channel.id;
            });
            if (channelWc == undefined) {
                channelWc = {};
                channelWc.value = server;
            }
            if (channelOv == undefined) {
                channelOv = {};
                channelOv.value = channelWc;
            }
            final = final && ((channelWc.value && channelOv.value) || channelOv.value);
            if (!final) {
                info.error = true;
                info.embed = embeds.groupError(command, [
                    {
                        head: "Command disabled for this channel.",
                        desc: "So basically you can't use it here.",
                    }
                ]);
                return info;
            }
        }
        // Roles.
        if (this.group.roles != undefined) {
            var rolesWc = this.group.channels.find(e => {
                return e.id == "*";
            });
            var rolesOv = this.group.channels.filter(e => {
                for (var i = 0; i < message.member.roles.array().length; i++) {
                    return e.id == message.member.roles.array()[i];
                }
            });
            if (rolesWc == undefined) {
                rolesWc = {};
                rolesWc.value = server;
            }
            if (rolesOv.length > 0) {
                for (var i = 0; i < rolesOv.length; i++) {
                    final = final && ((rolesWc.value && rolesOv[i].value) || rolesOv[i].value);
                }
            } else {
                final = final && rolesWc.value;
            }
            if (!final) {
                info.error = true;
                info.embed = embeds.groupError(command, [
                    {
                        head: "Command disabled for your role.",
                        desc: "So basically you can't use it.",
                    }
                ]);
                return info;
            }
        }
        // Members
        if (this.group.members != undefined) {
            var memberWc = this.group.members.find(e => {
                return e.id == "*";
            });
            var memberOv = this.group.members.find(e => {
                return e.id == message.author.id;
            });
            if (memberWc == undefined) {
                memberWc = {};
                memberWc.value = server;
            }
            if (memberOv == undefined) {
                memberOv = {};
                memberOv.value = memberWc;
            }
            final = final && ((memberWc.value && memberOv.value) || memberOv.value);
            if (!final) {
                info.error = true;
                info.embed = embeds.groupError(command, [
                    {
                        head: "Command disabled for you.",
                        desc: "So basically you can't use it.",
                    }
                ]);
                return info;
            }
        }
        return info;
    }
    getJson() {
        return this.group;
    }
}
class Command {
    constructor(commandJson) {
        this.command = commandJson;
    }
    check(message, prefix) {
        switch(this.command.type) {
            case "command":
                return message.content.toLowerCase().startsWith(prefix + this.command.value.toLowerCase());
                break;
            case "startswith":
                return message.content.toLowerCase().startsWith(this.command.value.toLowerCase());
                break;
            case "contains":
                return message.content.toLowerCase().indexOf(this.command.value.toLowerCase()) != -1;
                break;
            case "exactmatch":
                return message.content == this.command.value;
                break;
            case "regex":
                const regex = new RegExp(this.command.value, this.command.flags);
                return regex.test(message.content);
                break;
        }
        return false;
    }
    resolve(message, members, stats, callback) {
        const info = {
            error: false,
            embed: null,
        };
        const script = this.command.script;
        const commandArgs = message.content.split(" ");
        const options = {};
        var all = "";
        for (var i = 1; i < commandArgs.length; i++) {
            options["args." + i] = commandArgs[i];
            all = (all + commandArgs[i] + " ");
        }
        options["args.all"] = all.trim();
        // member
        // stats
        // args
        // spwikia
        // channel
        // embed
        //-member.stat
        //-member.addstat
        //-member.remstat
        //-member.addrole
        //-member.remrole
        //-stats.stat
        //-args.n
        //-args.all
        //spwikia.search
        //-channel.send
        //embed.create
        //#member.addrole(testrole);
        var done = false;
        var i = 0;
        var call = 0, variable = 0, start = 0, end = 0;
        while (!done) {
            call = script.indexOf("#", end);
            variable = script.indexOf("$", end);
            if (call < variable || variable == -1) {
                start = call;
            } else {
                start = variable;
            }
            end = script.indexOf(";", start);
            if (start == -1 || end == -1) {
                done = true;
                break;
            }
            const line = script.substring(start, end + 1).trim();
            console.log(i + " >> " + line);
            const delimIndex = line.indexOf(".");
            const functional = line.substring(delimIndex + 1, line.length);
            var argLine = functional.substring(functional.indexOf("(") + 1, functional.indexOf(")"));
            
            const args = [];
            var parsed = false;
            var curr = 0, prev = 0;
            while (!parsed) {
                prev = curr;
                if (prev != 0) {
                    prev = prev + 1;
                } 
                curr = argLine.indexOf(",", prev + 1);
                if (curr == -1) {
                    args.push(argLine.substring(prev, argLine.length).trim());
                    parsed = true;
                } else {
                    args.push(argLine.substring(prev, curr).trim());
                }
            }
            for (var i = 0; i < args.length; i++) {
                if (args[i] == "member") {
                    args[i] = message.author.username;
                }
                if (options[args[i]] == undefined) {
                    options[args[i]] = args[i];
                }
            }
            if (line.startsWith("$")) {
                const name = line.substring(line.indexOf("$") + 1, line.indexOf("=")).trim();
                const equate = line.substring(line.indexOf("=") + 1, line.indexOf(";")).trim();
                if (equate.startsWith("member")) {
                    if (functional.startsWith("stat")) {
                        const memId = message.guild.members.find(e => { return e.user.id }, options[args[0]]);
                        const member = members.find(e => {
                            return e.id == memId;
                        });
                        if (member == undefined) {
                            callback(info);
                            return;
                        }
                        const stat = member.stats.find(e => {
                            return e.name == args[1];
                        });
                        if (stat == undefined) {
                            callback(info);
                            return;
                        }
                        options[name] = stat.value;
                    }
                }
                if (equate.startsWith("stats")) {
                    if (functional.startsWith("stat")) {
                        const stat = stats.find(e => {
                            return e.name == args[0];
                        });
                        if (stat == undefined) {
                            callback(info);
                            return;
                        }
                        options[name] = stat.now;
                    }
                }
            }
            if (line.startsWith("#")) {
                if (line.startsWith("#member")) {
                    if (functional.startsWith("addstat")) {
                        const memId = message.guild.members.find(e => { return e.user.id }, options[args[0]]);
                        const member = members.find(e => {
                            return e.id == memId;
                        });
                        if (member == undefined) {
                            callback(info);
                            return;
                        }
                        const stat = member.stats.find(e => {
                            return e.name == args[1];
                        });
                        if (stat == undefined) {
                            callback(info);
                            return;
                        }
                        const value = parseInt(args[2]);
                        if (value == undefined) {
                            callback(info);
                            return;
                        }
                        stat.value = stat.value + value;
                    }
                    if (functional.startsWith("remstat")) {
                        const memId = message.guild.members.find(e => { return e.user.id }, options[args[0]]);
                        const member = members.find(e => {
                            return e.id == memId;
                        });
                        if (member == undefined) {
                            callback(info);
                            return;
                        }
                        const stat = member.stats.find(e => {
                            return e.name == args[1];
                        });
                        if (stat == undefined) {
                            callback(info);
                            return;
                        }
                        const value = parseInt(args[2]);
                        if (value == undefined) {
                            callback(info);
                            return;
                        }
                        stat.value = stat.value - value;
                    }
                    if (functional.startsWith("addrole")) {
                        const member = message.guild.members.find(e => { return e.user.username }, options[args[0]]);
                        if (member == undefined) {
                            callback(info);
                            return;
                        }
                        const role = message.guild.roles.find("name", "testrole");
                        if (role == undefined) {
                            callback(info);
                            return;
                        }
                        member.addRole(role);
                    }
                    if (functional.startsWith("remrole")) {
                        const member = message.guild.members.find(e => { return e.user.username }, options[args[0]]);
                        if (member == undefined) {
                            callback(info);
                            return;
                        }
                        const role = message.guild.roles.find("name", options[args[1]]);
                        if (role == undefined) {
                            callback(info);
                            return;
                        }
                        member.removeRole(role);
                    }
                    if (functional.startsWith("reply")) {
                        if (options[args[0]] == undefined) {
                            message.reply(args[0]);
                        } else {
                            message.reply(options[args[0]]);
                        }
                    }
                }
                if (line.startsWith("#channel")) {
                    if (functional.startsWith("send")) {
                        const channel = message.guild.channels.find("name", options[args[0]]);
                        if (channel == undefined) {
                            callback(info);
                            return;
                        }
                        channel.send(options[args[1]]);
                    }
                }
            }
            i = i + 1;
        }
        callback(info);
    }
    getJson() {
        return this.command;
    }
}
const commands = [];
commands.push(new Command(server.commands[0]));
client.on("message", function(message) {
    if (message.author.equals(client.user)) { return; }
    for (var i = 0; i < commands.length; i++) {
        // Check if command was called.
        if (!commands[i].check(message, prefix)) { continue; }
        // Resolve group stuff.
        const defGroup = new Group(server.groups.find(e => {
            return e.name == "#default";
        }));
        const newGroup = new Group(server.groups.find(e => {
            return e.name == commands[i].getJson().group;
        }));
        newGroup.inherit(defGroup);
        
        const groupInfo = newGroup.resolve(message, server.stats, commands[i]);
        if (groupInfo.error) {
            message.channel.send(groupInfo.embed);
            continue;
        }
        // Resolve command stuff.
        commands[i].resolve(message, server.members, server.stats, info => {
            if (info.error) {
                console.log("error");
            }
            console.log("success");
        });
    }
});