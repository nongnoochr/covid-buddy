const tf = require('@tensorflow/tfjs-node'); // Required to use USE
const use = require('@tensorflow-models/universal-sentence-encoder');

const qnaData = require('./qna.data.json');
const { embeddingMap } = require('./qna.embedding.json');

let model;
async function getResponse(query) {
    if (!model) {
        model = await use.load();
    }
    console.time('getResponse Time');

    let queryEmbedding = await model.embed([query]);
    const queryArrays = await queryEmbedding.array();

    const scores = [];
    let maxScore = -Infinity;
    let bestMatch = '';

    for (const potentialMatch of Object.keys(embeddingMap)) {
        // Calculate a similarity score by taking the dot product of the player's
        // encoded query with the encoded candidate query
        const score = dotProduct(queryArrays[0], embeddingMap[potentialMatch]);
        scores.push(score);

        if (score > maxScore) {
            maxScore = score;
            bestMatch = potentialMatch;
        }

    }

    // console.log('scores: ', scores);
    console.log('query: ', query);
    console.info('Best match: "' + bestMatch + '" with score ' + maxScore);

    console.timeEnd('getResponse Time');

}

const query = 'Can I travel?'
getResponse(query);


// ------
// Helpers
// ------

// zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]
const zipWith =
    (f, xs, ys) => {
        const ny = ys.length;
        return (xs.length <= ny ? xs : xs.slice(0, ny))
            .map((x, i) => f(x, ys[i]));
    }

// dotProduct :: [Int] -> [Int] -> Int
const dotProduct =
    (xs, ys) => {
        const sum = xs => xs ? xs.reduce((a, b) => a + b, 0) : undefined;

        return xs.length === ys.length ? (sum(zipWith((a, b) => a * b, xs, ys))) :
            undefined;
    }