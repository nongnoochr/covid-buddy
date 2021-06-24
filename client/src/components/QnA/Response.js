import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Card, Button, ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

import classes from './Response.module.css';
import HCPContext from '../../store/hcp-context.js';

import HCPCard from './HCPCard';

// Icons
import { BiHide } from 'react-icons/bi';
import { FaUserMd } from 'react-icons/fa';
import { MdMyLocation } from 'react-icons/md';
import { RiUserVoiceLine } from 'react-icons/ri';
import { SiProbot } from 'react-icons/si';

const distanceUnits = ['meters', 'miles'];


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

    const isNearMeSPsApplicable = res.specialistsNearMe.applicable;
    const currentCoords = { ...res.specialistsNearMe.data.coords };
    const suggestedSPs = [...res.specialistsNearMe.data.activities];
    const statusNearMeSPs = res.specialistsNearMe.data.status;
    const messageNearMeSPs = res.specialistsNearMe.data.message;

    // --- contexts
    const ctx = useContext(HCPContext);

    // --- states
    const [showSPs, setShowSPs] = useState(false);
    const [distanceUnitValue, setDistanceUnitValue] = useState(distanceUnits[0]);


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

    /**
     * Get JSX for the bottom section of the response
     * @param {string} inPredictedHCP Predicted HCP
     * @returns {JSX} JSX for the bottom section of the response
     */
    const getJsxBottom = (inPredictedHCP) => {
        return (
            <div>
                {/* Find HCP link */}
                <div className={classes['answer-findhcp-container']}>{ctx.getLinkFindHCP(inPredictedHCP)}</div>

                {/* Show suggested nearby specialists if provided by AI */}

                {inPredictedHCP !== 'All' ? (

                    <div>

                        {/* Show nearby specialists if a suggested specialist is provided */}
                        {(isNearMeSPsApplicable && (suggestedSPs.length > 0)) ?
                            <div>
                                {/* Link to Show/Hide nearby specialists */}
                                <div onClick={() => setShowSPs(!showSPs)}>
                                    {showSPs ?
                                        (<><BiHide /> <Link to="#"><span>Click to hide...</span></Link></>)
                                        : (<><FaUserMd /> <Link to="#"><span>Click to see specialists ({inPredictedHCP}) near you...</span>
                                        </Link></>)}
                                </div>

                                {/* Nearby specialists section */}
                                {
                                    showSPs ? (
                                        <div className={classes['answer-showsps-container']}>
                                            <div className={classes['header-container']}>
                                                {/* Show current location */}
                                                <div className={classes['current-location-container']}>
                                                    <MdMyLocation /> <b>Your location</b> Latitude: {currentCoords.lat ? currentCoords.lat.toFixed(4) : ''} , Longitude: {currentCoords.lon ? currentCoords.lon.toFixed(4) : ''}
                                                </div>
                                                <div>
                                                    <ButtonToolbar className={classes['distance-unit-container']}>
                                                        <b>Distance:&nbsp;</b>
                                                        <ToggleButtonGroup
                                                            type="radio"
                                                            name="options"
                                                            size="sm"
                                                            value={distanceUnitValue}
                                                            onChange={(val) => setDistanceUnitValue(val)}
                                                            defaultValue={distanceUnits[0]}>
                                                            {
                                                                distanceUnits.map((item, index) => {
                                                                    return (
                                                                        <ToggleButton
                                                                            key={index}
                                                                            value={item}
                                                                            variant="outline-primary"
                                                                        >
                                                                            {item}
                                                                        </ToggleButton>
                                                                    );
                                                                })
                                                            }
                                                        </ToggleButtonGroup>
                                                    </ButtonToolbar>
                                                </div>

                                            </div>


                                            {/* Show a list of nearby specialists */}
                                            <div>
                                                {suggestedSPs.map((curData, index) => {
                                                    return (
                                                        <div className={classes['specialist-container']} key={index}>
                                                            <HCPCard
                                                                activity={curData.activity}
                                                                distance={curData.distance}
                                                                distance-unit={distanceUnitValue} 
                                                                current-coords={ {...currentCoords} }
                                                                />

                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>) : null
                                }
                            </div>
                            : null
                        }

                        {/* No nearby specialists */}
                        {(isNearMeSPsApplicable && statusNearMeSPs && (suggestedSPs.length === 0)) ?
                            (<div className={classes['no-specialists-container']}>
                                There are <b>no {inPredictedHCP}</b> near you
                            </div>)
                            : null
                        }

                        {/* Error in finding nearby specialist */}
                        {(isNearMeSPsApplicable && !statusNearMeSPs) ?
                            (<div className={classes['query-error-container']}>
                                {messageNearMeSPs}</div>)
                            : null
                        }

                    </div>
                ) : null}

            </div >
        );
    };

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

                    {getJsxBottom(res.predictedHCP)}

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
                                                            {getJsxBottom(item.predictedHCP)}
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
const areEqual = (prevProps, nextProps) => true;

export default React.memo(Response, areEqual);