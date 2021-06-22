import React, { useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { getResponse } from '../../services/QnAService';

const Buddy = (props) => {

    // --- states
    const [inputQuestion, setInputQuestion] = useState('');

    // --- Handlers
    /**
     * Set inputQuestions as user types into the input widget
     * @param {object} ev Event object
     */
    const inputQuestionHandler = (ev) => {
        setInputQuestion(ev.target.value);
    };

    /**
     * Pass the submit handler to the parent handler and reset the selected question
     */
    const onSubmit = async (event) => {

        event.preventDefault();

        if (!inputQuestion) {
            // do nothing if the input question is empty
            return;
        }

        /**
         * Get a buddy response based on the current input question
         * @async
         * @returns {object} Response from server
         */
        const fcn = async () => {

            const result = await getResponse(inputQuestion);

            // Default output response
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

            // If a response is returned successfully
            if (result.length > 0) {

                if (result[0].score < 0.5) {
                    // Don't show any response if the score is lower than a threshold
                    response.answer = "Sorry, I don't know the answer :(";
                } else {
                    // Only the Top-5 results are returned from the server

                    response = {
                        ...result[0],
                        question: inputQuestion,
                        origquestion: result[0].question,
                        answer: result[0].response,
                        score: result[0].score,
                        top5: result
                    };
                }
            }
            return response;
        };

        // Reset the input widget
        setInputQuestion('');

        // Pass the function to the parent submitHandler
        props.onSubmitDataHandler(fcn);

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

                <Form.Row className="align-items-center float-right">
                    <Col xs="auto">
                        <Button 
                            className="mb-2"
                            disabled={!inputQuestion}
                            onClick={onSubmit}>
                            Submit
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button 
                            className="mb-2" 
                            variant="outline-secondary" 
                            onClick={() => setInputQuestion('')}>
                            Reset
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
        </div>
    )
};

export default Buddy;