import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Card, Button } from 'react-bootstrap';

import classes from './Response.module.css';
import HCPContext from '../../store/hcp-context.js';
import HCPMapContext from '../../store/hcpmap-context';

import { defaultSDKConfig } from '../../services/HCLSDKService';

// Icons
import { BiHide } from 'react-icons/bi';
import { FaUserMd } from 'react-icons/fa';
import { MdMyLocation } from 'react-icons/md';


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

    // --- contexts
    const ctx = useContext(HCPContext);
    const ctxMap = useContext(HCPMapContext);

    // --- states
    const [isGeoLocationOn, setIsGeoLocationOn] = useState(true);
    const [showSPs, setShowSPs] = useState(false);
    const [suggestedSPs, setSuggestedSPs] = useState([]);
    const [currentCoords, setCurrentCoords] = useState({});
    const [doneGetSPs, setDoneGetSPs] = useState(false);

    const [isQueryError, setIsQueryError] = useState(false);


    // --- useEffects
    // Only suggested specialists if a predictedHCP is provided by AI
    useEffect(() => {

        if (res.predictedHCP && (res.predictedHCP !== 'All')) {
            const spCode = ctxMap.quicksearch.find(item => item.specialtyLabel === res.predictedHCP)['specialtyCode'];
            findSpecialistsNearMe(spCode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- Helpers
    const findSpecialistsNearMe = (spCode) => {
        // If a current location is available
        navigator.geolocation.getCurrentPosition(
            position => {
                setIsGeoLocationOn(true);

                // Get the current coordinates
                const curCoords = position.coords;

                const curLat = curCoords.latitude;
                const curLon = curCoords.longitude;

                // // Test: Natick!
                // const curLat = 42.2775;
                // const curLon = -71.3468;

                setCurrentCoords({
                    lat: curLat,
                    lon: curLon
                });

                // ---------

                // --- Then, make a query to find the 10 closest specialists from
                // the current location

                // eslint-disable-next-line no-undef
                const api = new HclAPI(defaultSDKConfig);

                // Query parameters for the activities api
                const params = {
                    first: 10,
                    offset: 0,
                    specialties: [spCode],
                    location: { lat: curLat, lon: curLon }
                };

                api.activities(params)
                    .then(result => {
                        // Set the suggested specialists data
                        setSuggestedSPs(result.activities);
                        setDoneGetSPs(true);

                    })
                    .catch(err => {
                        // An error happened.
                        setSuggestedSPs([]);
                        setDoneGetSPs(true);
                        setIsQueryError(true);

                        console.error('Error while querying activities');
                    });
            },
            error => {
                // Cannot retrieve user's location
                setIsGeoLocationOn(false);
                setDoneGetSPs(false);
                setSuggestedSPs([]);
                setIsQueryError(true);

                if (error.code === error.PERMISSION_DENIED) {
                    console.log("you denied me :-(");
                }

            });
    }

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

                {/* Suggested specialists */}
                <div>
                    {isGeoLocationOn ?
                        (<div>
                            {/* Still making a query to find nearest specialists */}
                            {(!doneGetSPs && res && (inPredictedHCP !== 'All')) ?
                                (<div>Finding specialists near you...</div>) : null}

                            {/* Show nearby specialists if a suggested specialist is provided */}
                            {(doneGetSPs && res && (inPredictedHCP !== 'All') && (suggestedSPs.length > 0)) ?
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
                                                {/* Show current location */}
                                                <div className={classes['current-location-container']}>
                                                    <MdMyLocation /> <b>Your location</b> Latitude: {currentCoords.lat ? currentCoords.lat.toFixed(4) : ''} , Longitude: {currentCoords.lon ? currentCoords.lon.toFixed(4) : ''}
                                                </div>

                                                {/* Show a list of nearby specialists */}
                                                <div>
                                                    {suggestedSPs.map((curData, index) => {
                                                        return (
                                                            <div className={classes['specialist-container']} key={index}>
                                                                {/* Specialist name */}
                                                                <div className={classes['individual-name']}>{curData.activity.individual.firstName} {curData.activity.individual.middleName} {curData.activity.individual.lastName}</div>

                                                                {/* Professional info */}
                                                                <div className={classes['individual-prof']}>{curData.activity.individual.professionalType.label} ({curData.activity.individual.specialties.map(item => item.label).join(', ')})</div>

                                                                {/* Workplace address */}
                                                                <div className={classes['workplace-address']}>{curData.activity.workplace.address.buildingLabel}
                                                                    {curData.activity.workplace.address.longLabel}  {curData.activity.workplace.address.city.label},  {curData.activity.workplace.address.county.label}
                                                                </div>

                                                                {/* Distance from the current location in meters */}
                                                                <div>{curData.distance.toLocaleString()}m</div>
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
                            {(doneGetSPs && res && (inPredictedHCP !== 'All') && (suggestedSPs.length === 0)) ?
                                (
                                    <>
                                        {isQueryError ?
                                            (<div className={classes['query-error-container']}>
                                                Error occurred when querying for nearby specialists</div>)
                                            : (<div className={classes['no-specialists-container']}>
                                                There are <b>no {inPredictedHCP}</b> near you
                                            </div>)
                                        }
                                    </>
                                )
                                : null
                            }
                        </div>)

                        // Location is currently turned off
                        : <div className={classes['no-specialists-container']}>
                            Turn on your location to find {inPredictedHCP} near you
                        </div>
                    }

                </div>
            </div>
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

export default Response;