"use strict"

const express = require("express");
const router = express.Router();
const randomstring = require("randomstring");

const Server = require("../../../common/models/server");

// OUTDATED, PLS UPDATE!!!
/** ----------------------------------------
 *          GENERAL SERVER ROUTES
 *  ----------------------------------------
 */

// TODO: sample

router.route("/")
    .post((req, res) => {
        var server = new Server();
        server._id = req.body._id;

        server.save(err => {
            if (err) {
                res.send(err);
            }

            res.json({ message: "Server added successfully!" });
        });
    })
    .get((req, res) => {
        Server.find((err, servers) => {
            if (err) {
                res.send(err);
            }

            res.json(servers);
        });
    });
router.route("/:server_id")
    .get((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            res.json(server);
        });
    })
    .put((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            server.issues = req.body.issues;

            server.save(err => {
                if (err) {
                    res.send(err);
                }

                res.json({ message: "Server updated successfully!" });
            });
        });
    })
    .delete((req, res) => {
        Server.remove({
            _id: req.params.server_id
        }, (err, server) => {
            if (err) {
                res.send(err);
            }

            res.json({ message: "Server removed successfully!" });
        });
    });

/** ----------------------------------------
 *          SPECIFIC STAT ROUTES
 *  ----------------------------------------
 */

/* Example structure.
const stats = [
    {
        id: "XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT",
        name: "shits",
        now: 27,
        day: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        week: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    }
];
*/
router.route("/:server_id/stats")
    .post((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            var stats = server.stats;

            stats.push({
                id: randomstring.generate(),
                name: req.body.name,
                now: [],
                day: [],
                week: [],
                month: []
            });

            server.stats = stats;

            server.save(err => {
                if (err) {
                    res.send(err);
                }

                res.json({ message: "Stat added successfully!" });
            });
        });
    })
    .get((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            res.json(server.stats);
        });
    });
router.route("/:server_id/stats/:stat_id")
    .get((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            for (var i = 0; i < server.stats.length; i++) {
                if (server.stats[i].id == req.params.stat_id) {

                    res.json(server.stats[i]);
                    return;
                }
            }  

            res.json({ message: "Stat not found!" });
        });
    })
    .put((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            for (var i = 0; i < server.stats.length; i++) {
                if (server.stats[i].id == req.params.stat_id) {

                    var stats = server.stats;

                    const id = stats[i].id;
                    stats.splice(i, 1);
                    stats.push({
                        id: id,
                        name: req.body.name,
                        now: req.body.now,
                        day: req.body.day,
                        week: req.body.week,
                        month: req.body.month
                    });

                    server.stats = stats;

                    server.save(err => {
                        if (err) {
                            res.send(err);
                        }
        
                        res.json({ message: "Stat updated successfully!" });
                    });
                    return;
                }
            }            

            res.json({ message: "Stat not found!" });
        });
    })
    .delete((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            for (var i = 0; i < server.stats.length; i++) {
                if (server.stats[i].id == req.params.stat_id) {

                    var stats = server.stats;

                    stats.splice(i, 1);

                    server.stats = stats;

                    server.save(err => {
                        if (err) {
                            res.send(err);
                        }
        
                        res.json({ message: "Stat updated successfully!" });
                    });
                    return;
                }
            }

            res.json({ message: "Stat not found!" });
        });
    });

/** ----------------------------------------
 *          SPECIFIC GRAPH ROUTES
 *  ----------------------------------------
 */

/* Example structure.
const graphs = [
    {
        id: "XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT",
        type: "line",
        data: {
            timestep: "day",
            datasets: [
                {
                    stat: "shits",
                    theme: "red"
                },
                {
                    stat: "activity",
                    theme: "blue"
                }
            ]
        }
    },
    {
        id: "XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT",
        type: "pie",
        data: {
            datasets: [
                {
                    stat: "shits",
                    member: "global",
                    theme: "red"
                },
                {
                    stat: "activity",
                    member: "168690518899949569",
                    theme: "blue"
                }
            ]
        }
    },
    {
        id: "XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT",
        type: "card",
        data: {
            stat: "activity",
            member: "global",
            theme: "red"
        }
    },
    {
        id: "XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT",
        type: "bar",
        data: {
            label: "graphName",
            datasets: [
                {
                    stat: "shits",
                    member: "global",
                    theme: "red"
                },
                {
                    stat: "activity",
                    member: "168690518899949569",
                    theme: "blue"
                }
            ]
        }
    }
]
*/
router.route("/:server_id/graphs")
    .post((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            var graphs = server.graphs;

            graphs.push({
                id: randomstring.generate(),
                type: req.body.type,
                data: req.body.data
            });

            server.graphs = graphs;

            server.save(err => {
                if (err) {
                    res.send(err);
                }

                res.json({ message: "Graph added successfully!" });
            });
        });
    })
    .get((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            res.json(server.graphs);
        });
    });
router.route("/:server_id/grpahs/:graph_id")
    .get((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            for (var i = 0; i < server.graphs.length; i++) {
                if (server.graphs[i].id == req.params.graph_id) {

                    res.json(server.graphs[i]);
                    return;
                }
            }

            res.json({ message: "Graph not found!" });
        });
    })
    .put((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            for (var i = 0; i < server.graphs.length; i++) {
                if (server.graphs[i].id == req.params.graph_id) {

                    var graphs = server.graphs;

                    const id = graphs[i].id;
                    graphs.splice(i, 1);
                    graphs.push({
                        id: id,
                        type: req.body.type,
                        data: req.body.data,
                    });

                    server.graphs = graphs;

                    server.save(err => {
                        if (err) {
                            res.send(err);
                        }
        
                        res.json({ message: "Graph updated successfully!" });
                    });
                    return;
                }
            }            

            res.json({ message: "Graph not found!" });
        });
    })
    .delete((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            for (var i = 0; i < server.graphs.length; i++) {
                if (server.issues[i].id == req.params.graph_id) {

                    var graphs = server.graphs;

                    graphs.splice(i, 1);

                    server.graphs = graphs;

                    server.save(err => {
                        if (err) {
                            res.send(err);
                        }
        
                        res.json({ message: "Graph updated successfully!" });
                    });
                    return;
                }
            }

            res.json({ message: "Graph not found!" });
        });
    });

/** ----------------------------------------
 *          SPECIFIC ISSUE ROUTES
 *  ----------------------------------------
 */

/* Example structure.
const issues = [
    {
        id: "XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT",
        author: "ya boi dragon",
        name: "kys",
        tag: "rope",
        desc: "in park on tree"
    }
];
*/
router.route("/:server_id/issues")
    .post((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            var issues = server.issues;

            issues.push({
                id: randomstring.generate(),
                author: req.body.author,
                name: req.body.name,
                tag: req.body.tag,
                desc: req.body.desc
            });

            server.issues = issues;

            server.save(err => {
                if (err) {
                    res.send(err);
                }

                res.json({ message: "Issue added successfully!" });
            });
        });
    })
    .get((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            res.json(server.issues);
        });
    });
router.route("/:server_id/issues/:issue_id")
    .get((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            for (var i = 0; i < server.issues.length; i++) {
                if (server.issues[i].id == req.params.issue_id) {

                    res.json(server.issues[i]);
                    return;
                }
            }

            res.json({ message: "Issue not found!" });
        });
    })
    .put((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            for (var i = 0; i < server.issues.length; i++) {
                if (server.issues[i].id == req.params.issue_id) {

                    var issues = server.issues;

                    const id = issues[i].id;
                    issues.splice(i, 1);
                    issues.push({
                        id: id,
                        author: req.body.author,
                        name: req.body.name,
                        tag: req.body.tag,
                        desc: req.body.desc
                    });

                    server.issues = issues;

                    server.save(err => {
                        if (err) {
                            res.send(err);
                        }
        
                        res.json({ message: "Issue updated successfully!" });
                    });
                    return;
                }
            }            

            res.json({ message: "Issue not found!" });
        });
    })
    .delete((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            for (var i = 0; i < server.issues.length; i++) {
                if (server.issues[i].id == req.params.issue_id) {

                    var issues = server.issues;

                    issues.splice(i, 1);

                    server.issues = issues;

                    server.save(err => {
                        if (err) {
                            res.send(err);
                        }
        
                        res.json({ message: "Issue deleted successfully!" });
                    });
                    return;
                }
            }

            res.json({ message: "Issue not found!" });
        });
    });

/** ----------------------------------------
 *          SPECIFIC MEMBER ROUTES
 *  ----------------------------------------
 */ 

/* Example structure.
const memebrs = [
    {
        id: "168690518899949569",
        stats: [
            {
                name: "shits",
                value: 27
            }
        ]
    }
];
*/

router.route("/:server_id/members")
    .post((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            var members = server.members;

            members.push({
                id: req.body.id,
                stats: []
            });

            server.members = members;

            server.save(err => {
                if (err) {
                    res.send(err);
                }

                res.json({ message: "Member added successfully!" });
            });
        });
    })
    .get((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            res.json(server.members);
        });
    });
router.route("/:server_id/members/:member_id")
    .get((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            for (var i = 0; i < server.members.length; i++) {
                if (server.members[i].id == req.params.member_id) {

                    res.json(server.members[i]);
                    return;
                }
            }  

            res.json({ message: "Member not found!" });
        });
    })
    .put((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            for (var i = 0; i < server.members.length; i++) {
                if (server.members[i].id == req.params.member_id) {

                    var members = server.members;

                    const id = members[i].id;
                    members.splice(i, 1);
                    members.push({
                        id: id,
                        stats: req.body.stats
                    });

                    server.members = members;

                    server.save(err => {
                        if (err) {
                            res.send(err);
                        }
        
                        res.json({ message: "Member updated successfully!" });
                    });
                    return;
                }
            }            

            res.json({ message: "Member not found!" });
        });
    })
    .delete((req, res) => {
        Server.findById(req.params.server_id, (err, server) => {
            if (err) {
                res.send(err);
            }

            for (var i = 0; i < server.members.length; i++) {
                if (server.members[i].id == req.params.member_id) {

                    var members = server.members;

                    members.splice(i, 1);

                    server.members = members;

                    server.save(err => {
                        if (err) {
                            res.send(err);
                        }
        
                        res.json({ message: "Member updated successfully!" });
                    });
                    return;
                }
            }

            res.json({ message: "Member not found!" });
        });
    });

module.exports = router;