import React, { useEffect, useState } from 'react';
import { Button, Form, Col } from 'react-bootstrap';

import { FaUserMd } from 'react-icons/fa';

const HCPMap = (props) => {
    useEffect(() => {
        const HCLSDK = document.querySelector('hcl-sdk');
        HCLSDK.init({
            apiKey: '30008a88a12364f2',
            appName: 'https://github.com/nongnoochr',
            appURL: 'https://github.com/nongnoochr'
        });

        // debugger
        // customElements.whenDefined('hcl-sdk').then(function () {
        //     debugger

        // });
    });

    const quickSearchValues = ['All', 'Physician', 'Pediatric', 'Cardiologis', 'Psychologist']


    const [selectedQuickSearch, setSelectedQuickSearch] = useState('All');
    const [searchStatus, setSearchStatus] = useState('');


    const selectionChangeHandler = (ev) => {

        const newCat = ev.target.value;
        setSelectedQuickSearch(newCat);

    }

    const quickSearchHandler = () => {
        setSearchStatus('This feature is under construction... :)');
    }


    return (<div>

        <div>
            <Form>
                <Form.Row>
                    <Col xs="auto">
                        <label>
                            <FaUserMd /> Quick Search: <select
                                value={selectedQuickSearch}
                                className="mb-2"
                                onChange={selectionChangeHandler}
                            >
                                {
                                    quickSearchValues.map((item, index) => {
                                        return (
                                            <option key={index} value={item}>{item}</option>
                                        );
                                    })
                                }
                            </select>
                        </label>
                    </Col>
                    <Col xs="auto">
                        <Button
                            size="sm"
                            onClick={quickSearchHandler}>
                            GO
                    </Button>
                    </Col>
                </Form.Row>
            </Form>
        </div>
        <div>
            { searchStatus ? (<span style={{color: 'red'}}>{ searchStatus }</span>) : null }
        </div>

        <div className="sdk-parent-element" style={{ height: "75vh" }}>
            <hcl-sdk></hcl-sdk>
        </div>
    </div>
    );
};

export default HCPMap;