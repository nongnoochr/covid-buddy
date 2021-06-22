import React, { useContext, useState } from 'react';
import { Button, Form, Col } from 'react-bootstrap';

import { FaUserMd } from 'react-icons/fa';

import HCPContext from '../../store/hcp-context';
import HCPMapContext from '../../store/hcpmap-context';


import HCLSDK from './HCLSDK';

const HCPMap = (props) => {
    const ctx = useContext(HCPContext);
    const ctxMap = useContext(HCPMapContext);

    const quickSearchValues = ctxMap.quicksearch.map(item => item.specialtyLabel);

    const [selectedQuickSearch, setSelectedQuickSearch] = useState(ctx.quickSearch);
   
    const selectionChangeHandler = (ev) => {

        const newCat = ev.target.value;
        setSelectedQuickSearch(newCat);
    }

    const quickSearchHandler = () => {
        ctx.setQuickSearch(selectedQuickSearch);
    };

    const quickSearchResetHandler = () => {
        setSelectedQuickSearch('All');
        ctx.setQuickSearch('All');
    };


    return (<div>

        <div>
            <Form>
                <Form.Row>
                    <Col xs="auto">
                        <label>
                            <FaUserMd /> <span className="icon-text">Quick Search Near Me:</span> <select
                                value={selectedQuickSearch}
                                className="mb-2"
                                onChange={selectionChangeHandler}
                            >
                                <option value="All"> select option... </option>

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
                            variant={ (selectedQuickSearch === ctx.quickSearch) ? 'dark' : 'primary' }
                            disabled={ selectedQuickSearch === ctx.quickSearch }
                            onClick={quickSearchHandler}>
                            GO
                        </Button>
                    </Col>
                    <Col xs="auto">
                        <Button
                            size="sm"
                            variant="outline-primary"
                            disabled={ ctx.quickSearch === 'All' }
                            onClick={quickSearchResetHandler}>
                            Reset
                        </Button>
                    </Col>
                </Form.Row>
            </Form>
        </div>

        <div>
            <HCLSDK quicksearch={ctx.quickSearch} />
        </div>

        
    </div>
    );
};

export default HCPMap;