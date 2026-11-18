const test = require('node:test');
const assert = require('node:assert/strict');
const { parseMessageLink } = require('../src/message-link');

test('parses a standard Discord message link', () => {
  assert.deepEqual(
    parseMessageLink('https://discord.com/channels/123/456/789'),
    { guildId: '123', channelId: '456', messageId: '789' },
  );
});

test('parses canary links and rejects direct-message links', () => {
  assert.deepEqual(
    parseMessageLink('https://canary.discord.com/channels/123/456/789/'),
    { guildId: '123', channelId: '456', messageId: '789' },
  );
  assert.equal(parseMessageLink('https://discord.com/channels/@me/456/789'), null);
});

test('rejects malformed links', () => {
  assert.equal(parseMessageLink('not-a-message-link'), null);
  assert.equal(parseMessageLink('https://discord.com/channels/123/456'), null);
});
