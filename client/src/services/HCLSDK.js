import React, { useContext, useEffect, useState } from 'react';
import { Badge, Form, Col } from 'react-bootstrap';


import HCPContext from '../../store/hcp-context';

import { defaultSDKConfig, quickSearchData } from '../../services/HCLSDKService';


const HCLSDK = (props) => {

    const ctx = useContext(HCPContext);
    const [appliedQuickSearch, setAppliedQuickSearch] = useState(ctx.quickSearch);


    useEffect(() => {

        // eslint-disable-next-line no-undef
        setAppliedQuickSearch(ctx.quickSearch);

        const HCLSDK = document.querySelector('hcl-sdk');

        let curSDKConfig = {
            ...defaultSDKConfig
        };

        if (ctx.quickSearch && (ctx.quickSearch !== 'All')) {

            const dataSpecialty = quickSearchData.filter(item => (item.specialtyLabel === ctx.quickSearch))[0];

            curSDKConfig = {
                ...curSDKConfig,
                entry: {
                    screenName: 'searchNearMe',
                    specialtyCode: dataSpecialty.specialtyCode
                }
            };
        } else {
            // Use a default search screen by default (Including 'All)
            curSDKConfig = {
                ...curSDKConfig,
                entry: {
                    screenName: 'home',
                }
            };

        }

        HCLSDK.init(curSDKConfig);

    }, [ctx.quickSearch])


    return (
        <div>

            { (ctx.quickSearch && (ctx.quickSearch !== 'All')) ? 
                (<div>
                    <Form>
                        <Form.Row>
                            <Col xs="auto">
                                <span style={{ fontSize: "smaller", fontWeight: "bold" }}>Applied Quick search: </span>
                            </Col>
                            <Col xs="auto">
                                <Badge variant="info"> {appliedQuickSearch} </Badge>
                            </Col>
                        </Form.Row>
                    </Form>
                </div>)
                : null
            }

            <div className="sdk-parent-element" style={{ width: "100%", height: "75vh" }}>
                <hcl-sdk></hcl-sdk>
            </div>
        </div>

    );
};

export default HCLSDK;