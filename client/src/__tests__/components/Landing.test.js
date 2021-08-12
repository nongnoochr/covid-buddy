// To run test:
// % yarn test -- -t tLanding --verbose

import renderer from 'react-test-renderer';


import HCPContext from '../../store/hcp-context.js';
import Landing from '../../components/Landing/Landing';


describe('tLanding', () => {
    it('Landing page should have an appropriate snapshot', () => {

        const snapshot = renderer
            .create(
                <HCPContext.Provider value={{
                    getLinkFindHCP: () => <a href="mockUrl">Mocked getLinkFindHCP</a>
                }}>
                    <Landing />
                </HCPContext.Provider>)
            .toJSON();
        expect(snapshot).toMatchSnapshot();

    });

});