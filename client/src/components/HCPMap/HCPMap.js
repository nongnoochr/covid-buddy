import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Col } from 'react-bootstrap';

import { FaUserMd } from 'react-icons/fa';

import HCPContext from '../../store/hcp-context';

import HCLSDK from '../HCLSDK';

const HCPMap = (props) => {

    const ctx = useContext(HCPContext);

   
    const quickSearchValues = ['All', 'Physician', 'Pediatric', '<Doctor for Women>', 'Cardiologist', 'Psychologist']

    const [searchStatus, setSearchStatus] = useState('');
    const [selectedQuickSearch, setSelectedQuickSearch] = useState(ctx.quickSearch);
    const [appliedQuickSearch, setAppliedQuickSearch] = useState(ctx.quickSearch);

   
    const selectionChangeHandler = (ev) => {

        const newCat = ev.target.value;
        setSelectedQuickSearch(newCat);
    }

    const quickSearchHandler = () => {
        
        let qs = selectedQuickSearch || 'All';
        setAppliedQuickSearch(qs);

    };

    useEffect(() => {
        ctx.addQuickSearchToUrl(appliedQuickSearch);
    }, [appliedQuickSearch])


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
                            // variant={ (selectedQuickSearch === appliedQuickSearch) ? 'dark' : 'warning' }
                            disabled={ selectedQuickSearch === appliedQuickSearch }
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

        <div>
            <HCLSDK quicksearch={appliedQuickSearch} />
        </div>

        
    </div>
    );
};

export default HCPMap;