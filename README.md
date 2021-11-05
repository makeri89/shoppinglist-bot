# Shoppinglist bot

This is a Telegram bot that can be used as shopping list. It runs on Node.js with grammY bot framework. The items are stored locally in sqlite database.

## Usage

Create your own Telegram bot and get the bot token for it, see intstructions [here](https://core.telegram.org/bots). Set your __.env__ file like this:

```
BOT_TOKEN=your-token-here
```

Run the command

```
npm install
```

Then you are ready to go, just run

```
npm start
```

and the bot is up. Alternatively, for development you can run

```
npm run dev
```

There is also a simple `Dockerfile` if you wish to start the bot in docker container. In that case, run

```
docker build . -t <your-image-name>
```
