const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const db = require('../db/connection');

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
          // console.log(article, '<----- TEST');
          expect(article).toEqual({
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: expect.any(String),
            votes: 100,
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
});
