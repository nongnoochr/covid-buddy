const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

const { qnaData } = require('./qna.data.json');
const { embeddingMap } = require('./qna.embedding.json');


// ------ Required method
const getFAQQuestions = (category = 'All') => {
    const allQuestions = qnaData.map(item => {
        return {
            id: item.id,
            category: item.category,
            question: item.question,
            source: item.source
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

let model;

const getResponse = async (inputQuery) => {

    if (!model) {
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
