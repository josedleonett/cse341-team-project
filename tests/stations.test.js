import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('GET /api/stations', () => {
  test('returns the seeded stations as JSON', async () => {
    const response = await request(app).get('/api/stations');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'nagoya',
          name: 'Nagoya Station',
          prefecture: 'Aichi',
          region: 'central'
        })
      ])
    );
  });

  test('returns one station by ID', async () => {
    const response = await request(app).get('/api/stations/nagoya');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 'nagoya',
      name: 'Nagoya Station',
      facilities: expect.arrayContaining(['restaurant', 'tourist_info'])
    });
  });

  test('returns 404 JSON when the station does not exist', async () => {
    const response = await request(app).get('/api/stations/unknown-station');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Station not found' });
  });
});

describe('GET /trips/:tripId station details', () => {
  test('renders buttons for the trip stations and the details dialog', async () => {
    const response = await request(app).get('/trips/alpine-panorama');

    expect(response.status).toBe(200);
    expect(response.text).toContain('data-station-id="nagoya"');
    expect(response.text).toContain('data-station-id="toyama"');
    expect(response.text).toContain('id="station-details-dialog"');
    expect(response.text).toContain('/js/station-details.js');
  });
});

describe('GET /api/docs', () => {
  test('serves the Swagger UI', async () => {
    const response = await request(app).get('/api/docs/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.text).toContain('swagger-ui');
  });
});

describe('GET /api/openapi.json', () => {
  test('documents both station endpoints and their error responses', async () => {
    const response = await request(app).get('/api/openapi.json');

    expect(response.status).toBe(200);
    expect(response.body.paths).toHaveProperty('/api/stations');
    expect(response.body.paths).toHaveProperty('/api/stations/{id}');
    expect(response.body.paths['/api/stations/{id}'].get.responses).toHaveProperty('404');
  });
});
