import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('GET /api/trips', () => {
  test('returns all seeded trips as JSON', async () => {
    const response = await request(app).get('/api/trips');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toHaveLength(6);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'alpine-panorama',
          name: 'Alpine Panorama Express',
          startStation: 'nagoya',
          endStation: 'toyama',
        }),
      ])
    );
  });
});

describe('GET /api/trips/:id', () => {
  test('returns one trip by its custom ID', async () => {
    const response = await request(app).get('/api/trips/alpine-panorama');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 'alpine-panorama',
      name: 'Alpine Panorama Express',
      operatingMonths: expect.arrayContaining([4, 11]),
    });
  });

  test('returns 404 JSON when no trip has the requested ID', async () => {
    const response = await request(app).get('/api/trips/not-a-trip');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Trip not found' });
  });
});

describe('Trips pages', () => {
  test('renders a dynamic trip-list shell without EJS trip cards', async () => {
    const response = await request(app).get('/trips');

    expect(response.status).toBe(200);
    expect(response.text).toContain('id="trips-list"');
    expect(response.text).toContain('id="trip-card-template"');
    expect(response.text).toContain('/js/trips.js');
    expect(response.text).not.toContain('Alpine Panorama Express');
  });

  test('renders trip details and the existing schedule booking links', async () => {
    const response = await request(app).get('/trips/alpine-panorama');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Alpine Panorama Express');
    expect(response.text).toContain('08:30');
    expect(response.text).toContain('/trips/booking/1');
  });

  test('renders the not-found page for an unknown trip', async () => {
    const response = await request(app).get('/trips/not-a-trip');

    expect(response.status).toBe(404);
    expect(response.text).toContain('<h1>Page Not Found</h1>');
  });
});

describe('Trips API documentation', () => {
  test('documents both Trips API routes and the not-found response', async () => {
    const response = await request(app).get('/api-docs.json');

    expect(response.status).toBe(200);
    expect(response.body.paths).toHaveProperty('/api/trips');
    expect(response.body.paths).toHaveProperty('/api/trips/{id}');
    expect(response.body.paths['/api/trips/{id}'].get.responses).toHaveProperty('404');
  });

  test('serves the Swagger UI', async () => {
    const response = await request(app).get('/api-docs/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.text).toContain('swagger-ui');
  });
});
