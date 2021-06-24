
import classes from './HCPCard.module.css';

// Icons
import { FaDirections } from 'react-icons/fa';


const HCPCard = (props) => {

    const act = props.activity;
    const distance = props.distance;
    const distanceUnitValue = props['distance-unit'];

    // Assemble a link to get a direction in Google Map
    const curLocation = props['current-coords'];
    const workplaceLocation = act.workplace.address.location;
    const linkDirection = `https://www.google.com/maps/dir/${curLocation.lat},${curLocation.lon}/${workplaceLocation.lat},${workplaceLocation.lon}`;

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

        </div>

    );
};

export default HCPCard;