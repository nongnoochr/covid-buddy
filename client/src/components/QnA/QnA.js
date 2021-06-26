import React, { useContext, useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Spinner, Tabs, Tab } from 'react-bootstrap';

import FAQ from './FAQ';
import Buddy from './Buddy';
import Response from './Response';

import HCPContext from '../../store/hcp-context.js';
import { getSuggestedSPsNearMe } from '../../services/HCLSDKService';


// Styling
import classes from './QnA.module.css';

// Icons
import { BsCardChecklist } from 'react-icons/bs';
import { FaQuestionCircle } from 'react-icons/fa';
import { FcFaq } from 'react-icons/fc';
import { RiQuestionAnswerLine } from 'react-icons/ri';

const QnA = (props) => {

    const location = useLocation();
    const history = useHistory();

    // --- refs
    const refSelfChecker = useRef(null);
    const refResponse = useRef(null);

    // --- contexts
    const ctx = useContext(HCPContext);

    // --- states
    const [isFindingAnswer, setIsFindingAnswer] = useState('');
    const [activeKey, setActiveKey] = useState('faq');

    const [allResponses, setAllResponses] = useState([]);

    const [jsxResponse, setJSXResponse] = useState([]);

    // --- Effects

    // Update the active tab key when a hash value is change
    // This is required since we need to see whether the 'Checker' tab is active
    // If so, the page needs to be reloaded to ensure that the CDC-Healthbot is
    // added/rendered properly (It sometimes does not show up if the 'Checker' 
    // tab is not active)
    useEffect(() => {
        if (location.hash) {
            const key = location.hash.slice(1);
            setActiveKey(key);
        }

    }, [location.hash]);


    useEffect(() => {
        if (allResponses.length > 0) {
            const curRes = allResponses[0];
            const newResJsx = (
                <div key={Date.now()}>
                    <div className={classes['answer-item-timestamp']}>{curRes.timestamp.toLocaleString()}</div>
                    <Response data={curRes} />
                    <hr />
                </div>);

            setJSXResponse(prev => {

                return [
                    newResJsx,
                    ...prev
                ];
            });

        }

    }, [allResponses]);

    // --- Handlers

    /**
     * Invoke the input async function callback when the submit button is clicked
     * @async
     * @param {object} fcn Asycn callback that will be executed after the submit
     * button is clicked
     */
    const submitQuestionHandler = async (fcn) => {

        setIsFindingAnswer('Finding answer...');

        setTimeout(async () => {
            const res = await fcn();

            // --- Main
            // Get SpecialistNearme info
            const specialistsNearMe = await getSuggestedSPsNearMe(res);
            if (res.top5) {
                let coords = { ...specialistsNearMe.data.coords };
                for (let index = 0; index < res.top5.length; index++) {
                    if (index === 0) {
                        res.top5[index] = {
                            ...res.top5[index],
                            specialistsNearMe: { ...specialistsNearMe },
                        };

                    } else {
                        const curSPNearMe = await getSuggestedSPsNearMe(res.top5[index], {coords});
                        res.top5[index] = {
                            ...res.top5[index],
                            specialistsNearMe: { ...curSPNearMe },
                        };

                        // Save coords data if one found
                        if (curSPNearMe.data.coords.lat !== -Infinity) {
                            coords = { ...curSPNearMe.data.coords };
                        }
                    }
                }
            }
            // Append allResponses with the new result + timestamp
            setAllResponses(prevState => {

                return [
                    {
                        ...res,
                        specialistsNearMe: { ...specialistsNearMe },
                        timestamp: new Date()
                    },
                    ...prevState

                ];
            });

            setIsFindingAnswer('');

            // Always scroll to the latest response
            window.scrollTo(0, 0);

            // Scroll to the last response
            refResponse.current.scrollTo(0, 0);

        }, 100);

    };

    /**
     * Set the hash value when selecting a tab
     * If the 'Checker' tab is selected, refresh the page to re-render
     * the CDC Healthbot if it is not already rendered
     * @param {string} key Hash value for the tab
     */
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

    // ---------

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
                        title={(
                            <span title="Frequency Asked Questions">
                                <FaQuestionCircle />&nbsp;
                                <span>FAQs</span>
                            </span>)}
                    >
                        <div className={classes['question-container']}>
                            <FAQ onSubmitDataHandler={submitQuestionHandler} />
                        </div>
                    </Tab>
                    <Tab
                        eventKey="buddy"
                        title={(
                            <span title="Ask Buddy Anything">
                                <FcFaq />&nbsp;
                                <span>Buddy</span>
                            </span>)}
                    >
                        <div className={classes['question-container']}>
                            <Buddy onSubmitDataHandler={submitQuestionHandler} />
                        </div>

                    </Tab>

                    <Tab
                        eventKey="selfchecker"
                        title={(
                            <span title="COVID-19 Self-Checker">
                                <BsCardChecklist />&nbsp;
                                <span>Checker</span>
                            </span>)}
                    >
                        <div className={classes['question-container']}>
                            <div>
                                <div>
                                    <i><b>(Unvaccinated people ONLY)</b> Not sure what to do? Chat with the CDC HealthBot below
                                        to help you make decisions on when to seek testing and
                                        medical care :</i>
                                </div>
                                <div>
                                    <div ref={refSelfChecker}
                                        data-cdc-widget='healthBot'
                                        data-cdc-theme='theme3'
                                        className='cdc-widget-color-white'
                                        data-cdc-language='en-us'>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </div>

            <div>
                <div className={classes['answer-container']}>
                    {
                        activeKey === 'selfchecker' ?
                            ctx.getLinkFindHCP()
                            : (<div>
                                <h5><RiQuestionAnswerLine /> Responses:</h5>
                                <div className={classes['answer-contents']}
                                    ref={refResponse}>
                                    <div>
                                        {!isFindingAnswer || (
                                            <div>
                                                <Spinner animation="border" role="status" variant="primary" />
                                                {isFindingAnswer}
                                                <hr />
                                            </div>
                                        )}

                                        {((allResponses.length === 0) && !isFindingAnswer) ?
                                            (<span><i>No questions asked yet</i></span>) : null}
                                    </div>

                                    <div>
                                        {jsxResponse}
                                    </div>

                                </div>
                            </div>)
                    }
                </div>
            </div>
        </div>
    )
};

export default QnA;