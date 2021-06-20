const fs = require('fs');
const path = require('path');

const tf = require('@tensorflow/tfjs-node'); // Required to use USE
const use = require('@tensorflow-models/universal-sentence-encoder');

const { specialistToSentencesMap } = require('./specialist_map');

// We need a sentence to be a key and a specialist type to be its value
// This is done to make a prediction
const outData = {};
for (const [curSP, curSentences] of Object.entries(specialistToSentencesMap)) {
    curSentences.forEach(item => outData[item] = curSP);
}

fs.writeFileSync('./data/sp.data.json', JSON.stringify({
    outData,
}));


let modelSP;
async function generateModel() {
    const modelSP = await use.load();
    const embeddingMap = {};

    await Promise.all(Object.keys(outData).map(async (curSentence) => {
        // precalculate and cache the embedding result
        const embedding = await modelSP.embed([curSentence]);
        embeddingMap[curSentence] = embedding.arraySync()[0];
    }));

    fs.writeFileSync('./data/sp.embedding.json', JSON.stringify({
        embeddingMap,
    }));

    console.log('Successfully write qna.model.json');

}

generateModel();