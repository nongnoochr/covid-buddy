import React, { useState } from 'react';

import classes from './HCPCard.module.css';
import { Link } from 'react-router-dom';
import { getLinkLocation, getSpecialistInfo } from '../../services/HCLSDKService';

import HCPInfo from './HCPInfo';

// Icons
import { FaDirections } from 'react-icons/fa';
import { BiHide } from 'react-icons/bi';
import { FiChevronsRight } from 'react-icons/fi';


const HCPCard = (props) => {

    const act = props.activity;
    const distance = props.distance;
    const distanceUnitValue = props['distance-unit'];

    const spId = act.individual.id;

    // Assemble a link to get a direction in Google Map
    const curLocation = props['current-coords'];
    const workplaceLocation = act.workplace.address.location;

    // const linkDirection = `https://www.google.com/maps/dir/${curLocation.lat},${curLocation.lon}/${workplaceLocation.lat},${workplaceLocation.lon}`;
    const linkDirection = getLinkLocation(curLocation, workplaceLocation);

    // -----------
    // --- states
    const [showMoreInfo, setShowMoreInfo] = useState(false);
    const [dataMoreInfo, setDataMoreInfo] = useState({});


    // ------

    /**
     * Toggle the showMoreInfo section and query data if it is done for the first time
     * @async
     */
    const showMoreInfoHandler = async () => {

        // This operation is only needed to be done once and it can be cached
        // This is done to save the sdk query limit
        if ((!showMoreInfo) && (Object.keys(dataMoreInfo).length === 0)) {
            const data = await getSpecialistInfo(spId);
            setDataMoreInfo(data);
        }
        setShowMoreInfo((prev) => !prev);
    };

    return (
        <div>

            {/* Specialist name */}
            <div className={classes['individual-name']}>{act.individual.firstName} {act.individual.middleName} {act.individual.lastName}</div>

            {/* Professional info */}
            <div className={classes['individual-prof']}>{act.individual.professionalType.label} ({act.individual.specialties.map(item => item.label).join(', ')})</div>

            {/* Workplace address */}
            <div className={classes['workplace-address']}>{act.workplace.address.buildingLabel}
                {act.workplace.address.longLabel}  {act.workplace.address.city.label},  {act.workplace.address.county.label} {act.workplace.address.country}
            </div>

            <div className={classes['distance-container']}>
                {/* Distance from the current location in meters */}
                <div>{
                    (distanceUnitValue === 'meters') ?
                        distance.toLocaleString()
                        : (distance / 1609).toLocaleString()
                }
                    &nbsp;{distanceUnitValue}
                </div>

                <div>&nbsp;&nbsp;&nbsp;&nbsp;</div>

                {/* Get direction from the current location */}

                <div>
                    <a href={linkDirection} title="Get direction" target="_blank" rel="noreferrer"><FaDirections /> Get direction</a>
                </div>

            </div>

            {/* More information */}
            <div className={classes['showmoreinfo-container']}>
                <div>
                    {showMoreInfo ?
                        (<>
                            <Link to="#" onClick={showMoreInfoHandler}>
                                <BiHide />&nbsp;
                                <span>Click to hide more contact information...</span>
                            </Link>
                        </>)
                        : (<>
                            <Link to="#" onClick={showMoreInfoHandler}>
                                <FiChevronsRight />&nbsp;
                                <span>Click to see more contact information...</span>
                            </Link>
                        </>)}
                </div>


                <div className={classes['moreinfo-container']}>
                    {showMoreInfo ?
                        <HCPInfo data={dataMoreInfo.data || {}}
                            cur-longLabel={act.workplace.address.longLabel} />
                        : null}
                </div>
            </div>

        </div>

    );
};

export default HCPCard;