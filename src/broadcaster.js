const { AttachmentBuilder } = require('discord.js');

function createAnnouncementPayload(message, roleId) {
  const content = roleId
    ? message.content
      ? `<@&${roleId}>\n${message.content}`
      : `<@&${roleId}>`
    : message.content || undefined;

  const files = message.attachments.map(
    (attachment) =>
      new AttachmentBuilder(attachment.url, {
        name: attachment.name || undefined,
      }),
  );

  return {
    content,
    embeds: message.embeds.map((embed) => embed.toJSON()),
    files,
    allowedMentions: roleId ? { roles: [roleId] } : { roles: [] },
  };
}

async function fetchSourceMessage(client, source) {
  const channel = await client.channels.fetch(source.channelId);
  if (!channel || !channel.isTextBased() || !channel.messages) {
    throw new Error('The linked channel is inaccessible or does not contain messages.');
  }

  return channel.messages.fetch(source.messageId);
}

async function broadcastMessage(client, source) {
  const message = await fetchSourceMessage(client, source);
  if (
    !message.content &&
    message.embeds.length === 0 &&
    message.attachments.size === 0
  ) {
    throw new Error('The source message has no content, embeds, or attachments.');
  }

  const guild = await client.guilds.fetch(source.guildId);
  const members = await guild.members.fetch();
  const recipients = members.filter((member) => !member.user.bot);
  let delivered = 0;
  let failed = 0;

  for (const member of recipients.values()) {
    try {
      await member.send(createAnnouncementPayload(message));
      delivered += 1;
    } catch (error) {
      failed += 1;
      console.error(`Could not DM member ${member.id}:`, error);
    }
  }

  return { source: message, delivered, failed, total: recipients.size };
}

module.exports = { broadcastMessage, createAnnouncementPayload };
