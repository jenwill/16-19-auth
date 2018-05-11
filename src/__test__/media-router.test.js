'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { pCreateMediaMock, pRemoveMediaMock } from './lib/media-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES AT /media', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveMediaMock);

  describe('POST 200 for successful post to /media', () => {
    test('should return 200 for successful media post', () => {
      // only do this if you have a slow computer AND you want to make a real API call to S3
      // jest.setTimeout(10000);
      return pCreateMediaMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.post(`${apiURL}/media`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'Marbles Bitmap')
            .attach('media', `${__dirname}/assets/marbles.bmp`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('Marbles Bitmap');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        })
        .catch((err) => {
          console.log(err.message, 'ERR IN TEST');
          console.log(err.status, 'CODE ERR IN TEST');
          expect(err.status).toEqual(200);
        });
    });
  });
});
