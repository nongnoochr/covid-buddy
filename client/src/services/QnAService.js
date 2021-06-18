import axios from 'axios';

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

    try {
        const res = await axios.get(`/getqnaresponse?msg=${inputQuery}`)
        return res.data;
    } catch(err) {
        return [];
    }
};

export {
    getFAQQuestions,
    getFAQResponseById,
    getResponse
};
