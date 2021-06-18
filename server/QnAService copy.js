const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');

const cheerio = require('cheerio');

// --- Load & Manipulate data - To replace with a rest api
const data_raw = require('./../data/qna/who.json');

const maxContextLen = 128;

const data_buddy = [];


let idx_cnt = 0;
const data_raw_flatten = data_raw.map(item => {

    // Get only the first 5 questions from each category to save memory
    // For buddy
    const curAllData = item.data.map((curdata, index) => {
        const curIndex = idx_cnt;
        idx_cnt = idx_cnt + 1;

        const $ = cheerio.load(curdata.answer);

        // --- Don't send html texts becaues they don't use on mobile
        // https://tfhub.dev/google/universal-sentence-encoder-multilingual-qa/1
        // "All input text can have arbitrary length! 
        // However, model time and space complexity is O(n^2) for question 
        // and response input length n and O(n) for context length. 
        // ---> We recommend question and response inputs that are approximately 
        // one sentence in length."

        // Trim the response to maximum of 512 characters to reduce complexity
        const curans = $.text().trim();
        const curtitle = item.title.trim()

        // ---------------
        // TODO: To update this to predict HCP from question/context!
        // ---------------
        let predictedHCP = 'All';
        if (curtitle === 'Adolescents and youth') {
            predictedHCP = 'Pediatric'
        }


        // ---------------

        const curout = {
            id: curIndex,
            category: curtitle,
            source: item.url,
            question: curdata.question,
            response: curans,
            predictedHCP
        };

        data_buddy.push(curout);

        return curout;
    });

    return curAllData
})
    .flat();

    // // Temporary to work around the network close and memory quota vastly exceeded issue
    // .splice(0, 80);


// const responses = data_raw_flatten.map(data => {
//     // const parser = new DOMParser();
//     // const docAnswer = parser.parseFromString(data.response, "text/html");
//     // console.log('docAnswer: ', docAnswer.);

//     const $ = cheerio.load(data.response);

//     // https://tfhub.dev/google/universal-sentence-encoder-multilingual-qa/1
//     // "All input text can have arbitrary length! 
//     // However, model time and space complexity is O(n^2) for question 
//     // and response input length n and O(n) for context length. 
//     // ---> We recommend question and response inputs that are approximately 
//     // one sentence in length."

//     // Trim the response to maximum of 512 characters to reduce complexity
//     const res = $.text().trim();
//     const trimRes = res.slice(0, maxContextLen);

//     return {
//         id: data.id,
//         data: trimRes
//     };
// });


const contexts = data_raw_flatten.map(data => {
    return {
        id: data.id,
        data: data.question
    };
});


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


// ------ Required method
const getFAQQuestions = (category = 'All') => {
    const allQuestions = data_raw_flatten.map(item => {
        return {
            id: item.id,
            category: item.category,
            question: item.question,
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
    const res = data_raw_flatten.find(item => item.id === +id); // Must compare with a numeric value
    return res;
};

let model;

const getResponse = async (inputQuery) => {

    if (!model) {
        model = await use.loadQnA();
    }

    // const in_responses = data_buddy.map(item => item.response.slice(0, maxContextLen));
    const in_questions = data_buddy.map(item => item.question);
    const in_contexts = data_buddy.map(item => item.category);


    const input = {
        queries: [inputQuery],
        responses: in_questions,
        // contexts: in_contexts
    };
    let result = model.embed(input);
    const queryEmbedding = result['queryEmbedding'].arraySync();
    const responseEmbedding = result['responseEmbedding'].arraySync();
    const scores = [];

    for (let i = 0; i < responseEmbedding.length; i++) {
        const score = dotProduct(queryEmbedding[0], responseEmbedding[i]);
        scores.push(score);

    }

    let finalResults = data_buddy.map((res, i) => {
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
