const dotenv = require('dotenv');

dotenv.config();

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function loadConfig() {
  return {
    token: required('DISCORD_TOKEN'),
    prefix: '?',
  };
}

module.exports = { loadConfig };
