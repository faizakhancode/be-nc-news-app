const express = require('express');

const { getTopics, getArticle } = require('./controllers/news.controller.js');

const app = express();

// #3 api/topics/endpoint
app.get('/api/topics', getTopics);

//#14 GET /api/articles/:article:id
app.get('/api/articles/:article_id', getArticle);

// handles 404- path err
app.all('/api/*', (req, res) => {
  res.status(404).send({ msg: 'Path not found' });
});

//psql err handler - if err  22P02
app.use((err, req, res, next) => {
  if (err.code === '22P02') res.status(400).send({ msg: 'Bad request' });
  next(err);
});

//custom err handler- ones we force
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  // console.log(err, ' <--- ERROR');
});
module.exports = app;