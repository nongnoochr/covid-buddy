// Update the apiKey value below to a valid HealthcareLocator's apiKey
const defaultSDKConfig = {
    // apiKey: '300131ea848b420a', // Not working
    apiKey: '300142b840f95490',
    appName: 'COVID-19 Buddy',
    appURL: 'https://covid-buddy.herokuapp.com/'
};

const quickSearchData = [
    // {
    //     specialtyCode: '',
    //     specialtyLabel: 'All'
    // },
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

const getSpecialtyCode = (specialtyLabel) => {
    const spCode = quickSearchData.find(item => item.specialtyLabel === specialtyLabel)['specialtyCode'];
    return spCode;
};

/**
 * Get data of the suggested specialists near the user
 * @param {object} res Response object
 * @returns {object} Data of the near by suggested specialists
 */
const getSuggestedSPsNearMe = async (res) => {

    // Default value
    let specialistsNearMe = {
        applicable: false,
        data: {
            status: false,
            message: '',
            coords: { lat: -Infinity, lon: -Infinity },
            activities: []
        }

    }

    // Only find specialist data if the predicted HCP is not 'All'
    if (res.predictedHCP && (res.predictedHCP !== 'All')) {
        specialistsNearMe['applicable'] = true;

        const spCode = getSpecialtyCode(res.predictedHCP);

        // Get User's current location
        const getCoords = async () => {
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            return {
                lon: pos.coords.longitude,
                lat: pos.coords.latitude,
            };
        };

        let curCoords;
        try {
            curCoords = await getCoords();
        } catch (error) {
            specialistsNearMe['data']['status'] = false;
            if (error.code === error.PERMISSION_DENIED) {
                specialistsNearMe['data']['message'] = 'User location is turned off';
            } else {
                specialistsNearMe['data']['message'] = 'Error when getting user location';
            }

            return specialistsNearMe;
        }

        // Get the current coordinates
        const curLat = curCoords.lat;
        const curLon = curCoords.lon;

        // // Test: Natick!
        // const curLat = 42.2775;
        // const curLon = -71.3468;

        specialistsNearMe['data']['coords']['lat'] = curLat;
        specialistsNearMe['data']['coords']['lon'] = curLon;

        // ---------------

        // Next, query for the nearest specialist

        // eslint-disable-next-line no-undef
        const api = new HclAPI(defaultSDKConfig);

        // Query parameters for the activities api
        // Find maximum of 50 nearby specialists - Match the default maximum number
        // of results in Results screen in list mode
        // https://docs.healthcarelocator.com/index.htm#t=RefGuide%2FHealthCare_Locator_features.htm
        const params = {
            first: 50,
            offset: 0,
            specialties: [spCode],
            location: { lat: curLat, lon: curLon }
        };

        try {
            const getActivities = async () => {
                const result = await new Promise((resolve, reject) => {
                    api.activities(params)
                        .then(result => {
                            // Set the suggested specialists data
                            resolve(result);

                        })
                        .catch(err => {
                            
                            console.error('Error while querying activities');
                            reject(err);
                        });
                });

                return result;
            };

            const res = await getActivities();

            specialistsNearMe['data']['status'] = true;
            specialistsNearMe['data']['message'] = 'activities request is done successfully';
            specialistsNearMe['data']['activities'] = res.activities;
        } catch (error) {
            const errMsg = `Error while finding nearby ${res.predictedHCP}`;
            console.error(errMsg);
            specialistsNearMe['data']['status'] = false;
            specialistsNearMe['data']['message'] = errMsg;
        }

    }
    
    return specialistsNearMe;

}

export {
    defaultSDKConfig,
    quickSearchData,
    getSpecialtyCode,
    getSuggestedSPsNearMe
}