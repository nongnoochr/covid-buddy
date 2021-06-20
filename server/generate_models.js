const fs = require('fs');
const path = require('path');

const tf = require('@tensorflow/tfjs-node'); // Required to use USE
const use = require('@tensorflow-models/universal-sentence-encoder');

const cheerio = require('cheerio');

// --- Load & Manipulate data - To replace with a rest api
const data_raw_who = require('./../data/qna/who.json');
const data_raw_cdc = require('./../data/qna/cdc.json');
const data_raw_fda = require('./../data/qna/fda.json');

const data_raw = [
    ...data_raw_who,
    ...data_raw_cdc,
    ...data_raw_fda
];

// data_raw.sort((a, b) => (a.category > b.category) ? 1 : -1)


let idx_cnt = 0;
const qnaData = data_raw.map(item => {

    const curAllData = item.data.map((curdata, index) => {
        const curIndex = idx_cnt;
        idx_cnt = idx_cnt + 1;

        const curans = curdata.answer;
        const curtitle = item.title.trim()

        // const $ = cheerio.load(curdata.answer);

        // // --- Don't send html texts becaues they don't use on mobile
        // // https://tfhub.dev/google/universal-sentence-encoder-multilingual-qa/1
        // // "All input text can have arbitrary length! 
        // // However, model time and space complexity is O(n^2) for question 
        // // and response input length n and O(n) for context length. 
        // // ---> We recommend question and response inputs that are approximately 
        // // one sentence in length."

        // const curans = $.text().trim();
        // const curtitle = item.title.trim();

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


fs.writeFileSync('./data/qna.data.json', JSON.stringify({
    qnaData,
}));

console.log('Successfully write qna.data.json');

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

    fs.writeFileSync('./data/qna.embedding.json', JSON.stringify({
        embeddingMap,
    }));

    console.log('Successfully write qna.model.json');

}

generateModel();