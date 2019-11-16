This file will help you get familiar with the repo after which you should attempt tasks listed in the fixes.md file. The tips.md file outlines ways to fix the most common issues you may have.

The repo is composed of 4 main folders residing in src/:

bot - code strictly related to the discord bot, there will be nothing website related here.

web - only website code resides here, you wont be looking much in here unless you want to.

db - database schemas for mongo, we use mongo to store our data, schemas define the layout of our data.

utils - utility functions for bot and web, we dont like code duplication so anything thats used in both or just seems generally useful goes here.

IMPORTANT: The index.js in root dictates whether to start the bot, website, or both. Please start the minimum number of modules you need to avoid unnecessary complexity (if working only on the bot, only start the bot module). Also, the modules can be started in dev mode (which makes debugging easier) or release mode (which is probably maybe more performant but make debugging hell to set up).

I advise you to step through various parts of the code using the debugger of choice to visualise the code flow in the bot module as well as how all the parts come together. (You dont need to know every little detail, just the stuff you feel is important to be able to work on the codebase). A good first task here would be to find out how typing -card chooses the correct script to run and returns the result. Please repeat this with an api lookup script (e.g. wikia), the help script, and a non-local script (e.g. -owo) to determine how those work. Once you've done this, you may choose to continue but by now you should have a decent understanding of the inner workings of the bot.

At this point you can try adding some basic things like a new local script (try not to copy paste code, type it out even if youre just looking at another file and literally copying it). Try adding a script that calls a web api (make sure to stick to out current script layout for api calls - try to see where we put all the other files that access apis).

Once youve done the above, you can play around with the code more if you wish or attempt some of the things listed in fixes.md.
