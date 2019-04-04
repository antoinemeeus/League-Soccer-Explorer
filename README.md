# Football_League_Explorer

## Welcome to my mobile web app.

This web app let you explore different matches for different European Leagues!
See here the [demo link](https://soccer-league-explorer-webapp.netlify.com/)

_Works best on mobile size screens. Not optimise for desktop_

You can choose a League and see what were the result of the last matches for the current season and some lineups for the following matches.
If the information is present (hardcoded JSON files in this demo, because information on RESTfull API on soccer leagues are a paid service for the majority of cases),
you can also see some information on the team and players.

## Chat

This application has a Firebase based realtime chat! You need a Google account to authentificate and you can let comments on matches and post messages on the general chat!
_The messages are all public and can be change or erased anytime due to exposition of fireStore config_

## Project setup

### Set environement variables for KEYS and change FireStore config:

To succesfully deploy and run this app you will need the 2 following API KEYS/TOKEN put inside a .env file or set as environement variables:

```
VUE_APP_API_TOKEN = YOUR_OWN_FOOTBALL-DATA_API_KEY
VUE_APP_FIRESTORE_TOKEN = YOUR_OWN_FIRESTORE_TOKEN

```

- The VUE_APP_API_TOKEN variable refers to othe API KEY from the football-data website: https://api.football-data.org .

- The VUE_APP_FIRESTORE_TOKEN variable refers to the FireStore from Google database, but this implementation of environement variable was only to obfuscate a little my real-time chat Token.

The fireStore need a valid config variable and key token.

YOU WILL NEED TO ADAPT THE `config` variable in `main.js` for your own FireBase FireStore

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
