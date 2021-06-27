import React, { useContext, useEffect, useState, useRef } from 'react';
import { Badge, Form, Col } from 'react-bootstrap';

import HCPContext from '../../store/hcp-context';
import { defaultSDKConfig, getSpecialtyCode } from '../../services/HCLSDKService';

// Styling
import classes from './HCLSDK.module.css';

const HCLSDK = (props) => {

    const hclSdkRef = useRef(null);

    // --- Contexts
    const ctx = useContext(HCPContext);

    // --- states
    const [appliedQuickSearch, setAppliedQuickSearch] = useState(ctx.quickSearch);

    // --- Helpers
    const isQuickSearchApplied = () => {
        return (ctx.quickSearch && (ctx.quickSearch !== 'All'));
    };

    // --- Effects

    useEffect(() => {

        let curSDKConfig = {
            ...defaultSDKConfig
        };

        // Use the 'searchNearMe' screen if the quickSearch is set 
        if (isQuickSearchApplied()) {
            const spCode = getSpecialtyCode(ctx.quickSearch);

            curSDKConfig = {
                ...curSDKConfig,
                entry: {
                    screenName: 'searchNearMe',
                    specialtyCode: spCode
                }
            };

        } else {
            // Use a default search screen by default (Including 'All)
            curSDKConfig = {
                ...curSDKConfig,
                entry: {
                    screenName: 'home'
                }
            };          

        }

        hclSdkRef.current.init(curSDKConfig);
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re initialize the HDLSDK to update view when the quicksearch value is updated
    useEffect(() => {

        // eslint-disable-next-line no-undef
        setAppliedQuickSearch(ctx.quickSearch);

        // Use the 'searchNearMe' screen if the quickSearch is set 
        if (isQuickSearchApplied()) {
            const spCode = getSpecialtyCode(ctx.quickSearch);
            hclSdkRef.current.searchNearMe({specialtyCode: spCode});

        } else {
            hclSdkRef.current.backToHome();

        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx.quickSearch])

    return (
        <div>
            {/* Quick search */}

            {(ctx.quickSearch && (ctx.quickSearch !== 'All')) ?
                (<div>
                    <Form>
                        <Form.Row>
                            <Col xs="auto">
                                <span className={classes['quicksearch-label']}>
                                    Applied Quick Search:&nbsp;
                                </span>
                            </Col>
                            <Col xs="auto">
                                <Badge variant="info">{appliedQuickSearch}</Badge>
                            </Col>
                        </Form.Row>
                    </Form>
                </div>)
                : null
            }

            {/* SDK */}

            <div className={`sdk-parent-element ${classes['sdk-main-container']}`}>
                <hcl-sdk ref={hclSdkRef} />
            </div>
        </div>

    );
};

export default HCLSDK;