process.env.NODE_ENV = 'test';

const assert = require('chai').assert;
const { suite, test } = require('mocha');
const knex = require('../knex');
const { addDatabaseHooks } = require('./utils');

suite(
  'trails seeds',
  addDatabaseHooks(() => {
    test('trails rows', done => {
      knex('trails')
        .orderBy('id', 'ASC')
        .then(actual => {
          const expected = [
		        {
		          id: 1,
		          name: 'GS Bowl',
		          resort_id: 1,
		          difficulty: "black"
		        },

						{
		          id: 2,
		          name: 'Dipper Bowl',
		          resort_id: 2,
		          difficulty: "black"
		        },

						{
		          id: 3,
		          name: 'Sierra Grande',
		          resort_id: 3,
		          difficulty: "black"
		        },

						{
		          id: 4,
		          name: 'The Wall',
		          resort_id: 4,
		          difficulty: "double-black"
		        },

						{
		          id: 5,
		          name: "The Palisades",
		          resort_id: 5,
		          difficulty: "double-black"
		        },

						{
		          id: 6,
		          name: 'Chukker',
		          resort_id: 6,
		          difficulty: "blue"
		        },

						{
		          id: 7,
		          name: 'Clipper',
		          resort_id: 7,
		          difficulty: "black"
		        },

						{
		          id: 8,
		          name: 'South Face',
		          resort_id: 8,
		          difficulty: "black"
		        }

		      ];

          for (let i = 0; i < expected.length; i++) {
            assert.deepEqual(
              actual[i],
              expected[i],
              `Row id=${i + 1} not the same`
            );
          }

          done();
        })
        .catch(err => {
          done(err);
        });
    });
  })
);
