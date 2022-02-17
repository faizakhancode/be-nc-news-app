const {
  fetchTopics,
  fetchArticleById,
  updateArticleById,
} = require('../models/news.model.js');

//#3 GET api/topics
exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      // console.log(err);
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
      // console.log(err);
      next(err);
    });
};

//#7 PATCH /api/articles/:article_id
exports.patchArticleById = (req, res, next) => {
  // console.log(req.params);
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
