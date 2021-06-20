const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

let { qnaData } = require('./qna.data.json');
const { embeddingMap } = require('./qna.embedding.json');


const loadModel = async () => {
    console.log('* Load model when the server start');
    
    console.time('Model creation time');
    localModel = await use.load();
    console.timeEnd('Model creation time');

    return localModel;
};


let model;
loadModel().then((initModel) => {

    model = initModel;
});


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

    let finalResults = qnaData.map((res, i) => {
        return {
            ...res,
            score: scores[i]
        };
    });

    finalResults.sort((a, b) => (a.score > b.score) ? -1 : 1)

    return finalResults;

};


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

qnaData.forEach(item => {
    item['sourceName'] = getSourceName(item.source);
    item['categoryLabel'] = `${item.category} (${item.sourceName})`;
});


// ------ Required method
const getFAQQuestions = (category = 'All') => {
    let allQuestions = qnaData.map(item => {
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

// Also add a prediction for a type of doctor

const getFAQResponseById = (id) => {
    const res = qnaData.find(item => item.id === +id); // Must compare with a numeric value
    return res;
};

// ---------------


module.exports = {
    getFAQQuestions,
    getFAQResponseById,
    getResponse
};





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
