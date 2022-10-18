const request = require('supertest');
const baseURL = 'http://localhost:8080';

const reqServer = request(baseURL);

describe('Test getfaqquestions api', () => {
    test('without parameter and category=All', async () => {
        const resNoParam = await reqServer.get("/getfaqquestions")
                                    .expect(200);
        const actDataNoParam = resNoParam.body;
        expect(actDataNoParam.length).toBeGreaterThan(1);

        const expData0 = {
            id: expect.any(Number),
            category: expect.any(String),
            categoryLabel: expect.any(String),
            question: expect.any(String),
            source: expect.any(String),
            sourceName: expect.any(String)
          }
      
        expect(actDataNoParam[0]).toMatchObject(expData0);

        // ---- Test: with parameter category=All
        // The response must be the same as when query without any parameter
        const resAll = await reqServer.get('/getfaqquestions?category=All');

        expect(resAll.body).toMatchObject(actDataNoParam);
    });

    test('a specific category name without spaces', async () => {

        const catName = 'General';
        const res = await reqServer.get(`/getfaqquestions?category=${catName}`)
                            .expect(200);

        expect(res.body.length).toBeGreaterThan(1);

    });

    test('a specific category name with spaces', async () => {

        const catName = 'Contraception and family planning';
        const res = await reqServer.get(`/getfaqquestions?category=${catName}`)
                            .expect(200);

        expect(res.body.length).toBeGreaterThan(1);

    });

    test('invalid category name', async () => {
        const res = await reqServer.get('/getfaqquestions?category=invalidCategory')
                            .expect(200);
        
        expect(res.body).toHaveLength(0);
    });

    test('invalid parameter name', async () => {

        // When an invalid parameter name is used, all faq questions
        // will be returned
        const res = await reqServer.get('/getfaqquestions?invalidparam=somevalue')
                            .expect(200);
        expect(res.body.length).toBeGreaterThan(1);
    });

});