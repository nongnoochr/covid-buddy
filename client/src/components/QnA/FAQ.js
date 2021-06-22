import React, { useEffect, useState, useRef } from 'react';
import { Form, InputGroup, Col, Button } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import { getFAQQuestions, getFAQResponseById } from '../../services/QnAService';

// Icons
import { GrFilter } from 'react-icons/gr';

// Styling
import classes from './FAQ.module.css';

// ==================
// Helpers
// ==================
/**
 * Get Questions data based on the input category name
 * @param {string} curSeletedCat Selected category name
 * @returns {[object]} An array of questions data
 */
const getUpdatedFAQQuestions = async (curSeletedCat) => {

    let options;
    if (curSeletedCat) {
        options = await getFAQQuestions(curSeletedCat);
    } else {
        options = await getFAQQuestions();

    }
    return options
}

// ==================

const FAQ = (props) => {

    // --- refs
    const refTypeaheadFAQ = useRef(null);
    const refTypeaheadCat = useRef(null);

    // --- states
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);

    const [faqQuestions, setFAQQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState([]);

    // ---------------
    // --- useEffects
    // ---------------

    // --- Initialize the categories and FAQs widgets

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {

        // Get all FAQ Questions
        const options = await getUpdatedFAQQuestions();
        setFAQQuestions(options);

        // Get categories data
        const dataCat = options.map(item => {
            return {
                category: item.category,
                categoryLabel: item.categoryLabel,
                sourceName: item.sourceName
            };
        });

        // Get only unique category names

        // https://codeburst.io/javascript-array-distinct-5edc93501dc4
        let categories = [];
        const map = new Map();
        for (const item of dataCat) {
            if (!map.has(item.category)) {
                map.set(item.category, true);
                categories.push({
                    ...item
                })
            }
        }

        // Prepend with the 'All' categories to show all FAQs
        categories = [
            { category: 'All', categoryLabel: 'All', sourceName: '' },
            ...categories
        ];

        setCategories(categories);

    }, []);

    // --- Update FAQQuestions listed in the search dropdown after a selected
    // category is updated

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        if (selectedCategory.length > 0) {
            const curSeletedCat = selectedCategory[0];
            const newQuestions = await getUpdatedFAQQuestions(curSeletedCat.category);
            setFAQQuestions(newQuestions);
        }
    }, [selectedCategory]);

    // --------------
    // --- Handlers

    /**
     * Set properties after changing a category
     * @param {string} newCat category name
     */
    const selectionChangeHandler = (newCat) => {
        setSelectedCategory(newCat);
        setSelectedQuestion([]);
    };

    /**
     * Pass the submit handler to the parent handler and reset the selected question
     */
    const onSubmit = () => {
        props.onSubmitDataHandler(submitQuestionHandler);
        setSelectedQuestion([]);
    };

    /**
     * Return a response data for the selected FAQ
     * @async
     * @returns {object} a response data
     */
    const submitQuestionHandler = async () => {
        const res = await getFAQResponseById(selectedQuestion[0].id);
        return {
            ...res,
            answer: res.response
        };
    };

    /**
     * Reset property values when pressing the Reset button
     * @async
     */
    const resetInputHandler = async () => {

        setSelectedCategory([]);
        // refTypeaheadCat.current.clear();

        setSelectedQuestion([]);
        // refTypeaheadFAQ.current.clear();

        // Reset questions to 'All'
        const options = await getUpdatedFAQQuestions();
        setFAQQuestions(options);

    };

    /**
     * Custom renderer for the FAQ Selection dropdown
     * @param {object} option FAQ data object
     * @returns {JSX} Rendered JSX 
     */
    const questionSelectionRendererHandler = (option) => (
        <div>
            {option.question}
            <div>
                <small>Category: {option.categoryLabel}</small>
            </div>
        </div>
    );

    // -----------

    return (
        <div className={classes['faq-selection-container']}>
            <Form.Group>
                <InputGroup>
                    <div className={classes['cat-selection-label-container']}>
                        <InputGroup.Prepend>
                            <InputGroup.Text>
                                <GrFilter /> &nbsp;
                                <span className={classes['cat-selection-label']}>Filter by Category:</span>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                    </div>

                    <div className={classes['cat-selection-search-container']}>
                        <Typeahead
                            id="faqcat-typeahead"
                            onChange={selectionChangeHandler}
                            options={categories}
                            selected={selectedCategory}
                            filterBy={['categoryLabel', 'sourceName']}
                            labelKey="categoryLabel"
                            placeholder="(Optional) Select or type category..."
                            ref={refTypeaheadCat}
                            clearButton
                        />
                    </div>
                </InputGroup>
            </Form.Group>

            <Form>
                <Form.Row className="align-items-center">
                    <Col sm={12} className="mb-2">
                        <Typeahead
                            id="faq-typeahead"
                            onChange={setSelectedQuestion}
                            options={faqQuestions}
                            placeholder="Select or type question or category..."
                            selected={selectedQuestion}
                            filterBy={['question', 'categoryLabel', 'sourceName']}
                            labelKey="question"
                            renderMenuItemChildren={questionSelectionRendererHandler}
                            ref={refTypeaheadFAQ}
                            clearButton
                        />
                    </Col>
                </Form.Row>

                <div className="float-right">
                    <Form.Row className="align-items-center">
                        <Col xs="auto">
                            <Button
                                disabled={selectedQuestion && (selectedQuestion.length === 0)}
                                onClick={onSubmit}>
                                Submit
                            </Button>
                        </Col>
                        <Col xs="auto">
                            <Button variant="outline-secondary" onClick={resetInputHandler}>
                                Reset
                            </Button>
                        </Col>
                    </Form.Row>
                </div>
            </Form>

            <div className={classes['faq-source-container']}>
                Sources:&nbsp;
                <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/question-and-answers-hub" target="_blank" rel="noreferrer">WHO</a>,&nbsp;
                <a href="https://www.cdc.gov/coronavirus/2019-ncov/faq.html" target="_blank" rel="noreferrer">CDC</a>,&nbsp;
                <a href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/covid-19-frequently-asked-questions" target="_blank" rel="noreferrer">FDA</a>
            </div>
        </div>);
};

export default FAQ;