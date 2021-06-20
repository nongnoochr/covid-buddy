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
            // const regex = /(covid-19|covid)/ig;
            // const cleanInputQuestion = inputQuestion.replaceAll(regex, 'coronavirus');
            // const result = await getResponse(cleanInputQuestion);
            const result = await getResponse(inputQuestion);
            let response = {
                id: -1,
                source: '',
                sourceName: '',
                category: '',
                categoryLabel: '',
                question: inputQuestion,
                origquestion: '',
                answer: '',
                score: -Infinity,
                top5: []
            };
            if (result.length > 0) {
                if (result[0].score < 0.5) {
                    response.answer = "Sorry, I don't know the answer :(";
                } else {
                    const resTop5 = result.slice(0,5);
                    console.log('Top-5 results:', resTop5);
    
                    response = {
                        ...resTop5[0],
                        question: inputQuestion,
                        origquestion: resTop5[0].question,
                        answer: resTop5[0].response,
                        score: resTop5[0].score,
                        top5: resTop5
                    };
                }
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