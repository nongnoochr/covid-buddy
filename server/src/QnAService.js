// Import "universal-sentence-encoder" lite (USE) model from tensorflow.js
// Note that this step requires an internet connection
const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

const { dotProduct } = require('./Utils');
// ---------------
// Import Data
// ---------------


// --- QnA data
let { qnaData } = require('./../data/qna.data.json');
// Update data to include fields that are required by the client
qnaData.forEach(item => {
    item['sourceName'] = getSourceName(item.source);
    item['categoryLabel'] = `${item.category} (${item.sourceName})`;
    item['predictedHCP'] = '';
});

// --- Specialist Data
const spData = require('./../data/sp.data.json')['outData'];

// --- Embedding data that will be used to compute a score of an output
// of the USE models
const { embeddingMap } = require('./../data/qna.embedding.json');
const spEmbData = require('./../data/sp.embedding.json');
const spEmbeddingMap = spEmbData['embeddingMap'];

// --- Initialize variables for models
let model, spModel;

/**
 * Return a copy of qnaData.
 * All functions in this file must use this getQnAData to get a copy of
 * qnaData to prevent an unintented change to the original qnaData
 * @returns {[object]} a copy of qnaData
 */
const getQnAData = () => {
    return [...qnaData];
};

// ---------
/**
 * Predict a suggested specialist for all FAQs and set it to qnaData
 * This operation only needs to be done onces in a server session 
 * and it is invoked in the startService method
 * @async
 */
const setAllPredictedSpecialists = async () => {

    console.log('Computed predicted sp for all FAQs')
    
    const allQuestions = qnaData.map(item => item.question);

    console.time('getAllPredictedSpecialists');

    // Split this task to chunk to save memory!

    const batchSize = 20;
    const numLoop = Math.ceil(allQuestions.length / batchSize);

    let predSPs = [];
    for (let cnt = 0; cnt < numLoop; cnt++ ) {
        console.log('|- Predict sp for chunk#', cnt);

        const startIndex = cnt*batchSize;
        const curBatchQuestions = allQuestions.slice(startIndex, startIndex + batchSize);
        const curPredSPs = await predictSpecialist(curBatchQuestions);
        predSPs = predSPs.concat(curPredSPs);
        console.log('Finish chunk#', cnt)
    }

    // const predSPs = await predictSpecialist(allQuestions);
    console.timeEnd('getAllPredictedSpecialists');

    console.log('predSPs: ', predSPs);

    predSPs.forEach((curPred, index) => {
        qnaData[index]['predictedHCP'] = curPred;
    });
}

// ----------------------
// Exported functions
// ----------------------

/**
 * A function to start initializing model objects and set a predicted suggested
 * specialist to all FAQ data
 * @async
 * @function
 */
const startService = async () => {
    console.log('* Initialize the server service...');
    
    console.time('startService');

    model = await loadModel();
    await setAllPredictedSpecialists();

    console.timeEnd('startService');
}

/**
 * Get FAQ data (no response) for all categories or for a particular category
 * @param {string} category Category name. 
 * This value can be one of the followings: 'All' (default), or a category name 
 * in qnaData
 * @returns {[object]} A list of FAQ data object
 */
const getFAQQuestions = (category = 'All') => {
    // Retrieve only interested fields of qnaData
    const data = getQnAData();
    let allQuestions = data.map(item => {
        return {
            id: item.id,
            category: item.category,
            categoryLabel: item.categoryLabel,
            question: item.question,
            source: item.source,
            sourceName: item.sourceName
        };
    });

    if (category === 'All') {
        return allQuestions
    } else {
        // Only return a subset of data when a user specifies a category value
        const catQuestions = allQuestions.filter(item => {
            return item.category === category;
        });

        return catQuestions;
    }

};

/**
 * Return a FAQ response based on id
 * @param {string} id Identifier of qnaData
 * @async
 * @returns {object} A FAQ response object based on the specified id
 */
const getFAQResponseById = async (id) => {
    const data = getQnAData();
    const res = data.find(item => item.id === +id); // Must compare with a numeric value
    return res;
};

/**
 * Return a sorted list of FAQ data with a similarity score (sorted descendingly)
 * @param {string} inputQuery user input question/query
 * @returns 
 */
const getResponse = async (inputQuery) => {
    
    if (!model) {
        console.log('Creating a model inside getResponse');
        model = await use.load();
    }

    // Get an embedding of the input query
    let queryEmbedding = await model.embed([inputQuery]);
    const queryArrays = await queryEmbedding.array();

    // Calculate a similarity score by taking the dot product of the user input
    // encoded query with the encoded of each FAQ question
    const scores = [];
    for (const potentialMatch of Object.keys(embeddingMap)) {    
        const score = dotProduct(queryArrays[0], embeddingMap[potentialMatch]);
        scores.push(score);
    }

    // Add a score to a copy of qnaData
    const data = getQnAData();
    let finalResults = data.map((res, i) => {
        return {
            ...res,
            score: scores[i]
        };
    });

    // Then sorted it based on a score descendingly
    finalResults.sort((a, b) => (a.score > b.score) ? -1 : 1);

    // --- No longer needs to do this because we already make a prediction for all
    // FAQs at the start of the server
    // // --- Only updated the predictedSPs for the top response since we will only
    // // return a top response to a user (Predicting a specialist takes memory and time!)
    // const predictedSPs = await predictSpecialist([inputQuery]);
    // finalResults[0]['predictedHCP'] = predictedSPs[0];

    // Only return the Top-5 results
    return finalResults.slice(0, 5);
};

// ---------------
// Export modules
// ---------------
module.exports = {
    startService,
    getFAQQuestions,
    getFAQResponseById,
    getResponse
};

// =============
// ---- Local Helpers
// =============

/**
 * Get a source name of a specified URL from FAQ
 * @param {string} url URL of a FAQ source
 * @returns {string} Source name of the specified URL
 */
function getSourceName (url='') {

    let sourceName = '';

    if (url.includes('www.who.int')) {
        sourceName = 'WHO'
    } else if (url.includes('www.cdc.gov')) {
        sourceName = 'CDC'
    } else if (url.includes('www.fda.gov')) {
        sourceName = 'FDA'
    }

    return sourceName

}

// ----------------
// --- Async helpers
// ----------------
/**
 * Load a pretrained USE model
 * @returns {object} a pretrained USE model
 */
async function loadModel () {
    console.log('* Load USE model');
    localModel = await use.load();

    return localModel;
};

/**
 * Predict a suggested specilist for the input question/query
 * @async
 * @param {[string]} queries An array of query string 
 * @returns {[string]} An array of predicted specialists
 */
async function predictSpecialist(queries) {
    if (!spModel) {
        console.log('Creating a model inside predictSpecialist');
        spModel = await loadModel();
    }

    // Compute embedding of a list of input queries
    let queryEmbedding = await spModel.embed(queries);
    const queryArrays = await queryEmbedding.array();

    // Calculate a similarity score for each input query
    let allPredictedSPs = []; 
    queryArrays.forEach((curQueryArray) => {

        const scores = [];
        let maxScore = -Infinity;
        let bestMatch = '';

        // Calculate a similarity score by taking the dot product of the user input
        // encoded query with the encoded specialist query
        for (const potentialMatch of Object.keys(spEmbeddingMap)) {
            const score = dotProduct(curQueryArray, spEmbeddingMap[potentialMatch]);
            scores.push(score);

            if (score > maxScore) {
                maxScore = score;
                bestMatch = potentialMatch;
            }

        }

        // --- Only return the predicted specialist if a probability of the 
        // best match exceeds a minimum value
        let predictedSP = 'All'
        if (maxScore > 0.75) {
            predictedSP = spData[bestMatch];
        }

        allPredictedSPs.push(predictedSP);

    });

    return allPredictedSPs;
}

// ---------