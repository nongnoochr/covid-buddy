const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

// --- QnA data
let { qnaData } = require('./data/qna.data.json');
const { embeddingMap } = require('./data/qna.embedding.json');

// --- Specialist Data
const spData = require('./data/sp.data.json')['outData'];
const spEmbData = require('./data/sp.embedding.json');
const spEmbeddingMap = spEmbData['embeddingMap'];

// --- Load models when server starts

const loadModel = async () => {
    console.log('* Load QnA model when the server start');
    
    console.time('QnA Model creation time');
    localModel = await use.load();
    console.timeEnd('QnA Model creation time');

    return localModel;
};

const loadSPModel = async () => {
    console.log('* Load SP model when the server start');
    
    console.time('SP Model creation time');
    localModel = await use.load();
    console.timeEnd('SP Model creation time');

    return localModel;
};


// ---------
// --- Reformat data before proceeding
const getSourceName = (url) => {

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

const getQnAData = () => {
    return qnaData;
};

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

// -----

// --- Update data
qnaData.forEach(item => {
    item['sourceName'] = getSourceName(item.source);
    item['categoryLabel'] = `${item.category} (${item.sourceName})`;
    item['predictedHCP'] = '';
});

let model;
// loadModel().then((initModel) => {
//     model = initModel;
// });

let spModel;

// // Don't load a model here since we are going to load it anyway in setAllPredictedSpecialists();
// loadSPModel().then((initModel) => {
//     model = initModel;
// });


const startService = async () => {
    console.log('* Start Service');
    
    console.time('startService');

    model = await loadModel();
    await setAllPredictedSpecialists();

    console.timeEnd('startService');
}

// ---------
// ------ Required method
const getFAQQuestions = (category = 'All') => {
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

        const catQuestions = allQuestions.filter(item => {
            return item.category === category;
        });

        return catQuestions;
    }

};

// -----------------
// predict apis
// -----------------

const getResponse = async (inputQuery) => {
    
    if (!model) {
        console.log('Creating a model inside getResponse');
        model = await use.load();
    }

    let queryEmbedding = await model.embed([inputQuery]);
    const queryArrays = await queryEmbedding.array();

    const scores = [];

    for (const potentialMatch of Object.keys(embeddingMap)) {
        // Calculate a similarity score by taking the dot product of the player's
        // encoded query with the encoded candidate query
        const score = dotProduct(queryArrays[0], embeddingMap[potentialMatch]);
        scores.push(score);
    }

    const data = getQnAData();
    let finalResults = data.map((res, i) => {
        return {
            ...res,
            score: scores[i]
        };
    });

    finalResults.sort((a, b) => (a.score > b.score) ? -1 : 1);


    // --- Only updated the predictedSPs for the top response
    const predictedSPs = await predictSpecialist([inputQuery]);
    finalResults[0]['predictedHCP'] = predictedSPs[0];

    return finalResults;

};

// Also add a prediction for a type of doctor

const getFAQResponseById = async (id) => {
    const data = getQnAData();
    const res = data.find(item => item.id === +id); // Must compare with a numeric value
    return res;
};

// ---------------


module.exports = {
    startService,
    getFAQQuestions,
    getFAQResponseById,
    getResponse
};

// =============
// ---- Helpers
// =============

async function predictSpecialist(queries) {
    if (!spModel) {
        console.log('Creating a model inside predictSpecialist');
        spModel = await use.load();
    }

    let queryEmbedding = await spModel.embed(queries);
    const queryArrays = await queryEmbedding.array();

    let allPredictedSPs = []; 
    queryArrays.forEach((curQueryArray, index) => {

        const scores = [];
        let maxScore = -Infinity;
        let bestMatch = '';

        for (const potentialMatch of Object.keys(spEmbeddingMap)) {
            // Calculate a similarity score by taking the dot product of the player's
            // encoded query with the encoded candidate query
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

// zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
function zipWith(f, xs, ys) {
    const ny = ys.length;
    return (xs.length <= ny ? xs : xs.slice(0, ny))
        .map((x, i) => f(x, ys[i]));
}

// dotProduct :: [Int] -> [Int] -> Int
function dotProduct(xs, ys) {
    const sum = xs => xs ? xs.reduce((a, b) => a + b, 0) : undefined;

    return xs.length === ys.length ? (sum(zipWith((a, b) => a * b, xs, ys))) :
        undefined;
}
