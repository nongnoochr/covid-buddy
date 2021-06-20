import React, { useContext, useEffect, useState } from 'react';
import { Badge, Form, Col } from 'react-bootstrap';


import HCPContext from '../../store/hcp-context';
import HCPMapContext from '../../store/hcpmap-context';

import { defaultSDKConfig } from '../../services/HCLSDKService';

// debugger
// // eslint-disable-next-line no-undef
// const api = new HclAPI(defaultSDKConfig);
// const params = {
//     id: 'WCAM0000048701',
//   };
//   api.activityByID(params)
//     .then(res => {
//         debugger
//       console.log("activityByID", res)
//     })
//     .catch(err => {
//         debugger
//       alert('activityByID error', err.message);
//     })
  

const HCLSDK = (props) => {

    const ctx = useContext(HCPContext);
    const ctxMap = useContext(HCPMapContext);

    const [appliedQuickSearch, setAppliedQuickSearch] = useState(ctx.quickSearch);


    useEffect(() => {

        setAppliedQuickSearch(ctx.quickSearch);

        const HCLSDK = document.querySelector('hcl-sdk');

        let curSDKConfig = {
            ...defaultSDKConfig
        };

        if (ctx.quickSearch && (ctx.quickSearch !== 'All')) {

            const dataSpecialty = ctxMap.quicksearch.filter(item => (item.specialtyLabel === ctx.quickSearch))[0];

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

    }, [ctx.quickSearch, ctxMap.quicksearch])

    // customElements.whenDefined('hcl-sdk').then(function () {
    //         debugger
    // });    

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

            <div className="sdk-parent-element" style={{ height: "75vh" }}>
                <hcl-sdk></hcl-sdk>
            </div>
        </div>

    );
};

export default HCLSDK;