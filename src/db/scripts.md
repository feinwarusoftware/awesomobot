scripting v2 requirements:
- individual script pages
> more data in db
- testable scripts
> scripts are pure functions
- no local/user made differentiation
> source field, can be anything, local, github, etc
- module support
> 
- limited database storage
> db as a module
- rendering support
> renderer as a module
- all js features
> more secure sandbox
> scripts are pure functions
- backwards compatibility
> sandbox execution modes?
- packages/collections
> database schema
> move preload to collections
- workspaces (client-side but may need api stuff)
> client-side editor organisation
> utility api stuff for dealing with multiple scripts
- more than 'on message'
> event hierarchy and event scripts
- ability to add own lang/visual scripts
- ability to add other lang scripts
- ability to replace discord.js
> ^^^ sandbox execution modes?

Making scripts testable:
1. Scripts are pure functions
> easily testable
> cachable
but...
> how do we deal with async?
*requires AST research
2. Building a discord sandbox
> allows making api calls to test
> can keep track of state
> each api function changes the sandbox state
> wrapper allows for:
>> calling sandbox in dev mode
>> calling actual discord fn in prod mode
>> other lang bindings
> the final state of the sandbox can be tested

Script:
```js
"use strict";

// Sandbox send a state change
// request to the interpreter.

// Sandbox can send multiple requests.
// Sandbox has a timeout.
sendMessage(client, channel, "rawrxd");

// This will wait for a response from
// the event queue to resolve the promise.

// An example where this would be useful
// is db requests; so the script knows
// if it needs to report an error.
await sendMessage(client, channel, "teehee");
await dbGetUser(id);

// If end request not called by
// timeout, an error is reported.

// The use of promises, callbacks,
// or anything that would take time
// to complete warns the script
// creator of possible timeouts.

// Internally, done is only called
// once there is no queued state
// changes in the sandbox - as in,
// for the real discord API, if
// something errors out, the sandbox
// will throw an error.

// These state change calls are
// universal no matter what
// scripting language is called!

// State changes either call discord
// functions or change the state of
// the test sandbox in dev.

// The state as well as the complete
// event queue can be inspected at
// the end for testing!

done();
```
Rule of thumb:
> functions that modify outside resources or that need to be regulated are run through the messaging api
>> web requests
>> discord state changes
>> database access
> functions that are contained to the sandbox can be executed normally
>> overlaying images
>> internal script logic

Note:
> crates/modules can expose both types of functions
> crates/modules need to be designed in such a way that both function types appear the same to the user
||
|| (top kek code)
|| (meta determines execution mode)
||
\/
Sandbox
> js script interpreter
> json script interpreter
> event queue

Layers:
> back-end logic
> wrapper (normal vs message functions)

Note that the message api is language agnostic




