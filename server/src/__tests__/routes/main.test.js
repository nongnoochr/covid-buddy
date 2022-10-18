const router = require('./../../routes/main');
const request = require('supertest');
const express = require('express');

const app = new express();
app.use(router);


describe('Test all routes', () => {

    test('responds to GET /getfaqquestions', async () => {
        const res = await request(app).get('/getfaqquestions?category=General');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.text).length).toBeGreaterThan(1);
    });

    test('responds to GET /getfaqresponse', async () => {
        const res = await request(app).get('/getfaqresponse?id=1');
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);

        const expData = {
            id: 1,
            category: expect.any(String),
            source: expect.any(String),
            question: expect.any(String),
            response: expect.any(String),
            sourceName: expect.any(String),
            categoryLabel: expect.any(String),
            predictedHCP: expect.any(String)
        };

        expect(JSON.parse(res.text)).toMatchObject(expData);
    });

    test('responds to POST /getqnaresponse', async () => {
        const res = await request(app).post('/getqnaresponse')
                        .send({
                            msg: 'Can I travel?'
                        });
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.text).length).toBe(5);
    }, 60000); // Increase timeout because the DL model needs to be initiated first for this api and it takes time

    test('responds to other requests should re-route to the homepage', async () => {
        const res = await request(app).get('/anyapi');
        expect(res.header['content-type']).toBe('text/html; charset=utf-8');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('<title>COVID-19 Buddy</title>');
    });

});
