"use strict";

const http = require("http");
const app = require("express")();

const v4 = require("./v4");

// temp
const port = 80

app.use(v4);

const server = http.createServer(app);

server.on("listening", () => {

    console.log(`Magic happens on port ${port}`);
});

server.on("error", error => {

    if (error.syscall !== "listen") {

        console.error(`Could not start http server: ${error}`);
        process.exit(-1);
    }

    switch(error.code) {
        case "EACCESS": {

            console.error(`Port '${port}' requires elevated privileges`);
            break;
        }
        case "EADDRINUSE": {

            console.error(`Port '${port}' is already in use`);
            break;
        }
        default: {

            console.error(`Could not start http server: ${error}`);
            break;
        }
    }

    process.exit(-2);
});

server.listen(port);
