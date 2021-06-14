// import '@tensorflow/tfjs-backend-cpu';
// import * as tf from '@tensorflow/tfjs-backend-webgl';

// // https://blog.tensorflow.org/2020/03/introducing-webassembly-backend-for-tensorflow-js.html
// // Import @tensorflow/tfjs or @tensorflow/tfjs-core

// // Add the WASM backend to the global backend registry.
// import '@tensorflow/tfjs-backend-wasm';
// import * as tf from '@tensorflow/tfjs';

import axios from 'axios';

// import '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
// import '@tensorflow/tfjs-backend-cpu';

import * as use from '@tensorflow-models/universal-sentence-encoder';

const maxContextLen = 256;
// console.log(tf.getBackend());

// Load & Manipulate data - To replace with a rest api
const data_raw = require('./who.json');
let idx_cnt = 0;
const data_raw_flatten = data_raw.map(item => {

    const curAllData = item.data.map(curdata => {
        const curIndex = idx_cnt;
        idx_cnt = idx_cnt + 1;
        return {
            id: curIndex,
            category: item.title.trim(),
            source: item.url,
            context: curdata.question,
            response: curdata.answer
        };
    });

    return curAllData
})
    .flat();

// // Temporary reduce a size of data for debugging
//     .slice(0,256);



const responses = data_raw_flatten.map(data => {
    const parser = new DOMParser();
    const docAnswer = parser.parseFromString(data.response, "text/html");

    // https://tfhub.dev/google/universal-sentence-encoder-multilingual-qa/1
    // "All input text can have arbitrary length! 
    // However, model time and space complexity is O(n^2) for question 
    // and response input length n and O(n) for context length. 
    // ---> We recommend question and response inputs that are approximately 
    // one sentence in length."

    // Trim the response to maximum of 512 characters to reduce complexity
    const res = docAnswer.body.innerText.trim();
    const trimRes = res.slice(0, maxContextLen);

    return {
        id: data.id,
        data: trimRes
    };
});

const contexts = data_raw_flatten.map(data => {
    return {
        id: data.id,
        data: data.context
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

let model;

// ------ Required method
const getFAQQuestions = async (category = 'All') => {
    const res = await axios.get(`/getfaqquestions?category=${category}`)
    return res.data;

};

const getFAQResponseById = async (id) => {

    const res = await axios.get(`/getfaqresponse?id=${id}`)
    return res.data;

}

const getResponse = async (inputQuery) => {

    const res = await axios.get(`/getqnaresponse?msg=${inputQuery}`)
    return res.data;

};

export {
    getFAQQuestions,
    getFAQResponseById,
    getResponse
};
