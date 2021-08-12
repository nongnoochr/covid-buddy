import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import classes from './HCPInfo.module.css';

// Icons
import { AiOutlineGlobal } from 'react-icons/ai';
import { FaRegAddressCard, FaFax } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go';
import { IoMdCall } from 'react-icons/io';


const HCPInfo = (props) => {
    const data = props.data;
    const curLongLabel = props['cur-longLabel'];


    // Reformat activities data so we can use it in the <select> form
    const allActivities = [
        { ...data.mainActivity },
        ...data.otherActivities
    ];

    const optsActivities = allActivities.map((item, index) => {
        return {
            value: String(index),
            data: item
        }
    });

    // Get a corresponding data for the current workplace.
    // We will select this activity by default
    const curActivity = optsActivities.find(item => item.data.workplace.address.longLabel === curLongLabel);

    // -----------
    // --- states
    const [selectedInfoValue, setSelectedInfoValue] = useState(curActivity.value);
    const [selectedInfoData, setSelectedInfoData] = useState(curActivity.data);


    // --- Handlers
    const selectionChangeHandler = (ev) => {

        const selectedValue = ev.target.value;
        setSelectedInfoValue(selectedValue);

        const selectedData = optsActivities.find(item => item.value === selectedValue);
        setSelectedInfoData(selectedData.data);
    };

    // -----
    return (
        <div>

            {Object.keys(data).length > 0 ? (
                <div>
                    <div>
                        <div className={classes['maininfo-container']}>

                            <Container>

                                {/* Workplace selection */}
                                <Row className={classes['maininfo-row']}>
                                    <Col xs={1}>
                                        <FaRegAddressCard className={classes['icon-address']} />
                                    </Col>
                                    <Col xs={10}>
                                        <div>
                                            <select
                                                className={classes['maininfo-select']}
                                                value={selectedInfoValue}
                                                onChange={selectionChangeHandler}
                                            >
                                                {
                                                    optsActivities.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item.value}>
                                                                {(index === 0) ? 'Main Address' : `Address ${item.value}`}
                                                                &nbsp;:&nbsp;
                                                                {`${item.data.workplace.name} - ${item.data.workplace.address.longLabel}`}
                                                            </option>
                                                        );
                                                    })
                                                }
                                            </select>
                                        </div>

                                    </Col>
                                </Row>

                                {/* Selected location info */}
                                <Row className={classes['maininfo-row']}>
                                    <Col xs={1}>
                                        <GoLocation className={classes['icon-location']} />
                                    </Col>
                                    <Col xs={10}>
                                        <div data-testid="data-info">
                                            <div>
                                                {selectedInfoData.workplace.name}
                                            </div>

                                            {selectedInfoData.workplace.address.buildingLabel ?
                                                (<div>{selectedInfoData.workplace.address.buildingLabel}</div>) : null}

                                            <div data-testid="data-workplace">
                                                {selectedInfoData.workplace.address.longLabel}&nbsp;
                                                {selectedInfoData.workplace.address.city.label},&nbsp;
                                                {selectedInfoData.workplace.address.county.label}&nbsp;
                                                {selectedInfoData.workplace.address.postalCode}&nbsp;
                                                {selectedInfoData.workplace.address.country}

                                            </div>
                                        </div>


                                    </Col>
                                </Row>

                                {/* Call info */}
                                <Row className={classes['maininfo-row']}>
                                    <Col xs={1}><IoMdCall /></Col>
                                    <Col xs={4}>{selectedInfoData.phone || (<i>N/A</i>)}</Col>
                                    <Col xs={1}><FaFax /></Col>
                                    <Col xs={4}>{selectedInfoData.fax || (<i>N/A</i>)}</Col>
                                </Row>

                                {/* website info */}
                                <Row className={classes['maininfo-row']}>
                                    <Col xs={1}><AiOutlineGlobal /></Col>
                                    <Col xs={10}>
                                        {selectedInfoData.workplace.webAddress ?
                                            (<a href={selectedInfoData.workplace.webAddress} target="_blank" rel="noreferrer">{selectedInfoData.workplace.webAddress}</a>)
                                            : (<i>N/A</i>)
                                        }

                                    </Col>
                                </Row>
                            </Container>
                        </div>

                    </div>

                    {/* Rate and Refund  */}
                    <div>
                        {/* Data is currently unavailable */}
                    </div>


                </div>)

                : (<div>Data is unavailable</div>)
            }

        </div>
    );
};

export default HCPInfo;