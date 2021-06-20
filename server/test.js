const {getFAQQuestions,  getFAQResponseById, getResponse } = 
    require('./QnAService');


(async () => {
    console.time('getResponse Time');
    const q = await getResponse('what is covid');
    console.log(q.slice(0,5))
    console.timeEnd('getResponse Time');
})();
