# Silvie, Discord Bot

Silvie is a fan-made open source Grand Archive Discord Bot which provides some useful chat commands.

![Silvie](https://i.imgur.com/KUzh2dC.png)

Not sure what Grand Archive is? Head on over to their website: [https://www.grandarchivetcg.com](https://www.grandarchivetcg.com).

## Contents

- [Add Silvie to your Discord server](#add-silvie-to-your-discord-server)
- [Commands](#commands)
  - [Card search](#card-search)
  - [Gameplay help](#gameplay-help)
- [Development](#development)
  - [Create your own Discord bot](#create-your-own-discord-bot)
  - [Create a Discord server to test the bot in](#create-a-discord-server-to-test-the-bot-in)
  - [Invite your bot to your server](#invite-your-bot-to-your-server)
  - [Set up the dev environment](#set-up-the-dev-environment)
  - [Building and running Silvie locally](#building-and-running-silvie-locally)
- [Deployment](#deployment)

## Add Silvie to your Discord server

You can add Silvie to your own Discord server with the URL below:

### **[Get Silvie](https://discord.com/oauth2/authorize?client_id=930856109189767188&permissions=414464609280&scope=bot%20applications.commands)**

If you'd rather preview Silvie in action first, join the [Silvie Bot Discord server](https://discord.gg/KrPepDcBRh).

## Commands

`/silvie` is the main command used to communicate with Silvie, ensuring no clashes with other bots.

Subcommands are the way to then request different things. These are phrases placed after the `/silvie` command, e.g. `/silvie help`.

Below are the commands Silvie supports:

### Card search

```
/silvie search [set] [card]
```

Reveal information about a given card in a given set.

- `set` - The name of a set (prompted by Discord);
- `card` - The full or partial name of a card within that set.

This displays full card text and attributes, along with an expandable image of the card (if present).

![Search: Selecting a set](https://i.imgur.com/QGRkxuQ.png)

![Search: Typing a partial card's name](https://i.imgur.com/NI14j8g.png)

![Search: Result](https://i.imgur.com/vRCUe69.png)

If an image is available it will also a thumbnail for the card in the response, as seen above. When clicked, this reveals the full image:

![Search: Result image](https://i.imgur.com/xvGxLiH.png)

Silvie will display a maximum of 3 cards as embeds. To prevent spam, if more than 3 cards are found it will pick 2 of those at random to display.

### Gameplay help

```
/silvie help [topic]
```

Reveal quick FAQ-style help about a specific topic, such as Class Bonuses or Intercepting.

![Help command in action](https://i.imgur.com/eYogbcb.png)

## Development

Silvie is 

Silvie is a Node.js bot built in TypeScript on top of [discord.js](https://discord.js.org). Getting up and running with your own local version of Silvie couldn't be easier.

Follow the steps below to get started.

### Create your own Discord bot

Silvie runs as a Discord Application. To begin, head to [https://discord.com/developers/applications](https://discord.com/developers/applications) and click _New Application_.

Name your application whatever you like. You'll now be taken to your application's dashboard. Head into the _Bot_ tab and click _Add Bot_.

Your bot is now ready for Silvie, let's now set up the dev environment...

### Create a Discord server to test the bot in

In your Discord app, create a new server for your local version of Silvie to run on.

If you need help, check out this article on Discord's FAQ: [How do I create a server?](https://support.discord.com/hc/en-us/articles/204849977-How-do-I-create-a-server-).

### Invite your bot to your server

Bots are added to Discord servers by accessing specific URLs relating to the bot in question.

In your Discord application's dashboard, head into the _OAuth2_ tab and then into _URL Generator_.

Under _Scopes_, tick `bot` and `applications.commands`.

Under _Bot Permissions_ tick `Read Messages/View Channels`, `Send Messages`, `Send Messages in Threads`, `Embed Links`, `Use External Emojis`, `Use External Stickers` and `Use Slash Commands`.

Now copy the generated URL into your browser's address bar. Discord will ask you which server you want to add your bot to - simply select the one you made in the step above.

In Discord you'll now see that your bot has been added to your server and is offline.

![New bot added to new server](https://i.imgur.com/Oa6TUpx.png)

### Set up the dev environment

Clone this repository, if you haven't already, and then install the dependencies using `yarn install` (if you don't have Yarn, you can get it from [https://yarnpkg.com](https://yarnpkg.com/)).

In the root directory, create a new file called `.env` and copy in the below snippet:

```
CLIENT_ID=XXX
GUILD_ID=XXX
TOKEN=XXX
```

You'll want to replace those XXX's with information about your Discord bot and the server you've created.

`CLIENT_ID` and `TOKEN` can be found in your Discord application's dashboard: `CLIENT_ID` can be found in the _OAuth2_ tab and `TOKEN` can be found in the _Bot_ tab.

**Important:** Never share your Bot's token with anybody.

`GUILD_ID` can be obtained by right clicking your server's name and selecting _Copy ID_.

We're now ready to build the bot...

### Building and running Silvie locally

#### Build

`yarn build` will compile all of the TypeScript files from `src` into `dist`. You'll need to run this every time a change is made. This also updates all of the Discord commands Silvie implements.

Note: A "Missing Access" error from Discord means that your bot hasn't been configured correctly. Check the scopes and permissions, check the `.env` variables and check that your bot is a member on your Discord server, then try again.

#### Run

`yarn start` runs Silvie locally once built.

You should see "Ready!" output in terminal. Head to your Discord server and you should see that your bot is now online.

![New bot is now online in new server](https://i.imgur.com/5K5ZItS.png)

## Deployment

The main Silvie bot is up and running on Heroku, but you can use whichever platform you like.

Remember to modify the `package.json` entries to point to your own repository.

![https://devcenter.heroku.com/articles/git](https://www.herokucdn.com/deploy/button.png)

You'll need to make sure the vars stored in your `.env` file are accessible by the service you're deploying on. If your intention is to only ever run your version of Silvie on a single server, you can copy all of the environment variables over from your `.env` file. If you want Silvie to work on multiple servers, remove the `GUILD_ID` variable.
