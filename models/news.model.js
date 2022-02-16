const db = require('../db/connection');

//#3 endpoint model:
exports.fetchTopics = () => {
  let queryStr = `SELECT * FROM topics`;
  return db.query(queryStr).then(({ rows: topics }) => {
    return topics;
  });
};
