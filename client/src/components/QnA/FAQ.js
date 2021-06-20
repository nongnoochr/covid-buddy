import React, { useEffect, useState, useRef } from 'react';
import { Form, InputGroup, Col, Button } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import { getFAQQuestions, getFAQResponseById } from '../../services/QnAService';

// Icons
import { GrFilter } from 'react-icons/gr';

// Styling
import classes from './FAQ.module.css';

const FAQ = (props) => {
    const refTypeaheadFAQ = useRef(null);
    const refTypeaheadCat = useRef(null);

    const [faqQuestions, setFAQQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState([]);

    const getUpdatedFAQQuestions = async (curSeletedCat) => {

        let options;
        if (curSeletedCat) {
            options = await getFAQQuestions(curSeletedCat);
        } else {
            options = await getFAQQuestions();

        }

        return options
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        if (selectedCategory.length > 0) {
            const curSeletedCat = selectedCategory[0];
            // let newQuestions = await getFAQQuestions(curSeletedCat.category);
            const newQuestions = await getUpdatedFAQQuestions(curSeletedCat.category);
            setFAQQuestions(newQuestions)

        }

    }, [selectedCategory]);


    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        // const options = await getFAQQuestions();
        // options.forEach(item => item['sourceName'] = getSourceName(item.source));

        const options = await getUpdatedFAQQuestions();

        setFAQQuestions(options);

        const dataCat = options.map(item => {
            return {
                category: item.category,
                categoryLabel: item.categoryLabel,
                sourceName: item.sourceName
            };
        });

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

        categories = [
            { category: 'All', categoryLabel: 'All', sourceName: '' },
            ...categories
        ];

        setCategories(categories);

    }, []);

    // --------------

    const submitQuestionHandler = async () => {
        const res = await getFAQResponseById(selectedQuestion[0].id);
        return {
            ...res,
            answer: res.response
        };
    };

    const selectionChangeHandler = (newCat) => {
        setSelectedCategory(newCat);
        setSelectedQuestion([]);

    };

    const resetInputHandler = () => {

        setSelectedCategory([]);
        // refTypeaheadCat.current.clear();

        setSelectedQuestion([]);
        // refTypeaheadFAQ.current.clear();


    };

    const onSubmit = () => {
        props.onSubmitDataHandler(submitQuestionHandler);
        setSelectedQuestion([]);

    };

    const questionSelectionRendererHandler = (option) => (
        <div>
            {option.question}
            <div>
                <small>Category: {option.categoryLabel}</small>
            </div>
        </div>
    );


    return (<div>

        <Form.Group>
            <InputGroup>
                <div className={classes['cat-selection-label-container']}>
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            <GrFilter /> &nbsp; <span className={classes['cat-selection-label']}>Filter by Category: </span>
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
                        placeholder="(Optional) Select or Type a Category"
                        ref={refTypeaheadCat}
                    />

                </div>

            </InputGroup>
        </Form.Group>

        <Form>

            <Form.Row className="align-items-center">

                <Col sm={12} className="mb-2">
                    <div>
                        <Typeahead
                            id="faq-typeahead"
                            onChange={setSelectedQuestion}
                            options={faqQuestions}
                            placeholder="Select or Type a Question or Category"
                            selected={selectedQuestion}
                            filterBy={['question', 'categoryLabel', 'sourceName']}
                            labelKey="question"
                            ref={refTypeaheadFAQ}
                            clearButton
                            renderMenuItemChildren={questionSelectionRendererHandler}
                        />
                    </div>

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

        <p>
            FAQ Sources:&nbsp;
            <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/question-and-answers-hub" target="_blank" rel="noreferrer">WHO</a>,&nbsp;
            <a href="https://www.cdc.gov/coronavirus/2019-ncov/faq.html" target="_blank" rel="noreferrer">CDC</a>,&nbsp;
            <a href="https://www.fda.gov/emergency-preparedness-and-response/coronavirus-disease-2019-covid-19/covid-19-frequently-asked-questions" target="_blank" rel="noreferrer">FDA</a>
        </p>




    </div>);
};

export default FAQ;
