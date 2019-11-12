0. (12/11/2019) Take a look at src/utils/log.js. Remove it. Change all the references in the rest of the codebase from info, warn, and error to console.log, console.warn, and console.error respectively.

e.g.
some_lib.js
{
    if (true) {
        // do the thing
    } else {
        warn("couldnt do the thing");
    }
}

fixed some_lib.js
{
    if (true) {

    } else {
        console.warn("couldnt do the thing");
    }
}

1. (12/11/2019) See the above? Now take a look at src/db/schemas/log.js. Remove that as well. Remove all references to it and any db reads/writes to the log collection. If there are any api paths trying to access logs, remove the routes completely.

This file will be updates with more things...
