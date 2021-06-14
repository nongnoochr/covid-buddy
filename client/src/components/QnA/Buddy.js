import React, { useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { getResponse } from '../../services/QnAService';

const Buddy = (props) => {

    const [inputQuestion, setInputQuestion] = useState('');

    const inputQuestionHandler = (ev) => {
        setInputQuestion(ev.target.value);
    };

    const onSubmit = async (event) => {

        event.preventDefault();

        if (!inputQuestion) {
            // do nothing if the input question is empty
            return;
        }

        const fcn = async () => {
            // https://towardsdatascience.com/how-we-created-an-open-source-covid-19-chatbot-c5c900b382df
            const regex = /(covid-19|covid)/ig;
            const cleanInputQuestion = inputQuestion.replaceAll(regex, 'coronavirus');
            const result = await getResponse(cleanInputQuestion);

            let response = {
                id: -1,
                source: '',
                category: '',
                question: inputQuestion,
                answer: ''
            };
            if (result[0].score < 5) {
                response.answer = "Sorry, your question does not seem to be related to COVID-19 and I don't know the answer.";
            } else {
                console.log('Top-5 results:', result.slice(0,5));

                response = {
                    id: result[0].id,
                    source: result[0].source,
                    category: result[0].category,
                    question: inputQuestion,
                    answer: result[0].response
                };
            }

            return response;

        };

        props.onSubmitDataHandler(fcn);

        setInputQuestion('');

    };

    return (
        <div>
            <Form onSubmit={onSubmit}>
                <Form.Row className="align-items-center">
                    <Col sm={12}>
                        <Form.Control
                            className="mb-2"
                            placeholder="Enter your question here..."
                            onChange={inputQuestionHandler}
                            value={inputQuestion}
                        />
                    </Col>

                </Form.Row>

                <div className="float-right">
                    <Form.Row className="align-items-center">
                        <Col xs="auto">
                            <Button className="mb-2"
                                disabled={!inputQuestion}
                                onClick={onSubmit}>
                                Submit
                            </Button>
                        </Col>
                        <Col xs="auto">
                            <Button className="mb-2" variant="outline-secondary" onClick={() => setInputQuestion('')}>
                                Reset
                            </Button>
                        </Col>
                    </Form.Row>
                </div>

            </Form>

        </div>
    )
};

export default Buddy;