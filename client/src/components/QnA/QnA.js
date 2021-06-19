import React, { useContext, useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Spinner, Tabs, Tab } from 'react-bootstrap';

import FAQ from './FAQ';
import Buddy from './Buddy';

import HCPContext from '../../store/hcp-context.js';

// Styling
import classes from './QnA.module.css';

// Icons
import { BsCardChecklist } from 'react-icons/bs';
import { FaQuestionCircle } from 'react-icons/fa';
import { FcFaq } from 'react-icons/fc';
import { RiUserVoiceLine, RiQuestionAnswerLine } from 'react-icons/ri';
import { SiProbot } from 'react-icons/si';

const QnA = (props) => {

    const refSelfChecker = useRef(null);
    const refResponse = useRef(null);

    const ctx = useContext(HCPContext);
    const location = useLocation();
    const history = useHistory();

    const [isFindingAnswer, setIsFindingAnswer] = useState('');
    const [activeKey, setActiveKey] = useState('faq');

    const [allResponses, setAllResponses] = useState([]);
    const [jsxResponse, setJSXResponse] = useState(null);

    useEffect(() => {
        if (location.hash) {
            const key = location.hash.slice(1);
            setActiveKey(key);
        }

    }, [location.hash]);

    const submitQuestionHandler = async (fcn) => {

        setIsFindingAnswer('Finding answer...');

        setTimeout(async () => {

            const res = await fcn();

            setAllResponses(prevState => {
                // Show the latest question first
                return [
                    {
                        ...res,
                        timestamp: new Date()
                    },
                    ...prevState

                ];
            });

            setIsFindingAnswer('');
            // Always scroll to the latest response
            window.scrollTo(0, 0);
            refResponse.current.scrollTo(0, 0);
        }, 100);

    };

    // ---------

    const jsSpinner = (
        <div>
            <Spinner animation="border" role="status" variant="primary" />
            {isFindingAnswer}
            <hr />
        </div>
    );

    // const parser = new DOMParser();

    const jsxResponseHandler = (res) => {

        let resJSX;

        if (res.id > -1) {
            resJSX = (
                <div>
                    <div>
                        <div><span className={classes['answer-user-user']}><RiUserVoiceLine /> You:</span> <b>{res.question}</b> </div>
                    </div>
                    <div>
                        <div><span className={classes['answer-user-buddy']}><SiProbot /> Buddy:</span> </div>
                        <div>
                            {res.origquestion ? (<div><i>FAQ: {res.origquestion}</i></div>) : null }
                            <div>{res.answer}</div>
                        </div>
                        {res.source ? (<div>From: <a href={res.source} target="_blank" rel="noreferrer">source</a></div>) : null}
    
                        <div className={classes['answer-findhcp-container']}>{ctx.getLinkFindHCP(res.predictedHCP)}</div>
                    </div>
                </div>
            );
        } else {
            resJSX = (
                <div style={{color: 'red'}}>
                    <i>Something is wrong. Please try again later.</i>
                </div>
            );
        }

        // // In case a patch for DOMParser does not work
        // // Roll back to remove all HTMLtags
        // const regex = /(<([^>]+)>)/ig;
        // const innerText = res.answer.replace(regex, "");

        // jsxAnswer = (
        //     <>
        //         <div>{ innerText }</div>
        //     </>
        // );

        
        return resJSX;
    };

    useEffect(() => {
        const newResJsx = allResponses.map((curRes, index) => {
            return (
                <div key={index}>
                    <div className={classes['answer-item-timestamp']}>{curRes.timestamp.toLocaleString()}</div>
                    {jsxResponseHandler(curRes)}
                    <hr />
                </div>
            );
        });
        setJSXResponse(newResJsx);

    }, [allResponses]); // eslint-disable-line react-hooks/exhaustive-deps


    const handleSelect = (key) => {
        history.push({
            pathname: location.pathname,
            hash: key
        });

        setActiveKey(key);

        if (key === "selfchecker") {
            // Need to reload the page if when selfchecker dom is not populated
            if (!refSelfChecker.current.innerHTML) {
                history.go(0);
            };

        }
    };
    return (
        <div className="container main-container">
            <div>
                <Tabs
                    defaultActiveKey={activeKey}
                    activeKey={activeKey}
                    onSelect={handleSelect}
                    id="uncontrolled-tab-example">
                    <Tab
                        eventKey="faq"
                        title={(<span title="Frequency Asked Questions"><FaQuestionCircle /> <span>FAQs</span></span>)}
                    >
                        <div className={classes['question-container']}>
                            <FAQ onSubmitDataHandler={submitQuestionHandler} />
                        </div>
                    </Tab>
                    <Tab
                        eventKey="buddy"
                        title={(<span title="Ask Buddy Anything"><FcFaq /> <span>Buddy</span></span>)}
                    >
                        <div className={classes['question-container']}>
                            <Buddy onSubmitDataHandler={submitQuestionHandler} />
                        </div>

                    </Tab>

                    <Tab
                        eventKey="selfchecker"
                        title={(<span title="COVID-19 Self-Checker"><BsCardChecklist /> <span>Checker</span></span>)}
                    >
                        <div className={classes['question-container']}>
                            <div>
                                <div>
                                    <i><b>(Unvaccinated people ONLY)</b> Not sure what to do? Chat with the CDC HealthBot below
                                    to help you make decisions on when to seek testing and
                                    medical care :</i>
                                </div>
                                <div>
                                    <div ref={refSelfChecker} data-cdc-widget='healthBot' data-cdc-theme='theme3' className='cdc-widget-color-white' data-cdc-language='en-us'></div>
                                </div>

                            </div>
                        </div>
                    </Tab>

                </Tabs>


            </div>

            <div>
                <div className={classes['answer-container']}>

                    {
                        activeKey === 'selfchecker' ? ctx.getLinkFindHCP() :
                            (<div ref={refResponse} >
                                <h5><RiQuestionAnswerLine /> Responses:</h5>
                                <div className={classes['answer-contents']}>

                                    <div>
                                        {!isFindingAnswer || jsSpinner}
                                        {((allResponses.length === 0) && !isFindingAnswer) ?
                                            (<span><i>No questions asked yet</i></span>) : null}


                                    </div>

                                    {jsxResponse}
                                </div>
                            </div>)
                    }
                </div>
            </div>
        </div>
    )
};

export default QnA;