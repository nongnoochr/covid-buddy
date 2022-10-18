// This module provides apis to make a GET request to retrieve data from the server
import axios from 'axios';

/**
 * Request FAQ Questions data from the server
 * @async
 * @param {string} category Category name. 
 * This value can be one of the followings: 'All' (default), or a category name 
 * in the FAQ data
 * @returns {[object]} FAQ Questions data sorted by category name
 */
const getFAQQuestions = async (category = 'All') => {
    const res = await axios.get(`/getfaqquestions?category=${category}`);
    res.data.sort((a, b) => (a.category > b.category) ? 1 : -1)

    return res.data;
};

/**
 * Request FAQ Response data for a particular FAQ
 * @async
 * @param {string} id Identifier of a requested FAQ
 * @returns {[object]} FAQ Response data
 */
const getFAQResponseById = async (id) => {
    const res = await axios.get(`/getfaqresponse?id=${id}`);
    return res.data;
}

/**
 * Request an AI response from a user question
 * @async
 * @param {string} inputQuery User question message
 * @returns 
 */
const getResponse = async (inputQuery) => {

    try {
        const res = await axios.post('/getqnaresponse', {
            msg: inputQuery
        });
        return res.data;
    } catch(err) {
        return [];
    }
};

// -------------------
export {
    getFAQQuestions,
    getFAQResponseById,
    getResponse
};
