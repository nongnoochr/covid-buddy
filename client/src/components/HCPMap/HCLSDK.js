import React, { useContext, useEffect, useState } from 'react';
import { Badge, Form, Col } from 'react-bootstrap';


import HCPContext from '../../store/hcp-context';
import HCPMapContext from '../../store/hcpmap-context';


const defaultSDKConfig = {
    apiKey: '30008a88a12364f2',
    appName: 'https://github.com/nongnoochr',
    appURL: 'https://github.com/nongnoochr'
};

const HCLSDK = (props) => {

    const ctx = useContext(HCPContext);
    const ctxMap = useContext(HCPMapContext);

    const [appliedQuickSearch, setAppliedQuickSearch] = useState(ctx.quickSearch);


    useEffect(() => {
        debugger

        setAppliedQuickSearch(ctx.quickSearch);
        debugger
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

        setTimeout(() => {
            HCLSDK.init(curSDKConfig);
        }, 100);



        // HCLSDK.init({
        //     apiKey: '30008a88a12364f2',
        //     appName: 'https://github.com/nongnoochr',
        //     appURL: 'https://github.com/nongnoochr'
        //     // entry: {
        //     //     screenName: 'searchNearMe',
        //     //     specialtyCode: 'SP.WUS.DGP' // DENTIST
        //     //     // specialtyCode: 'SP.WUS.GS'
        //     //     // specialtyLabel: 'GENERAL SURGERY'
        //     // }
        // });




    }, [ctx.quickSearch])

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