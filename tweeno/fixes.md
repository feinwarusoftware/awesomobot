0. (12/11/2019) Take a look at src/utils/log.js. Remove it. Change all the references in the rest of the codebase from info, warn, and error to console.log, console.warn, and console.error respectively.

e.g.
some_lib.js
```js
{
    if (true) {
        // do the thing
    } else {
        warn("couldnt do the thing");
    }
}
```

fixed some_lib.js
```js
{
    if (true) {
        // do the thing
    } else {
        console.warn("couldnt do the thing");
    }
}
```

1. (12/11/2019) See the above? Now take a look at src/db/schemas/log.js. Remove that as well. Remove all references to it and any db reads/writes to the log collection. If there are any api paths trying to access logs, remove the routes completely.

This file will be updates with more things...

2. The next episode command is broke (find a way to access and fix it - by contacting airborn or otherwise)

3. Currently theres no way to select new roles, add something that can be configurable per server to add new roles either with commands (e.g. -addRole pissyellow), or otherwise. By configurable per server, i mean i want the admins to be able to add a role to the pool from which members can choose, e.g. i can do -addAddableRole <role_id_goes_here> <name_of_the_role>, and then a member can do -addRole name_of_the_role, to get that role
