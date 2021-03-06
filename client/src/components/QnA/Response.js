import { Accordion, Card, Button } from 'react-bootstrap';

import classes from './Response.module.css';
import Suggestion from './Suggestion';

// Icons
import { RiUserVoiceLine } from 'react-icons/ri';
import { SiProbot } from 'react-icons/si';


// --- Helpers
const getFromFAQJsx = (res) => (
    <div>
        <i>From FAQ: {res.origquestion || res.question} (Confidence: {(res.score * 100).toFixed(1)}%)</i>
    </div>
);

const getSourceJsx = (res) => (
    <div>
        <a href={res.source} target="_blank" rel="noreferrer">source - {res.sourceName}</a>
    </div>
);


// ----------------
const Response = (props) => {

    const res = props.data;

    // --- Helpers
    /**
     * Get JSX for a user question
     * @returns {JSX} JSX User Question
     */
    const getJsxUserQuestion = () => {
        return (
            <div>
                <div>
                    <span className={classes['answer-user-user']}>
                        <RiUserVoiceLine /> You:&nbsp;
                    </span>
                    <b>{res.question}</b>
                </div>
            </div>
        );
    };

    /**
     * Get JSX for a robot header
     * @returns {JSX} JSX Robot Header
     */
    const getJsxRobotHeader = () => {
        return (<div>
            <span className={classes['answer-user-buddy']}>
                <SiProbot /> Buddy:&nbsp;
            </span>
        </div>);
    }

    // --- If a result is valid (id > -1)
    if (res.id > -1) {
        return (
            <div>
                {/* User Question */}
                {getJsxUserQuestion()}
                {/* --------------------------- */}

                {/* Buddy Response */}
                <div>
                    {getJsxRobotHeader()}
                    <div>
                        <div className={classes['answer-question-container']}>
                            {res.origquestion ? getFromFAQJsx(res) : null}
                            {res.source ? getSourceJsx(res) : null}
                        </div>
                        <div>{res.answer}</div>
                    </div>

                    <Suggestion data={res} />

                    {/* Show Top-5 FAQs if data is available (Only available in the Buddy mode) */}
                    {
                        (res.top5 && res.top5.length > 1) ?
                            (
                                <div className={classes['answer-additional-faqs-container']}>
                                    <h6>Other related FAQs </h6>
                                    <div>
                                        <Accordion>
                                            {res.top5.slice(1).map((item, index) => (
                                                <Card key={index}>
                                                    <Card.Header>
                                                        <Accordion.Toggle
                                                            as={Button}
                                                            variant="link"
                                                            eventKey={`"${index}"`}
                                                            style={{ textAlign: "left" }}
                                                            size="sm"
                                                        >
                                                            {getFromFAQJsx(item)}
                                                        </Accordion.Toggle>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey={`"${index}"`}>
                                                        <Card.Body>
                                                            <div className={classes['answer-question-container']}>
                                                                {getSourceJsx(item)}
                                                            </div>
                                                            <div> {item.response} </div>
                                                            <Suggestion data={item} />
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                            ))}
                                        </Accordion>
                                    </div>
                                </div>) : null}
                </div>
            </div>);
    } else {
        // Else, this result is invalid (id === -1)
        return (
            <div>
                {/* User Question */}
                {getJsxUserQuestion()}
                {/* --------------------------- */}


                {/* Buddy Response */}
                <div>
                    {getJsxRobotHeader()}

                    <div style={{ color: 'red' }}>
                        <i>{res.answer || 'Something is wrong. Please try again later.'}</i>
                    </div>
                </div>
            </div>
        );
    }
};

export default Response;