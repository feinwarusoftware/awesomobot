features:
- convertible between graph (basic) and text (advanced) format 
- safe, sandboxed execution
- simple to use (defaults for everything, leverage new js features)
- as powerful as local scripts (usage of our sdk and user-made libs)
- fully customisable (every execution stage can be changed)
- allow data storage and retrieval
- versioning
- testing
- automatic and manual varification (better marketplace listings)

schema:
{
  _id,

  // meta
  owner,
  collaborators,

  name,
  description,
  thumbnail,
  banner,
  // formerly: marketplace_enabled
  public,

  // code
  // t/f - whether it gets called on a discord/feinwaru custom event
  executable,

  version,
  code,
  // [version, diff]
  // these are back diffs
  diffs,

  // script that sets up the test env
  env,
  // [pre, run]
  // pre can modify the env set while run actually runs the test
  tests,

  // stats
  featured,
  verified,
  approved,
  score,
  uses,
  tags,

  // more meta
  created_at,
  updated_at,

  created_with
}

example:

IMPORTANT: disallow changing already existing context elements

```js
{
  import { command } from "@feinwaru/utils";

  // will only be called on the message event
  @command({
    // inherit - optional (def - guild.prefix)
    prefix: null,
    // {prefix}{match} - required
    match: "rawrxd",
    // {prefix}{match} help - optional (def - the command author did not provide an help, youre on your own!)
    help: `usage: ${this.prefix}${this.match}`,
    // error handler
    // error: `an error occured while trying to call the command: ${error}`
  })
  const execute = context => {
    const { event } = context;

    console.log("rawryd");
  };

  export default execute;
}
```

```js
{
  // quick note on how these are called:
  const event = {
    type: "message",
    content: {
      test: "-rawrxd"
    }
  };

  const currentExecutable = () => {};

  //

  import { guild } from "@feinwaru/db";

  // graphql style db access
  // TODO: error bubbling
  @guild([
    "prefix"
  ])
  const command = (target, name, descriptor) => {
    const original = descriptor.value;

    if (typeof original === "function") {
      descriptor.value = (...args) => {

        // args[0] is context
        const { event, guild } = args[0];
        //
        const { prefix, match, help } = args

        if (event.type !== "message") {
          return;
        }

        const message = event.content.message;
        if (!message.startsWith(`${guild.prefix}${}`)) {
          
        }

        original(args);
      }
    }
    return descriptor;
  };

  export default execute;
}
```

```js

// all scripts will be called, and the event will be passed
const someEvent = {
  type: "discord-message",
  content: {
    text: "-rawrxd",
    // ...
  }
};

someScript(someEvent)

// scripts can do all the hard work every time
const script1 = event => {
  const { type, content } = event;

  if (type === "discord-message" && content.text === "-rawrxd") {
    // send discord message
  }
}
```

```js
// command with helper

import { command } from "@feinwaru/templates";

export default command({
  match: "rawrxd",
  script: event => {
    console.log("teehee");
  }
});
```

```js
// command without helper

import { guild } from "@feinwaru/db";

export default async event => {
  if (event.type !== "message") {
    return;
  }

  const guildInfo = await guild.fetch(event.content..guildId);
  if (guildInfo == null) {
    return;
  }

  const { prefix } = guildInfo;
  const message = event.content.text;
  if (!message.startsWith(`${prefix}rawrxd`)) {
    return;
  }

  console.log("rawrxd");
}
```

```js
// command helper

import { guild } from "@feinwaru/db";

export default async options => {
  return async event => {
    const { match, script } = options;

    if (typeof match !== "string") {
      // error
      return;
    }

    if (typeof script !== "function") {
      // error
      return;
    }

    // data in guildId prevents it from being called at 'compile' time
    const guildInfo = await guild.fetch(event.content..guildId);
    if (guildInfo == null) {
      return;
    }

    const { prefix } = guildInfo;
    const message = event.content.text;
    if (!message.startsWith(`${prefix}${match}`)) {
      return;
    }

    script(event);
  }
};
```
