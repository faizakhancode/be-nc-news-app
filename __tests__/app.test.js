const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const db = require('../db/connection');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe.only('All endpoints', () => {
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
  describe('GET -/api/topics', () => {
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
});
