// To run test:
// % yarn test -- -t tHCPInfo --verbose

import { render, screen } from '@testing-library/react';
import HCPInfo from '../../components/QnA/HCPInfo';

const longLabel = 'address Long Label';
const testAddressInfo = {
    longLabel: longLabel,
    postalCode: '01760',
    country: 'US'
};

const data = {
    mainActivity: {
        workplace: {
            name: 'Workplace name',
            address: {
                ...testAddressInfo, 
                city: {label: 'Natick'},
                county: {label: 'MA'}
            }
        }
    },
    otherActivities: []
};

describe('tHCPInfo', () => {
    it('Workplace name should be visible', () => {

        const renderResult = render(<HCPInfo data={data} cur-longLabel={longLabel} />);
        expect(renderResult.getByText(data.mainActivity.workplace.name)).toBeInTheDocument();

        // screen.debug();
    });

    it.each([
        ...Object.entries(testAddressInfo),
        ['city', 'Natick'], 
        ['county', 'MA']
    ])
        ('Workplace address should contain appropriate information "%s"', (key, expected) => {

            render(<HCPInfo data={data} cur-longLabel={longLabel} />);

            const elWorkplace = screen.getByTestId('data-workplace');
            expect(elWorkplace).toHaveTextContent(expected);

        });
});