// This file acts as the bridge between Vercel and your Express app
const app = require('../src/app');

// Vercel manages the server, so we just export our Express app
module.exports = app;