const MESSAGE_LINK =
  /^https?:\/\/(?:canary\.|ptb\.)?discord(?:app)?\.com\/channels\/(\d+|@me)\/(\d+)\/(\d+)\/?$/i;

function parseMessageLink(value) {
  const match = value.trim().match(MESSAGE_LINK);
  if (!match || match[1] === '@me') {
    return null;
  }

  return {
    guildId: match[1],
    channelId: match[2],
    messageId: match[3],
  };
}

module.exports = { parseMessageLink };
