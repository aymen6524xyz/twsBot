# TWS Broadcast Bot

This Discord.js v14 bot lets administrators repost a Discord message as an announcement.

## Setup

1. Install Node.js 18.17 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set:
   - `DISCORD_TOKEN`: the bot token.
4. Enable the privileged `Message Content` and `Server Members` intents, and invite the bot with the `Guilds` and `GuildMessages` gateway intents and permissions to view source channels and send direct messages.
5. Run `npm start`.

## Command

```text
?twssend https://discord.com/channels/<guild_id>/<channel_id>/<message_id>
```

Only members with the Administrator permission can use the command. The source message's text, embeds, and attachments are sent by direct message to every non-bot member of the linked message's server. Discord message links include a channel ID, and Discord requires that ID to retrieve the linked message; the bot does not search any other channels.
