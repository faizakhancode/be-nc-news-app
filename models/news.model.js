const db = require('../db/connection');

//#3 endpoint model:
exports.fetchTopics = () => {
  let queryStr = `SELECT * FROM topics;`;
  return db.query(queryStr).then(({ rows: topics }) => {
    return topics;
  });
};

//#14 GET api/articles/:article_id
exports.fetchArticleById = (id) => {
  // console.log(id);
  let queryStr = `SELECT * FROM articles WHERE article_id = $1;`;
  return db.query(queryStr, [id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'Article not found' });
    }
    // console.log(rows);
    return rows[0];
  });
};

//#7 PATCH /api/articles/:article_id
exports.updateArticleById = (article_id, inc_votes) => {
  let queryStr = `UPDATE articles 
  SET votes = votes + $1
  WHERE article_id = $2 
  RETURNING* ;`;
  return db.query(queryStr, [inc_votes, article_id]).then(({ rows }) => {
    return rows[0];
  });
};
