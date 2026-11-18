const { Client, GatewayIntentBits, Events } = require('discord.js');
const { loadConfig } = require('./config');
const { executeTwssend } = require('./commands/twssend');

const config = loadConfig();
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.guild || !message.content.startsWith(config.prefix)) {
    return;
  }

  const [command, ...args] = message.content.slice(config.prefix.length).trim().split(/\s+/);
  if (command?.toLowerCase() !== 'twssend') {
    return;
  }

  await executeTwssend(message, args, config);
});

client.on(Events.Error, (error) => {
  console.error('Discord client error:', error);
});

client.login(config.token).catch((error) => {
  console.error('Unable to log in to Discord:', error);
  process.exitCode = 1;
});
