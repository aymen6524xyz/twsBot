const { PermissionFlagsBits } = require('discord.js');
const { parseMessageLink } = require('../message-link');
const { broadcastMessage } = require('../broadcaster');

function formatError(error) {
  if (error.code === 10003 || error.code === 10008) {
    return 'I could not find that channel or message.';
  }
  if (error.code === 50001 || error.code === 50013) {
    return 'I do not have permission to access the source message or server members.';
  }
  return 'The broadcast failed because Discord returned an API error.';
}

async function executeTwssend(message, args, config) {
  if (!message.member?.permissions.has(PermissionFlagsBits.Administrator)) {
    await message.reply('Only administrators can use this command.');
    return;
  }

  const source = parseMessageLink(args[0] || '');
  if (!source) {
    await message.reply('Usage: `?twssend [message_link]`');
    return;
  }

  const progress = await message.reply('Broadcast in progress...');

  try {
    await progress.edit('Retrieving the source message...');
    const result = await broadcastMessage(
      message.client,
      source,
    );
    await progress.edit(
      `Broadcast complete. Sent to ${result.delivered}/${result.total} server members${
        result.failed ? ` (${result.failed} could not be reached)` : ''
      }.`,
    );
  } catch (error) {
    console.error('Broadcast failed:', error);
    await progress.edit(formatError(error));
  }
}

module.exports = { executeTwssend };
