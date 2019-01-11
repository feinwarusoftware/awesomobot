# API Reference

The AWESOM-O API is based around two core layers, a HTTPS/REST API for general operations, and persistent secure websocket based connection for sending and subscribing to real-time events

#### Base URL

```md
https://awesomo.feinwaru.com/api
```

## API Versioning

###### Some API and Gateway versions are now non-functioning, and are labeled as discontinued in the table below for posterity. Trying to use these versions will fail and return 400 Bad Request. {danger}

AWESOM-O exposes different versions of our API. You can specify version by including it in the request path like `https://awesomo.feinwaru.com/api/v{version_number}`. Omitting the version number from the route will route requests to the current default version (marked below accordingly). You can find the change log for the newest API version [here](/api/docs/change-logs).

#### API Versions

| Version | Status |
| ------- | ------ |
| 3 | Available |
| 2 | Discontinued |
| 1 | Discontinued |

---

## Authentication

Authenticating with the Discord API can be done in one of two ways:

1. Using a bot token gained by [registering a bot](#DOCS_TOPICS_OAUTH2/registering-applications), for more information on bots see [bots vs user accounts](#DOCS_TOPICS_OAUTH2/bot-vs-user-accounts).
2. Using an OAuth2 bearer token gained through the [OAuth2 API](#DOCS_TOPICS_OAUTH2/oauth2).

For all authentication types, authentication is performed with the `Authorization` HTTP header in the format `Authorization: TOKEN_TYPE TOKEN`.

###### Example Bot Token Authorization Header

```
Authorization: Bot MTk4NjIyNDgzNDcxOTI1MjQ4.Cl2FMQ.ZnCjm1XVW7vRze4b7Cq4se7kKWs
```

###### Example Bearer Token Authorization Header

```
Authorization: Bearer CZhtkLDpNYXgPH9Ml6shqh2OwykChw
```

## Encryption

All HTTP-layer services and protocols (e.g. http, websocket) within the Discord API use TLS 1.2.