const {
  fetchTopics,
  fetchArticleById,
  updateArticleById,
  fetchArticles,
  fetchUsers,
} = require('../models/news.model.js');

//#3 GET api/topics
exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
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
      next(err);
    });
};

//#7 PATCH /api/articles/:article_id
exports.patchArticleById = (req, res, next) => {
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

//#9 GET /api/articles
exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  return fetchArticles(sort_by, order, topic).then((articles) => {
    res.status(200).send({ articles });
  });
};

//#21 GET /api/users
exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
