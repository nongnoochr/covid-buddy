const request = require('supertest');
const reqServer = request('http://localhost:8080');

describe('Test getqnaresponse api', () => {

    test('with a valid post message', async () => {
        const res = await reqServer.post('/getqnaresponse')
            .send({
                msg: 'Should I travel?'
            })
            .expect(200);

        const allRes = res.body;
        const resTop = allRes[0];

        const expData = {
            id: expect.any(Number),
            category: 'Travel advice for the general public',
            source: expect.any(String),
            question: 'Who should not travel?',
            response: expect.any(String),
            sourceName: 'WHO',
            categoryLabel: 'Travel advice for the general public (WHO)',
            predictedHCP: 'All',
            score: expect.any(Number)
        };

        expect(resTop).toStrictEqual(expData);
        expect(resTop.score).toBeGreaterThan(0.6);
        
    });

    test('with a valid post message', async () => {
        const res = await reqServer.post('/getqnaresponse')
            .send({
                invalid: 'msg'
            })
            .expect(200);

        const resTop = res.body[0];

        // A random response will be return for an invalid post message
        expect(resTop.score).toBeLessThan(0.5);;
        
    });

});