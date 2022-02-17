const express = require('express');

const {
  getTopics,
  getArticle,
  patchArticleById,
} = require('./controllers/news.controller.js');

const app = express();
app.use(express.json());
// #3 api/topics/endpoint
app.get('/api/topics', getTopics);

//#14 GET /api/articles/:article:id
app.get('/api/articles/:article_id', getArticle);

//#7 PATCH /api/articles/:article_id
app.patch('/api/articles/:article_id', patchArticleById);

// handles 404- path err
app.all('/api/*', (req, res) => {
  res.status(404).send({ msg: 'Path not found' });
});

//psql err handler - if err  22P02
app.use((err, req, res, next) => {
  console.log(err, 'ERROR!!');
  if (err.code === '22P02' || err.code === '23502')
    res.status(400).send({ msg: 'Bad request' });
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
