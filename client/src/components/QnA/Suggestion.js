import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

import HCPCard from './HCPCard';

import classes from './Suggestion.module.css';
import HCPContext from '../../store/hcp-context.js';

// Icons
import { BiHide } from 'react-icons/bi';
import { FaUserMd } from 'react-icons/fa';
import { MdMyLocation } from 'react-icons/md';

const distanceUnits = ['meters', 'miles'];

const Suggestion = (props) => {

    const res = props.data;
    const inPredictedHCP = res.predictedHCP;
    const isNearMeSPsApplicable = inPredictedHCP !== 'All';

    const currentCoords = { ...res.specialistsNearMe.data.coords };
    const statusNearMeSPs = res.specialistsNearMe.data.status;
    const messageNearMeSPs = res.specialistsNearMe.data.message;

    const suggestedSPs = [...res.specialistsNearMe.data.activities];

    // --- contexts
    const ctx = useContext(HCPContext);

    // --- states
    const [showSPs, setShowSPs] = useState(false);
    const [distanceUnitValue, setDistanceUnitValue] = useState(distanceUnits[0]);


    return (
        <div>
            {/* Find HCP link */}
            <div className={classes['answer-findhcp-container']}>{ctx.getLinkFindHCP(inPredictedHCP)}</div>

            {/* Show suggested nearby specialists if provided by AI */}

            {isNearMeSPsApplicable ? (

                <div>

                    {/* Show nearby specialists if a suggested specialist is provided */}
                    {(suggestedSPs.length > 0) ?
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
                                                <MdMyLocation /> <b>Your location</b> <span className="icon-text">Latitude: </span>{currentCoords.lat ? currentCoords.lat.toFixed(4) : ''} , <span className="icon-text">Longitude: </span>{currentCoords.lon ? currentCoords.lon.toFixed(4) : ''}
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
                                                            current-coords={{ ...currentCoords }}
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
                    {(statusNearMeSPs && (suggestedSPs.length === 0)) ?
                        (<div className={classes['no-specialists-container']}>
                            There are <b>no {inPredictedHCP}</b> near you
                        </div>)
                        : null
                    }

                    {/* Error in finding nearby specialist */}
                    {(!statusNearMeSPs) ?
                        (<div className={classes['query-error-container']}>
                            {messageNearMeSPs}</div>)
                        : null
                    }

                </div>
            ) : null}
        </div>
    )
};

export default Suggestion;