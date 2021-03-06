const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const db = require('../db/connection');
const { response } = require('express');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('All endpoints', () => {
  // Gives a 404 error message for an invalid path
  test('Return a 404- when given an invalid path', () => {
    return request(app)
      .get('/api/an-invalid-endpoint-path')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('Path not found');
      });
  });
  // #3 endpoint
  describe('GET- /api/topics', () => {
    //the length of the array obj
    test('status: 200-  responds with array of obj with the length of 3', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
  //#14 = GET /api/articles/:article:id
  describe('GET- /api/articles/:article_id', () => {
    // has 6, article_id is missing? it is a primary serial key so automatically generated= so just add to expect  -- add 200 status? (use test data article)
    test('status: 200, responds with an article object with specified properties', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
          const {
            body: { article },
          } = response;
          expect(article).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: expect.any(String),
            votes: 100,
            comment_count: '11',
          });
        });
    });
    // invalid article_id
    test('status: 400 responds with an error message for invalid article_id', () => {
      return request(app)
        .get('/api/articles/an-invalid-id')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    // Valid but non existing article_id
    test('status 404: responds with an error message for valid but non existing article_id', () => {
      return request(app)
        .get('/api/articles/100')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Article not found');
        });
    });
  });
  describe('Patch - /api/articles/:article_id', () => {
    // checks if votes have been incremented
    test('Status: 200 - Responds with votes incremented by inc_votes', () => {
      const newVote = { inc_votes: 20 };
      return request(app)
        .patch('/api/articles/1')
        .send(newVote)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.votes).toBe(120);
        });
    });
    // test for decrementing votes
    test('Status: 200 - Responds with votes decremented by inc_votes', () => {
      const newVote = { inc_votes: -20 };
      return request(app)
        .patch('/api/articles/1')
        .send(newVote)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.votes).toBe(80);
        });
    });
    //#7PATCH /api/articles/:article_id
    //write test for updated votes
    test('status:200 - Responds with the updated article object while ignoring any keys other than inc_votes', () => {
      const updatedArticle = {
        inc_votes: 20,
      };
      return request(app)
        .patch('/api/articles/1')
        .send(updatedArticle)
        .expect(200)
        .then((response) => {
          expect(response.body.article).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: expect.any(String),
            votes: 120,
          });
        });
    });
    //err handling:
    // test err for invalid votes
    test('status: 400 - Response with an error message for invalid votes', () => {
      const newVote = { inc_votes: 'twenty' };
      return request(app)
        .patch('/api/articles/2')
        .send(newVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    //test err for empty obj passed
    test('Status: 400 - Responds with error msg when user enters an empty vote', () => {
      const newVote = {};
      return request(app)
        .patch('/api/articles/2')
        .send(newVote)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
  });
  //#9 GET /api/articles
  describe('GET - /api/articles', () => {
    // tests the length of the array object
    test('status: 200, have length of 12 and correct properties in the obj', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(12);
          //check if it has correct properties
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    // #5 GET/api/articles/articleid/commentCount
    test('status 200 - responds with an array of objects', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: 1,
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              topic: expect.any(String),
              comment_count: expect.any(String),
            })
          );
        });
    });
  });
});

// #21GET /api/users
describe('GET /api/users', () => {
  test('status: 200 - Responds with user object which has the length of 4', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then((response) => {
        // response object has a single key of users
        expect(Object.keys(response.body)).toHaveLength(1);
        expect(Object.keys(response.body)[0]).toEqual('users');
        // arr of user objects is the expected length
        expect(response.body.users).toHaveLength(4);
        response.body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
  // articles should be sorted by date in descending order
  test('status: 200, articles sorted by votes, in descending order ', () => {
    return request(app)
      .get('/api/articles?sort_by= created_at')
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy('created_at', { descending: true });
      });
  });
});
