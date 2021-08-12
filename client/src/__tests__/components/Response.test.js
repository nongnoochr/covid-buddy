// To run test:
// % yarn test -- -t tResponse --verbose

import { render } from '@testing-library/react';

// Mock the 'Suggestion' component before loading the 'Response' component for testing

const mockedSuggestionText = 'I am a mocked Suggestion!!!';
jest.mock("../../components/QnA/Suggestion", () => {
    const ComponentToMock = () => <div><p>{mockedSuggestionText}</p></div>;
    return ComponentToMock;
});

// eslint-disable-next-line import/first
import Response from '../../components/QnA/Response';


// https://morioh.com/p/0475718676d4

describe('tResponse', () => {
    it('should show response data', () => { 
        let curRes = {
            id: 10,
            specialistsNearMe: {
                data: {
                    coords: [0, 0],
                    activities: []
                }
            }
        };
        const renderResult = render(<Response data={curRes} />); 
        expect(renderResult.getByText(mockedSuggestionText)).toBeInTheDocument();

        // debug document
        // screen.debug();
    });

    it.each([
        ['empty', {}],
        ['{id: -1}', {id: -1}]
    ])('Error text should be thrown when data is invalid -> "%s"', (text, input) => { 
        let curRes = input;
        const renderResult = render(<Response data={curRes} />); 

        expect(renderResult.getByText("Something is wrong. Please try again later.")).toBeInTheDocument();

        // console.log('renderResult: ', renderResult);
        // console.log('screen: ', screen);

        // debug document
        // screen.debug();
    });
});
    
// test('renders learn react link', () => {
//     let curRes = {};
//     render(<Response data={curRes} />);
//     // const linkElement = screen.getByText(/learn react/i);
//     // expect(linkElement).toBeInTheDocument();
// });