import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, CardGroup, Card, Jumbotron } from 'react-bootstrap';

import HCPContext from '../../store/hcp-context.js';

import CardBody from './CardBody';

// Styling
import classes from './Landing.module.css';

// Icons
import { GrMapLocation } from 'react-icons/gr';
import { FiPhoneCall } from 'react-icons/fi';
import { RiQuestionAnswerLine } from 'react-icons/ri';

const Landing = (props) => {

    const ctx = useContext(HCPContext);
    const history = useHistory();

    // --- Handlers
    // For Jumbotron's Buddy button
    const btnBuddyHandler = () => {
        history.push({
            pathname: '/askbuddy',
            search: ctx.appQueryParams
        });
    };

    // --- Common Jsx
    const jsxFindHCPs = (<div>{ctx.getLinkFindHCP()}</div>);

    // ---------------------------

    return (<>

        <Jumbotron>
            <h1>COVID-19 Buddy: Your Trustworthy Assistant</h1>
            <div>
                <p>
                    Do you have doubts about COVID-19? Do you need help to make decisions on when to seek medical care? <br />
                    No worries. COVID-19 Buddy can help you with it! <br />
                </p>
                <p>
                    Simply chat with the Buddy for assistant or talk to a healthcare provider near you.
                </p>
            </div>

            <div className={classes['jumbotron-button-container']}>
                <Button variant="primary"
                    onClick={btnBuddyHandler}>
                    <RiQuestionAnswerLine /> <span>Ask Buddy</span>
                </Button>
                <Button variant="success"
                    onClick={(ev) => {
                        ev.preventDefault();
                        ctx.linkFindHCPHandler();
                    } }>
                    <GrMapLocation /> <span>Find Healthcare Providers</span>
                </Button>
            </div>
        </Jumbotron>
        <section className="container main-container">
            <CardGroup className={classes['card-group-landing']}>

                <Card className={classes['card-container-outer']}>
                    <Card.Img variant="top" src="images/vaccine.jpg" height="150" />
                    <CardBody title="Why Getting a COVID-19 Vaccine">
                        <div>
                            <ul>
                                <li>Help keep you from getting COVID-19</li>
                                <li>Once you are fully vaccinated, you can start doing more</li>
                                <li>Safer way to help build protection</li>
                                <li>Important tool to help stop the pandemic</li>
                                <li>Vaccines are safe and effective</li>
                            </ul>
                        </div>

                        <div>
                            <div>For more details, visit</div>
                            <div><a href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/index.html" target="_blank" rel="noreferrer">CDC: Vaccines for COVID-19</a></div>
                            {jsxFindHCPs}
                        </div>
                    </CardBody>
                </Card>

                <Card className={classes['card-container-outer']}>
                    <Card.Img variant="top" src="images/cough.jpg" height="150" />
                    <CardBody title="When You Are Sick - Monitor your symptoms">
                        <div>
                            Symptoms of COVID-19 include
                            <ul>
                                <li>Fever</li>
                                <li>Cough</li>
                                <li>Shortness of breath </li>
                                <li>...and more...</li>
                            </ul>
                            Follow instructions from your healthcare provider and local health department.
                        </div>
                        {jsxFindHCPs}
                    </CardBody>
                </Card>

                <Card className={classes['card-container-outer']}>
                    <Card.Img variant="top" src="images/ambulance.jpg" height="150" />
                    <CardBody title="When to seek emergency medical attention">
                        <div>
                            If someone is having
                            <ul>
                                <li>Trouble breathing</li>
                                <li>Persistent pain or pressure in the chest</li>
                                <li>Inability to wake or stay awake</li>
                                <li>Pale, gray, or blue-colored skin, lips, or
                                    nail beds depending on skin tone</li>
                            </ul>
                        </div>
                        <div>
                            <div><FiPhoneCall /> Call <strong>911</strong> or</div>
                            {jsxFindHCPs}
                        </div>
                    </CardBody>
                </Card>

                <Card className={classes['card-container-outer']}>
                    <Card.Img variant="top" src="images/mask.jpg" height="150" />
                    <CardBody title="To prevent the spread of COVID-19">
                        <div>
                            <ul>
                                <li>Wear a mask</li>
                                <li>Stay at least 6 feet apart from others</li>
                                <li>Wash your hands often</li>
                                <li>Cover your coughs and sneezes</li>
                                <li>Clean high-touch surfaces every day</li>
                            </ul>
                        </div>

                        <div>
                            <div>For more details, see</div>
                            <div><a href="https://www.cdc.gov/coronavirus/2019-ncov/downloads/sick-with-2019-nCoV-fact-sheet.pdf" target="_blank" rel="noreferrer">COVID-19 Fact Sheet</a></div>
                        </div>
                    </CardBody>
                </Card>

            </CardGroup>
        </section>

    </>);
};

export default Landing;