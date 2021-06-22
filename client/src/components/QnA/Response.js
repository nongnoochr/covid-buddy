import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import classes from './Response.module.css';
import HCPContext from '../../store/hcp-context.js';
import HCPMapContext from '../../store/hcpmap-context';

import { BiHide } from 'react-icons/bi';
import { FaUserMd } from 'react-icons/fa';
import { MdMyLocation } from 'react-icons/md';



import { defaultSDKConfig } from '../../services/HCLSDKService';



import { Accordion, Card, Button } from 'react-bootstrap';

import { RiUserVoiceLine } from 'react-icons/ri';
import { SiProbot } from 'react-icons/si';

const Response = (props) => {

    const res = props.data;
    const ctx = useContext(HCPContext);
    const ctxMap = useContext(HCPMapContext);

    const [currentCoords, setCurrentCoords] = useState({});
    const [doneGetSPs, setDoneGetSPs] = useState(false);
    const [suggestedSPs, setSuggestedSPs] = useState([]);
    const [showSPs, setShowSPs] = useState(false);

    const [isGeoLocationOn, setIsGeoLocationOn] = useState(true);

    const findSpecialistsNearMe = (spCode) => {
        navigator.geolocation.getCurrentPosition(position => {
            setIsGeoLocationOn(true);
            
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


            // eslint-disable-next-line no-undef
            const api = new HclAPI(defaultSDKConfig);

            const params = {
                first: 10,
                offset: 0,
                specialties: [spCode],
                location: { lat: curLat, lon: curLon } // Natick!
            };

            api.activities(params)

                .then(result => {
                    setSuggestedSPs(result.activities);
                    setDoneGetSPs(true);

                })

                .catch(err => {
                    debugger
                    setDoneGetSPs(true);
                    // An error happened.

                })

        },
            error => {
                setIsGeoLocationOn(false);
                setDoneGetSPs(false);

                if (error.code === error.PERMISSION_DENIED) {
                    console.log("you denied me :-(");
                }

            });
    }


    useEffect(() => {
        if (res && (res.predictedHCP !== 'All')) {

            const spCode = ctxMap.quicksearch.find(item => item.specialtyLabel === res.predictedHCP)['specialtyCode'];
            findSpecialistsNearMe(spCode);




        }
    }, []);



    const getSourceJsx = (res) => (<div>
        <a href={res.source} target="_blank" rel="noreferrer">source - {res.sourceName}</a>
    </div>);

    const getFromFAQJsx = (res) => (<div>
        <i>From FAQ: {res.origquestion || res.question} (Confidence: {(res.score * 100).toFixed(1)}%)</i>
    </div>);

    if (res.id > -1) {
        return (
            <div>
                <div>
                    <div><span className={classes['answer-user-user']}><RiUserVoiceLine /> You:</span> <b>{res.question}</b> </div>
                </div>
                <div>
                    <div><span className={classes['answer-user-buddy']}><SiProbot /> Buddy:</span> </div>
                    <div>
                        <div className={classes['answer-question-container']}>
                            {res.origquestion ? getFromFAQJsx(res) : null}
                            {res.source ? getSourceJsx(res) : null}
                        </div>

                        <div>{res.answer}</div>
                    </div>

                    <div>
                        <div className={classes['answer-findhcp-container']}>{ctx.getLinkFindHCP(res.predictedHCP)}</div>

                        <div>
                            {isGeoLocationOn ?
                                (<div>
                                    {(doneGetSPs && res && (res.predictedHCP !== 'All') && (suggestedSPs.length > 0)) ?
                                        <div>
                                            <div onClick={() => setShowSPs(!showSPs)}>
                                                {showSPs ?
                                                    (<><BiHide /> <Link><span>Click to hide...</span></Link></>)
                                                    : (<><FaUserMd /> <Link><span>Click to see specialists ({res.predictedHCP}) near you...</span>
                                                    </Link></>)}
                                            </div>
                                            {
                                                showSPs ? (
                                                    <div className={classes['answer-showsps-container']}>
                                                        <div className={classes['current-location-container']}>
                                                            <MdMyLocation /> <b>Your location</b> Latitude: {currentCoords.lat ? currentCoords.lat.toFixed(4) : ''} , Longitude: {currentCoords.lon ? currentCoords.lon.toFixed(4) : ''}
                                                        </div>

                                                        <div>
                                                            {suggestedSPs.map((curData, index) => {
                                                                return (
                                                                    <div className={classes['specialist-container']} key={index}>
                                                                        <div className={classes['individual-name']}>{curData.activity.individual.firstName} {curData.activity.individual.middleName} {curData.activity.individual.lastName}</div>
                                                                        <div className={classes['individual-prof']}>{curData.activity.individual.professionalType.label} ({curData.activity.individual.specialties.map(item => item.label).join(', ')})</div>
                                                                        <div className={classes['workplace-address']}>{curData.activity.workplace.address.buildingLabel}
                                                                            {curData.activity.workplace.address.longLabel}  {curData.activity.workplace.address.city.label},  {curData.activity.workplace.address.county.label}
                                                                        </div>
                                                                        <div>{curData.distance}m</div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                    </div>) : null
                                            }
                                        </div>
                                        : null
                                    }

                                    {(doneGetSPs && res && (res.predictedHCP !== 'All') && (suggestedSPs.length === 0)) ?
                                        (<div className={classes['no-specialists-container']}>
                                            There are <b>no {res.predictedHCP}</b> near you
                                        </div>)
                                        : null
                                    }
                                </div>)
                                : <div className={classes['no-specialists-container']}> 
                                    Turn on your location to find {res.predictedHCP} near you
                                </div>
                            }

                        </div>


                    </div>

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
                                                            <div>
                                                                {item.response}
                                                            </div>
                                                            <div className={classes['answer-findhcp-container']}>{ctx.getLinkFindHCP(item.predictedHCP)}</div>
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                            )
                                            )}
                                        </Accordion>
                                    </div>
                                </div>)
                            : null
                    }

                </div>
            </div>
        );
    } else {
        return (
            <div>
                <div>
                    <div><span className={classes['answer-user-user']}><RiUserVoiceLine /> You:</span> <b>{res.question}</b> </div>
                </div>
                <div>
                    <div><span className={classes['answer-user-buddy']}><SiProbot /> Buddy:</span> </div>

                    <div style={{ color: 'red' }}>
                        <i>{res.answer || 'Something is wrong. Please try again later.'}</i>
                    </div>
                </div>

            </div>


        );

    }
};

export default Response;