import axios from 'axios';
import {
    getFAQQuestions,
    getFAQResponseById,
    getResponse
}
    from '../../services/QnAService';

jest.mock('axios');

describe('tQnAService', () => {

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('getFAQQuestions should fetch an appropriate data', async () => {

        const rawRes = { data: [
            { category: 'mno' }, 
            { category: 'xyz' }, 
            { category: 'abc' }
        ] };
        axios.get.mockResolvedValue(rawRes);

        // --- Call getFAQQuestions with the default input

        const actRes = await getFAQQuestions();

        const expRes = [
            { category: 'abc' },
            { category: 'mno' }, 
            { category: 'xyz' } 
        ];

        expect(actRes).toEqual(expRes);

        let category = 'All';

        const getExpApi = catName => `/getfaqquestions?category=${catName}`;
        expect(axios.get).toHaveBeenCalledWith(getExpApi(category));


        // --- Call getFAQQuestions with a particular category
        jest.resetAllMocks();
        axios.get.mockResolvedValue({ data: [ rawRes.data[1] ] });

        category = 'mno';

        const actResWithInput = await getFAQQuestions(category);

        expect(actResWithInput).toEqual([ expRes[1] ]);
        expect(axios.get).toHaveBeenCalledWith(getExpApi(category));

    });

    it('getFAQResponseById should fetch an appropriate data', async () => {

        const expRes = { data: 'mockedData' };
        axios.get.mockResolvedValue(expRes);

        const myId = 'myId';
        const actRes = await getFAQResponseById(myId);

        expect(actRes).toEqual(expRes.data);
        expect(axios.get).toHaveBeenCalledWith(`/getfaqresponse?id=${myId}`);
    });

    it('getResponse should fetch an appropriate data', async () => {

        const expRes = { data: 'mockedData' };
        axios.get.mockResolvedValue(expRes);


        // --- Call getResponse with a valid query
        let myQuery = 'myQuery';
        const actRes = await getResponse(myQuery);

        expect(actRes).toEqual(expRes.data);

        const getExpApi = query => `/getqnaresponse?msg=${query}`;
        expect(axios.get).toHaveBeenCalledWith(getExpApi(myQuery));

        // --- Call getResponse and a reject GET request is called
        // An empty array should be returned

        jest.resetAllMocks();
        axios.mockRejectedValue(new Error('Async error'));

        myQuery = 'rejectedRes'
        const actResReject = await getResponse(myQuery);

        expect(actResReject).toEqual([]);
        expect(axios.get).toHaveBeenCalledWith(getExpApi(myQuery));

    });
});