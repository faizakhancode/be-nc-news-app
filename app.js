const express = require('express');

const { getTopics } = require('./controllers/news.controller.js');

const app = express();

// #3 api/topics/endpoint
app.get('/api/topics', getTopics);

// handles 404- path err
app.all('/api/*', (req, res) => {
  res.status(404).send({ msg: 'Path not found' });
});

module.exports = app;
