// --- Init SDK api
// Update the apiKey value below to a valid HealthcareLocator's apiKey
const defaultSDKConfig = {
    // apiKey: '300131ea848b420a', // Not working
    apiKey: '300142b840f95490',
    appName: 'COVID-19 Buddy',
    appURL: 'https://covid-buddy.herokuapp.com/'
};

// eslint-disable-next-line no-undef
const api = new HclAPI(defaultSDKConfig);

// ===========================
// --- Default Constant value

const quickSearchData = [
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
];

const quickSearchSpecialtyCodes = quickSearchData.map(item => item.specialtyCode);

// --- Helper functions

/**
 * Get the default cache specialist data for initialization
 * @returns {object} Default cache specialist data
 */
const getDefaultCacheSpecialistData = () => {
    let defaultSPData = {};
    quickSearchSpecialtyCodes.forEach(item => {
        defaultSPData[item] = {
            isrun: false,
            activities: []
        };
    });

    return {
        timestamp: new Date(),
        location: { lat: -Infinity, lon: -Infinity },
        data: defaultSPData
    };
};


/**
 * Compare whether the two input locations are closed
 * @param {{lat, lon}} loc1 coords of the 1st location
 * @param {{lat, lon}} loc2 coords of the 2nd location
 * @returns Return true if the two locations are closed (1 decimal point)
 */
const compareLocations = (loc1, loc2) => {
    const numFixed = 1;

    const loc1_lat = loc1.lat.toFixed(numFixed);
    const loc1_lon = loc1.lon.toFixed(numFixed);

    const loc2_lat = loc2.lat.toFixed(numFixed);
    const loc2_lon = loc2.lon.toFixed(numFixed);

    const bool = (loc1_lat === loc2_lat) &&
        (loc1_lon === loc2_lon)

    return bool;
}

// ==================
// Initialization
// ==================
// Set the cache
let cacheSpecialistData = getDefaultCacheSpecialistData();
let cacheSPWorkplaceData = [];

// ==================
// Exported functions
// ==================
/**
 * Create a link to open a google map with a direction in a new tab
 * @param { {lat, lon} } curLocation 
 * @param { {lat, lon}} workplaceLocation 
 * @returns Return a link to open a google map with a direction in a new tab
 */
const getLinkLocation = (curLocation, workplaceLocation) => {
    const linkDirection = `https://www.google.com/maps/dir/${curLocation.lat},${curLocation.lon}/${workplaceLocation.lat},${workplaceLocation.lon}`;
    return linkDirection;
}

/**
 * Get a specialty code for a given label
 * @param {string} specialtyLabel
 * @returns {string} Specialty code for a given label
 */
const getSpecialtyCode = (specialtyLabel) => {
    const spCode = quickSearchData.find(item => item.specialtyLabel === specialtyLabel)['specialtyCode'];
    return spCode;
};

/**
 * Get nearby specicialists data based on the input criteria (maximum of 50 nearby specialists)
 * @param {string} specialtyCode Specialty code
 * @param {{lat, lon}} location  coords of location
 * @returns {object} Nearby specialist data  (maximum of 50 nearby specialists)
 */
const getNearbySpecialists = async (
    specialtyCode,
    location = { lat: -Infinity, lon: -Infinity }
) => {

    // Query parameters for the activities api
    // Find maximum of 50 nearby specialists - Match the default maximum number
    // of results in Results screen in list mode
    // https://docs.healthcarelocator.com/index.htm#t=RefGuide%2FHealthCare_Locator_features.htm
    const params = {
        first: 50,
        offset: 0,
        specialties: [specialtyCode],
        location: location
    };

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

    const result = await getActivities();
    return result;
};

/**
 * Get data of the input specialist
 * @param {string} id Specilist's ID
 * @returns {object} Specialist data
 */
const getIndividualsByID = async (id) => {
    const result = await new Promise((resolve, reject) => {
        api.individualsByID({ id: id })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                console.error('Error while querying individualsByID');
                reject(err);
            })
    });

    return result;
};

/**
 * Get data of the suggested specialists near the user
 * @param {object} res Response object
 * @returns {object} Data of the near by suggested specialists
 */
const getSuggestedSPsNearMe = async (res, { coords } = { coords: { lat: -Infinity, lon: -Infinity } }) => {

    // --- Reset cache value if it is greater than 1 day

    const oneDay = 60 * 60 * 24 * 1000; // 1 day in milliseconds
    if ((new Date() - cacheSpecialistData.timestamp) > oneDay) {
        cacheSpecialistData = getDefaultCacheSpecialistData();
    }

    // --- Create a default output value
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

        // --- Get User's current location
        const getCoords = async () => {
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            return {
                lon: pos.coords.longitude,
                lat: pos.coords.latitude,
            };
        };

        // Only get a new coords if the input coords are valid (e.g. > -Infinity)
        let curCoords;
        if (coords.lat === -Infinity) {
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

           
        } else {
            curCoords = { ...coords };
        }

         // Get the current coordinates
         let curLat = curCoords.lat;
         let curLon = curCoords.lon;

        // // Test: Natick!
        // curLat = 42.2775;
        // curLon = -71.3468;

        // // Test: NYC
        // curLat = 40.7128;
        // curLon = -74.0060;

        // // Test: LA
        // curLat = 34.0522;
        // curLon = -118.2437;


        specialistsNearMe['data']['coords']['lat'] = curLat;
        specialistsNearMe['data']['coords']['lon'] = curLon;

        cacheSpecialistData.location = { ...curCoords };


        // --- Get Nearby specialists data based on the current user location

        // Check whether the cache results present.
        // If it does, use it to save the query limit!

        let result, activities;
        try {
            if ((compareLocations(curCoords, cacheSpecialistData.location) &&
                (cacheSpecialistData.data[spCode].isrun)
            )) {
                activities = cacheSpecialistData.data[spCode].activities;
            } else {
                result = await getNearbySpecialists(spCode, { lat: curLat, lon: curLon });
                activities = result.activities;

                // Once the query is done successfully, set the cache value
                cacheSpecialistData.data[spCode].isrun = true;
                cacheSpecialistData.data[spCode].activities = [...activities];
            }

            specialistsNearMe['data']['status'] = true;
            specialistsNearMe['data']['message'] = 'activities request is done successfully';
            specialistsNearMe['data']['activities'] = [...activities];

        } catch (error) {
            const errMsg = `Error while finding nearby ${res.predictedHCP}`;
            console.error(errMsg);
            specialistsNearMe['data']['status'] = false;
            specialistsNearMe['data']['message'] = errMsg;
        }
    }

    return specialistsNearMe;

};

/**
 * Get data of a particular specialist by Id
 * @param {string} spId Id of a Specialist
 * @async
 * @returns Return data of a particular specialist
 */
const getSpecialistInfo = async (spId) => {

    // First, check whether data for the specified specialist id is already present
    // in the cache data
    const findSPData = cacheSPWorkplaceData.find(item => item.id === spId);

    let result, newData;
    // If the cache data is available
    if (findSPData) {
        // Use the cache data
        newData = { ...findSPData };

    } else {
        // Otherwise, make a query
        try {
            const rawResult = await getIndividualsByID(spId);
            result = rawResult.individualByID;
        } catch (error) {
            const errMsg = `Error while finding data for id ${spId}`;
            console.error(errMsg);

            result = {};
        }

        // Then, push it to the end of the cache data array
        newData = {
            id: spId,
            data: result
        };

        cacheSPWorkplaceData.push(newData);

        // Only keep the cache of the last 100 results
        if (cacheSPWorkplaceData.length > 100) {
            // Popping out the first entry if the cache size is over 100
            cacheSPWorkplaceData.shift();
        }
    } 

    return newData;
};

// ===============

export {
    defaultSDKConfig,
    quickSearchData,
    quickSearchSpecialtyCodes,
    getLinkLocation,
    getSpecialtyCode,
    getSuggestedSPsNearMe,
    getSpecialistInfo
}