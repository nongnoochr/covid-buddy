import React, { useEffect, useState, useRef } from 'react';
import { Form, Col, Button } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import { getFAQQuestions, getFAQResponseById } from '../../services/QnAService';

// Icons
import { GrFilter } from 'react-icons/gr';

const FAQ = (props) => {
    const refTypeahead = useRef(null);

    const [faqQuestions, setFAQQuestions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedQuestion, setSelectedQuestion] = useState([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        const options = await getFAQQuestions();
        setFAQQuestions(options);
        
        const uniqueCategories = new Set(options.map(item => item.category));
        const categories = [...uniqueCategories];
        setCategories(categories);
        
    }, []);

    // --------------

    const submitQuestionHandler = async () => {
        const res = await getFAQResponseById(selectedQuestion[0].id);
        return {
            id: res.id,
            source: res.source,
            category: res.category,
            question: res.context,
            answer: res.response
        };
    };

    const selectionChangeHandler = (ev) => {

        const newCat = ev.target.value;
        setSelectedCategory(newCat);
        getFAQQuestions(newCat).then(newQuestions => {
            setFAQQuestions(newQuestions)
        });

    };

    const resetInputHandler = () => {
        setSelectedQuestion([]);
        refTypeahead.current.clear();

    };

    const onSubmit = () => {
        props.onSubmitDataHandler(submitQuestionHandler);
        setSelectedQuestion([]);
    };

    const filterByFields = ['question', 'category'];

    


    return (<div>

        <Form>

            <Form.Row className="align-items-center">
                <Col sm={12} className="mb-2">
                    <div>

                        <label>
                            <GrFilter /> Filter FAQs by Category: <select
                                value={selectedCategory}
                                className="mb-2"
                                style={{maxWidth: "85vw"}}
                                onChange={selectionChangeHandler}
                            >
                                <option key='All' value='All'>All</option>
                                {
                                    categories.map((item, index) => {
                                        return (
                                            <option key={index} value={item}>{item}</option>
                                        );
                                    })
                                }
                            </select>
                        </label>
                    </div>

                </Col>



            </Form.Row>

            <Form.Row className="align-items-center">

                <Col sm={12} className="mb-2">
                    <div>
                        <Typeahead
                            id="faq-typeahead"
                            onChange={setSelectedQuestion}
                            options={faqQuestions}
                            placeholder="Select or Type a Question or Category"
                            selected={selectedQuestion}
                            filterBy={filterByFields}
                            labelKey="question"
                            ref={refTypeahead}
                            // clearButton
                            renderMenuItemChildren={(option) => (
                                <div>
                                    {option.question}
                                    <div>
                                        <small>Category: {option.category}</small>
                                    </div>
                                </div>
                            )}
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




    </div>);
};

export default FAQ;
