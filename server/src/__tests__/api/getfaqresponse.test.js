const request = require('supertest');
const reqServer = request('http://localhost:8080');

describe('Test getfaqresponse api', () => {

    test('with a valid id', async () => {
        const id = 3;
        const res = await reqServer.get(`/getfaqresponse?id=${id}`)
            .expect(200);

        const expData = {
            id: id,
            category: expect.any(String),
            source: expect.any(String),
            question: expect.any(String),
            response: expect.any(String),
            sourceName: expect.any(String),
            categoryLabel: expect.any(String),
            predictedHCP: expect.any(String)
        };
      
        expect(res.body).toMatchObject(expData);
    });


    test.each([
        {name: 'without parameter', api: '/getfaqresponse'},
        {name: 'with an invalid parameter name', api: '/getfaqresponse?invalidparam=value'},
        {name: 'with an invalid parameter value', api: '/getfaqresponse?id=-1'}
    ])('$name', async ({name, api})=> {

        await reqServer.get(api)
            .expect(400);
    });
    
});