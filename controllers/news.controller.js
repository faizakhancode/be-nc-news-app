const { fetchTopics, fetchArticleById } = require('../models/news.model.js');

//#3 GET api/topics
exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

//#14 GET api/articles/:article_id
exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
