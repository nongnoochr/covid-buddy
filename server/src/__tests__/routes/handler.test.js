const { when } = require('jest-when');

jest.mock('../../QnAService', () => {
    const originalModule = jest.requireActual('../../QnAService');

    //Mock the default export and named export 'foo'
    return {
        __esModule: true,
        ...originalModule,
        getFAQQuestions: jest.fn(),
        getFAQResponseById: jest.fn(),
        getResponse: jest.fn()
    };
});

const { getFAQQuestions, getFAQResponseById, getResponse } = require('../../QnAService');
const { getfaqquestions, getfaqresponse, getqnaresponse } = require('../../routes/handler');

describe('Test getfaqquestions api', () => {

    const mockDataFAQQuestions = 'mock_faqquestions_data';

    const mockData = {
        req: {
            query: {
                category: 'General'
            }
        },
        res: {
            send: jest.fn()
        },
        next: jest.fn()
    };

    
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Positive cases', () => {

        beforeAll(() => {
            getFAQQuestions.mockResolvedValue(mockDataFAQQuestions);
        });

        test('with a parameter category', async () => {
            // The input category must be used to retrieve the FAQ questions data
            // specific to the input category
    
            await getfaqquestions(mockData.req, mockData.res, mockData.next);
    
            expect(getFAQQuestions).toHaveBeenCalledWith(mockData.req.query.category);
            expect(mockData.res.send).toHaveBeenCalledWith(mockDataFAQQuestions);
            expect(mockData.next).not.toHaveBeenCalled();
    
        });
    
        test('with an invalid parameter name', async () => {
            // The category 'All' must be used to retrieve the FAQ questions data
    
            const req = {
                query: {
                    invalidKey: 'SomeValue'
                }
            }; 
    
            await getfaqquestions(req, mockData.res, mockData.next);
    
            expect(getFAQQuestions).toHaveBeenCalledWith('All');
            expect(mockData.res.send).toHaveBeenCalledWith(mockDataFAQQuestions);
            expect(mockData.next).not.toHaveBeenCalled();
    
        });

    });

    describe('Negative cases', () => {

        const errMsg = 'Mock error from getFAQQuestions';

        beforeAll(() => {
            getFAQQuestions.mockRejectedValue(new Error(errMsg));
        });

        test('when getFAQQuestions errors out', async () => {
            // 
    
            await getfaqquestions(mockData.req, mockData.res, mockData.next);
    
            expect(getFAQQuestions).toHaveBeenCalledWith(mockData.req.query.category);
            expect(mockData.next).toHaveBeenCalledWith(new Error(errMsg));
            expect(mockData.res.send).not.toHaveBeenCalled();
    
        });

    });

    
});

// -----------------

describe('Test getfaqresponse api', () => {

    const mockDataFAQResponse= 'mock_faqresponse_data';

    const mockData = {
        req: {
            query: {
                id: 20
            }
        },
        res: {
            send: jest.fn(),
            sendStatus: jest.fn()
        },
        next: jest.fn()
    };


    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Positive cases', () => {

        beforeAll(() => {

            getFAQResponseById.mockResolvedValue(mockDataFAQResponse);
        });

        test('with a parameter id', async () => {
            // The input id must be used to retrieve the FAQ response data
            // specific to the input id
    
            await getfaqresponse(mockData.req, mockData.res, mockData.next);
    
            expect(getFAQResponseById).toHaveBeenCalledWith(mockData.req.query.id);
            expect(mockData.res.send).toHaveBeenCalledWith(mockDataFAQResponse);
            expect(mockData.next).not.toHaveBeenCalled();
    
        });
    
        test('with an invalid parameter name', async () => {
            // The category 'All' must be used to retrieve the FAQ questions data
    
            const req = {
                query: {
                    invalidKey: 'SomeValue'
                }
            };

            // Use the jest-when library here to return a null data when the id is -1
            // https://github.com/timkindberg/jest-when
            
            when(getFAQResponseById).calledWith(-1).mockResolvedValue(null);
    
            await getfaqresponse(req, mockData.res, mockData.next);
    
            expect(getFAQResponseById).toHaveBeenCalledWith(-1);
            
            expect(mockData.res.sendStatus).toHaveBeenCalledWith(400);
            expect(mockData.res.send).not.toHaveBeenCalled();

            expect(mockData.next).not.toHaveBeenCalled();
    
        });

    });

    describe('Negative cases', () => {

        const errMsg = 'Mock error from getFAQResponseById';

        beforeAll(() => {
            getFAQResponseById.mockRejectedValue(new Error(errMsg));
        });

        test('when getFAQResponseById errors out', async () => {
            // 
    
            await getfaqresponse(mockData.req, mockData.res, mockData.next);
    
            expect(getFAQResponseById).toHaveBeenCalledWith(mockData.req.query.id);
            expect(mockData.next).toHaveBeenCalledWith(new Error(errMsg));
            expect(mockData.res.send).not.toHaveBeenCalled();
            expect(mockData.res.sendStatus).not.toHaveBeenCalled();
    
        });

    });

});

// ----------------

describe('Test getqnaresponse api', () => {

    const mockDataQNAResponse= 'mock_getqnaresponse_data';

    const mockData = {
        req: {
            body: {
                msg: 'Mock QNA Message!'
            }
        },
        res: {
            send: jest.fn()
        },
        next: jest.fn()
    };


    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Positive cases', () => {

        beforeAll(() => {

            getResponse.mockResolvedValue(mockDataQNAResponse);
        });

        test('with a QNA message', async () => {
            // The input QNA message must be used to retrieve the QNA response data
    
            await getqnaresponse(mockData.req, mockData.res, mockData.next);
    
            expect(getResponse).toHaveBeenCalledWith(mockData.req.body.msg);
            expect(mockData.res.send).toHaveBeenCalledWith(mockDataQNAResponse);
            expect(mockData.next).not.toHaveBeenCalled();
    
        });
    
        test('with an invalid parameter name', async () => {
            // A single space will be used to pass into the getResponse function
            // when the input body parameter is invalid
    
            const req = {
                body: {
                    invalidKey: 'SomeValue'
                }
            };
    
            await getqnaresponse(req, mockData.res, mockData.next);
    
            expect(getResponse).toHaveBeenCalledWith(' ');
            expect(mockData.res.send).toHaveBeenCalledWith(mockDataQNAResponse);
            expect(mockData.next).not.toHaveBeenCalled();
    
        });

        test('with an empty message', async () => {
            // A single space will be used to pass into the getResponse function
            // when an empty message is passed into the getqnaresponse function
    
            const req = {
                body: {
                    msg: ''
                }
            };
    
            await getqnaresponse(req, mockData.res, mockData.next);
    
            expect(getResponse).toHaveBeenCalledWith(' ');
            expect(mockData.res.send).toHaveBeenCalledWith(mockDataQNAResponse);
            expect(mockData.next).not.toHaveBeenCalled();
    
        });

    });

    describe('Negative cases', () => {

        const errMsg = 'Mock error from getResponse';

        beforeAll(() => {
            getResponse.mockRejectedValue(new Error(errMsg));
        });

        test('when getResponse errors out', async () => {
            // 
    
            await getqnaresponse(mockData.req, mockData.res, mockData.next);

            expect(getResponse).toHaveBeenCalledWith(mockData.req.body.msg);
            expect(mockData.next).toHaveBeenCalledWith(new Error(errMsg));
            expect(mockData.res.send).not.toHaveBeenCalled();    
        });

    });

});