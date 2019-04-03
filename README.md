# Football_League_Explorer

## Welcome to my mobile web app.

This web app let you explore different matches for different European Leagues!
See here the [demo link](https://soccer-league-explorer-webapp.netlify.com/)

_Works best on mobile size screens. Not optimise for desktop_

You can choose a League and see what were the result of the last matches for the current season and some lineups for the following matches.
If the information is present (hardcoded JSON files in this demo, because information on RESTfull API on soccer leagues are a paid service for the majority of cases),
you can also see some information on the team and players.

##Chat

This application has a Firebase based realtime chat! You need a Google account to authentificate and you can let comments on matches and post messages on the general chat!

## Environement Variables for KEYS:

To succesfully deploy and run this app you will need the 2 following API KEYS/TOKEN put inside a .env file or set as environement variables:

```
VUE_APP_API_TOKEN = *YOUR_OWN_FIRESTORE_TOKEN*
VUE_APP_FIRESTORE_TOKEN = *YOUR_OWN_FIRESTORE_TOKEN*

```

- The VUE_APP_API_TOKEN variable refers to othe API KEY from the football-data website: https://api.football-data.org .
- The VUE_APP_FIRESTORE_TOKEN variable refers to the FireStore from Google database.

YOU WILL NEED TO ADAPT THE `config` variable in `main.js` for your own FireBase FireStore

## Project setup

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
