import React, { useContext, useEffect, useState } from 'react';
import { Badge, Form, Col } from 'react-bootstrap';

import HCPContext from '../../store/hcp-context';
import { defaultSDKConfig, getSpecialtyCode } from '../../services/HCLSDKService';

// Styling
import classes from './HCLSDK.module.css';

const HCLSDK = (props) => {

    // --- Contexts
    const ctx = useContext(HCPContext);

    // --- states
    const [appliedQuickSearch, setAppliedQuickSearch] = useState(ctx.quickSearch);

    // --- Effects
    // Re initialize the HDLSDK to update view when the quicksearch value is updated
    useEffect(() => {

        // eslint-disable-next-line no-undef
        setAppliedQuickSearch(ctx.quickSearch);

        const HCLSDK = document.querySelector('hcl-sdk');

        let curSDKConfig = {
            ...defaultSDKConfig
        };

        // Use the 'searchNearMe' screen if the quickSearch is set 
        if (ctx.quickSearch && (ctx.quickSearch !== 'All')) {
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
            // Note that this setting currently does not re-render the SDK to the
            // Homescreen if the 'searchNearMe' screen is active
            // https://healthcareappchallenge.devpost.com/forum_topics/35113-some-tips-for-frontend-developer-to-use-the-sdk
            curSDKConfig = {
                ...curSDKConfig,
                entry: {
                    screenName: 'home',
                }
            };

        }

        HCLSDK.init(curSDKConfig);

    }, [ctx.quickSearch])

    // customElements.whenDefined('hcl-sdk').then(function () {
    //         debugger
    // });    

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
                <hcl-sdk></hcl-sdk>
            </div>
        </div>

    );
};

export default HCLSDK;