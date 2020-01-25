/api/v4

*** /users
GET
POST
- auth: admin
*** /users/me
GET
- auth: login
PATCH
- auth: login
DELETE
- auth: login
*** /users/:userId
GET
PATCH
- auth: admin
DELETE
- auth: admin

*** /guilds
GET
POST
- auth: admin
*** /guilds/:guildId
GET
PATCH
- auth: manageServer | admin | owner
DELETE
- auth: manageServer | admin | owner

*** /scripts
GET
POST
- auth: login
*** /scripts/:scriptId
GET
PATCH
- auth: login, author
DELETE
- auth: login, author

*** User
guid (to replace mongos objectId)
id (discord)
flags (admin, verified, etc.)
stats
achevements/trophies (guid)

*** Guild
guid
id
prefix
flags
scripts (guid)
... (perms)

*** Script
...

** Likes (Script + User)
guid
userId
scriptId

** Achievements/Trophies
guid
icon
colour
text
