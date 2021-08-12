// To run test:
// % yarn test -- -t tHCLSDKService --verbose

global.HclAPI = jest.fn(() => ({}));

// eslint-disable-next-line import/first
import {
        defaultSDKConfig,
        quickSearchData,
        quickSearchSpecialtyCodes,
        getLinkLocation,
        getSpecialtyCode }
    from '../../services/HCLSDKService';


const expQuickSearchData = [
    {
        specialtyCode: 'SP.WUS.PD',
        specialtyLabel: 'PEDIATRICS'
    },
    {
        specialtyCode: 'SP.WUS.OBS',
        specialtyLabel: 'OBSTETRICS'
    },
    {
        specialtyCode: 'SP.WUS.P',
        specialtyLabel: 'PSYCHIATRY'
    }
]

describe('tHCLSDKService', () => {

    it('defaultSDKConfig should be expected', () => { 

        const expDefaultConfig = {
            apiKey: expect.anything(),
            appName: 'COVID-19 Buddy',
            appURL: 'https://covid-buddy.herokuapp.com/'
        };

        expect(defaultSDKConfig).toEqual(expDefaultConfig);
    });

    it('quickSearchData should be expected', () => { 

        expect(quickSearchData).toMatchObject(expQuickSearchData);
    });

    it('quickSearchSpecialtyCodes should be expected', () => { 

        const expSPCodes = ['SP.WUS.PD', 'SP.WUS.OBS', 'SP.WUS.P'];

        expect(quickSearchSpecialtyCodes).toEqual(expSPCodes);
    });

    it('getLinkLocation should return an expected output', () => { 

        const curLocation = {
            lat: '123',
            lon: '456'
        };

        const workplaceLocation = {
            lat: '222',
            lon: '333'
        };

        const actLink = getLinkLocation(curLocation, workplaceLocation);
        const expLink =  `https://www.google.com/maps/dir/${curLocation.lat},${curLocation.lon}/${workplaceLocation.lat},${workplaceLocation.lon}`;
        expect(actLink).toEqual(expLink);
    });

    it('getSpecialtyCode should return an expected output', () => { 

        const actCode = getSpecialtyCode(expQuickSearchData[0].specialtyLabel);
        const expCode = expQuickSearchData[0].specialtyCode;

        expect(actCode).toEqual(expCode);
    });

});


