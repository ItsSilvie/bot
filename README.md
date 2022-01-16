<p align="center">
  <a href="https://discord.com/api/oauth2/authorize?client_id=930856109189767188&permissions=412317142016&scope=bot%20applications.commands">
    <img src="https://i.imgur.com/ZHrhzkk.png" alt="Invite silvie to your server">
  </a>
  <br>
  <a href="https://discord.gg/bC6uWYvM4G">
    <img src="https://i.imgur.com/VmY97I7.png" alt="Silvie Bot Discord server">
  </a>
</p>

# Silvie, Discord Bot

Silvie is a fan-made open source Grand Archive Discord Bot which provides some useful chat commands.

![Silvie](https://i.imgur.com/KUzh2dC.png)

Not sure what Grand Archive is? Head on over to their website: [https://www.grandarchivetcg.com](https://www.grandarchivetcg.com).

## Add Silvie to your Discord server

You can add Silvie to your own Discord server by clicking on the _Materialize_ image at the top or by clicking [here](https://discord.com/oauth2/authorize?client_id=930856109189767188&permissions=414464609280&scope=bot%20applications.commands).

If you'd rather preview Silvie in action first, clicking the _Live Preview_ image at the top (or clicking [here](https://discord.gg/bC6uWYvM4G)) will invite you into a test server where Silvie is running. You can also use that server to report bugs or suggestions.

## Contents

- [Add Silvie to your Discord server](#add-silvie-to-your-discord-server)
- [Commands](#commands)
  - [Card search](#card-search)
  - [Gameplay help](#gameplay-help)
  - [Random card](#random-card)
- [Data](#data)
  - [Adding new sets](#adding-new-sets)
  - [Adding cards to sets](#adding-cards-to-sets)
- [Development](#development)
  - [Create your own Discord bot](#create-your-own-discord-bot)
  - [Create a Discord server to test the bot in](#create-a-discord-server-to-test-the-bot-in)
  - [Invite your bot to your server](#invite-your-bot-to-your-server)
  - [Set up the dev environment](#set-up-the-dev-environment)
  - [Building and running Silvie locally](#building-and-running-silvie-locally)
- [Deployment](#deployment)

## Commands

`/silvie` is the main command used to communicate with Silvie, ensuring no clashes with other bots.

Subcommands are the way to then request different things. These are phrases placed after the `/silvie` command, e.g. `/silvie help`.

Below are the commands Silvie supports:

### Card search

```
/silvie search [set] [card]
```

Reveal information about a given card in a given set.

- `set` - The name of a set;
- `card` - The full or partial name of a card within that set.


Set names are prompted by Silvie:

![Search: Selecting a set](https://i.imgur.com/QGRkxuQ.png)

Card names can be full or partial:

![Search: Typing a partial card's name](https://i.imgur.com/NI14j8g.png)

The result is an embed with the full card text and attributes, along with an expandable image of the card (if present):

![Search: Result](https://i.imgur.com/vRCUe69.png)

Clicking on a thumbnail reveals the full card image:

![Search: Result image](https://i.imgur.com/xvGxLiH.png)

Silvie will display a maximum of 3 cards as embeds. To prevent spam, if more than 3 cards are found it will pick 2 of those at random to display.

### Gameplay help

```
/silvie help [topic]
```

- `topic` - A topic to get help about.

Reveal quick FAQ-style help about a specific topic, such as Class Bonuses or Intercepting.

![Help command in action](https://i.imgur.com/eYogbcb.png)

### Random card

```
/silvie random [set (optional)]
```

- `set` (optional) - only include cards from a specific set.

Reveals a card chosen at random from a set chosen at random (unless otherwise specified).

## Data

The responses the bot produces are generated by data contained in `src/data`.

### Adding new sets

Create a new set in `data/sets.ts`. Sets are built using the `Set` type defined in `data/types.ts`.

The filename property will need to match the name of an accompanying file that will need to be created in the `data/sets` folder. The format for these filenames should be `[release year]-[release month] [set name].ts` to maintain a logical order.

Create the accompanying file. This is where card information should be stored...

### Adding cards to sets

Locate the file in `data/sets` which matches the `filename` field associated with the set.

This file should return an array of `Card` type objects as defined in `data/types.ts`.

Some helper types and enums exist to make this process a bit easier:

- The `CardCost` enum denotes the different cost types;
- The `CardElement` enum denotes the different elements;
- The `CardEffect` enum denotes special effects within the card body text (e.g. Intercept);
- The `CardEffectBody` type adds options to body text to avoid repetition;
- The `CardSpeed` enum denotes the different speeds;
- The `CardStats` type groups `attack`, `durability` and `health`;
- The `CardSubtype` enum denotes the different subtypes (e.g. Bauble);
- The `CardSupertype` enum denotes the different supertypes (e.g. Warrior);
- The `CardType` enum denotes the different card types (e.g. Champion);
- The `CardVariant` enum denotes special variants (e.g. Foil).

#### Adding card effects to cards

Card effects are applied to cards as a collection of `[CardEffect, CardEffectBody]` arrays representing individual lines on the card.

`CardEffect` needs adding if the line begins with emboldened effect text, but this can be set to `undefined` if that is not the case.

`CardEffectBody` can either be a string for flat text, or an object with additional properties if the line contains additional conditions:

- The `isClassBonus` boolean denotes the presence of a circled "Class Bonus" condition;
- The `isFocus` boolean denotes the presence of a circled "Focus" condition;
- The `isRestedUponUse` boolean denotes the presence of a rest symbol;
- The `levelRestriction` string denotes a level restriction condition;
- The `text` string denotes the remainder of the line text.

These enum values and properties are handled by the `getCardBody` function in `utils/card.ts`.

##### Example 1: An enter effect and an additional line of Discord-friendly markdown text

```
[
  [CardEffect.Enter, "Some text here"],
  [undefined, "*(Some italic text)*"]
]
```

> **Enter Effect**: Some text here
> 
> *(Some italic text)*

##### Example 2: A single Intercept effect

```
[
  [CardEffect.Intercept, undefined],
]
```

> **Intercept** *(When your champion becomes a target of an attack, you may redirect that attack to this ally.)*

##### Example 3: A level restriction and a class bonus with some additional text

```
[
  [undefined, {
    isClassBonus: true,
    levelRestriction: '2+',
    text: 'Some text here',
  }]
]
```

> `Class Bonus` `Level 2+` Some text here

##### Example 4: A single Flux effect with a focus restriction

```
[
  [CardEffect.Flux, {
    isFocus: true,
  }]
]
```

> `Focus` **Flux** *(Discard your hand at end of turn.)*

## Development

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

Under _Bot Permissions_ tick `Read Messages/View Channels`, `Send Messages`, `Send Messages in Threads`, `Embed Links`, `Use External Emojis`, `Use External Stickers`.

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

`yarn build-all` will compile all of the TypeScript files from `src` into `dist`. You'll need to run this every time a change is made. This also updates all of the Discord commands Silvie implements.

Note: A "Missing Access" error from Discord means that your bot hasn't been configured correctly. Check the scopes and permissions, check the `.env` variables and check that your bot is a member on your Discord server, then try again.

If you only want to compile but not push up new Discord commands, you can run `yarn build` instead.

#### Run

`yarn start` runs Silvie locally once built.

You should see "Ready!" output in terminal. Head to your Discord server and you should see that your bot is now online.

![New bot is now online in new server](https://i.imgur.com/5K5ZItS.png)

## Deployment

The main Silvie bot is up and running on Heroku, but you can use whichever platform you like.

Remember to modify the `package.json` entries to point to your own repository.

![https://devcenter.heroku.com/articles/git](https://www.herokucdn.com/deploy/button.png)

You'll need to make sure the vars stored in your `.env` file are accessible by the service you're deploying on. If your intention is to only ever run your version of Silvie on a single server, you can copy all of the environment variables over from your `.env` file. If you want Silvie to work on multiple servers, remove the `GUILD_ID` variable.