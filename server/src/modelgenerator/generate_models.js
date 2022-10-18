// The following tasks are done in this script
// 1. Reformat FAQ data and save it to a .json file
// 2. Create an embedding map using all questions in the FAQ data and save it 
// to a .json file

// ------------------
const fs = require('fs');
const path = require('path');

const tf = require('@tensorflow/tfjs-node'); // Required to use USE
const use = require('@tensorflow-models/universal-sentence-encoder');

// --- Load
const data_raw_who = require('./../../../data/qna/who.json');
const data_raw_cdc = require('./../../../data/qna/cdc.json');
const data_raw_fda = require('./../../../data/qna/fda.json');

// Combine data from all sources
const data_raw = [
    ...data_raw_who,
    ...data_raw_cdc,
    ...data_raw_fda
];

// -----------------------------------------
// Reformat FAQ data and save it to a .json file
// -----------------------------------------
let idx_cnt = 0;
const qnaData = data_raw.map(item => {

    const curAllData = item.data.map((curdata) => {
        const curIndex = idx_cnt;
        idx_cnt = idx_cnt + 1;

        const curans = curdata.answer;
        const curtitle = item.title.trim()
        // ---------------

        const curout = {
            id: curIndex,
            category: curtitle,
            source: item.url,
            question: curdata.question,
            response: curans
        };

        return curout;
    });

    return curAllData
})
    .flat();


fs.writeFileSync('./../../data/qna.data.json', JSON.stringify({
    qnaData,
}));

console.log('Successfully write qna.data.json');

// -----------------------------------------
// Create an embedding map using questions in the FAQ data 
// and save it to a .json file
// -----------------------------------------
/**
 * Create an embedding map using all questions in the FAQ data 
 * and save it to a .json file
 * @async
 */
async function generateModel() {
    const model = await use.load();
    const embeddingMap = {};

    await Promise.all(qnaData.map(async (item) => {
        const curQuestion = item.question;
        if (curQuestion !== null) {
            // precalculate and cache the embedding result
            const embedding = await model.embed([curQuestion]);
            embeddingMap[curQuestion] = embedding.arraySync()[0];
        }
    }));

    fs.writeFileSync('./../../data/qna.embedding.json', JSON.stringify({
        embeddingMap,
    }));

    console.log('Successfully write qna.model.json');
}

generateModel();