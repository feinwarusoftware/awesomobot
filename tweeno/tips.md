0. Everything is explained to a point where, if any more info is requires, it can easily be found by googling the appropriate bits.

1. Always use wsl (windows susbsystem for linux), if you cannot use that, use bash instead - this repo is not designed to work with powershell or cmd.

2. None of this is supposed to be doable in a day, if you cant get something working for a while, come back to it after a few hours/days, but dont give up.

3. Remember to install your deps (yarn), to be running mongo locally (set the mongo fields in your config to null), and to fill out the necessary config filds (whats the minimum necessary stuff you need to fill in to just run the bot?)

4. Dont forget about good programming practices, i will immediately reject badly formatted or indented code, i dont care much how you did something tho (so dont worry if its not the most efficient or pretty way) - code readability + maintainability > performance

5. Dropping your mongo database when making schema changes will prevent many issues (do not drop anything other than your local db tho) - you can access your local mongo db through compass as well.

6. Youre free to push to master - but if you push broken code to master, it then becomes your responsibility to get it fixed - you might wanna consider pushing to another branch if you want me to review your code (it then becomes my responsibility if i approve broken code lel)

7. Q - why are you not using github issues/boards instead of this? A - cant be fucked.
