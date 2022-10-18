const {getFAQQuestions,  getFAQResponseById, getResponse } = 
    require('../QnAService');

const getfaqquestions = async (req, res, next) => {

    try {
        const category = req.query.category || 'All' ;
        const faqquestions = await getFAQQuestions(category);
        res.send(faqquestions);
    } catch(err) {
        return next(err)
    }
};

const getfaqresponse = async (req, res, next) => {

    const id = req.query.id || -1;

    try {
        const faqresponse = await getFAQResponseById(id);

        if (faqresponse) {
            res.send(faqresponse);    
        } else {
            res.sendStatus(400);
        }
        

    } catch(err) {
        return next(err);
    }

};

const getqnaresponse = async (req, res, next) => {

    // Use a single space as a default value to avoid issue when passing in an
    // empty string to the getResponse function
    const msg = req.body.msg || ' '; 
    let ansRes = null;
    try {
        ansRes = await getResponse(msg);
        res.send(ansRes);
        
    } catch(err) {
        return next(err)
    }
};

module.exports = {
    getfaqquestions,
    getfaqresponse,
    getqnaresponse
};