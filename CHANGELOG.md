# Changelog
All notable changes to this project will be documented in this file.

## [3.1.0] - 26/01/2019
### Added
- Added a trophy for reaching 1000 shits
- "I selled my wife for internet connection" message on 500 errors
- Added Overwatch Stats command, `-ow`
    ![](https://cdn.discordapp.com/attachments/508629797421973504/535949487722463243/unknown.png)

- Added the ability to View source of scripts on the Marketplace
    ![](https://cdn.discordapp.com/attachments/508629797421973504/535950123507646494/unknown.png)

- Added the ability for server admins to unbind any binding/all bindings from the server
  - `-unbind <script name>`
  - `-unbind-all`
- Added pagination to the `-help` command
- Added the ability to view help for any vanilla command
    ![](https://cdn.discordapp.com/attachments/508629797421973504/535953710778548235/unknown.png)
- Added better prefixes to the marketplace
- Added a sorting system for scripts. Now sorted by use count by default
- Added issue templates to the GitHub repo
- Fixed and Added extra timezones to the `-times` command
- [Added AWESOM-O Documentation](https://awesomo.feinwaru.com/docs/welcome)
    - [Welcome](https://awesomo.feinwaru.com/docs/welcome)
    - [Dashboard](https://awesomo.feinwaru.com/docs/dashboard)
    - [Marketplace](https://awesomo.feinwaru.com/docs/marketplace)
    - [Basic Script Editor](https://awesomo.feinwaru.com/docs/basic-script-editor)
    - [Advanced Script Editor](https://awesomo.feinwaru.com/docs/advanced-script-editor)
    - [Patron Management Panel](https://awesomo.feinwaru.com/docs/patron-management-panel)
    - [Translating AWESOM-O](https://awesomo.feinwaru.com/docs/translate)
- Added a sexy af README
- Added a script permissions page where you can whitelist/blacklist users or roles from using certain scripts

### Fixes, Changes, and removals
- Fixed vulnerability security alert
- Patron Management Panel
  - Easier to read colour scheme
  - Fixed add/remove server switch bug
  - Added "Add to server" button
- Fixed Wikia encodeUriParams issue
- Fixed issue with the `-avatar` command and GIFs
- Changed the ESLint configuration
- Fixed the help command having conflicts `match_type: includes`
- Improved branches on GitHub to use a more efficient and secure way of version controlling
- Releases are now structured correctly
- Fixed the `-fm` command
- Fixed the AWESOM-O icon not appearing on: 
    - `-activeme`
    - `-activeglobal`
    - `-activeguild`
    - `-nathan`
    - `-toweli`
    - `-shitme`
    - `-shitguild`
    - `-shitglobal`
- Fixed /api/v3/guilds/@me?noawesomo erroring if there are no AWESOM-O guilds
- Fixed script permissions
- Updated Patrons on the homepage
