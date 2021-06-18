import React, { useEffect } from 'react';

const HCLSDK = (props) => {
    
    useEffect(() => {
        const HCLSDK = document.querySelector('hcl-sdk');
        HCLSDK.init({
            apiKey: '30008a88a12364f2',
            appName: 'https://github.com/nongnoochr',
            appURL: 'https://github.com/nongnoochr'
        });

        customElements.whenDefined('hcl-sdk').then(function () {
            // debugger

        });
    }, []);

    return (
        <div className="sdk-parent-element" style={{ height: "75vh" }}>
            
            {
                (props.quicksearch && props.quicksearch !== 'All') ? 
                    (<div>Currently Applied Quick search: { props.quicksearch }</div>) : null
            }

            <hcl-sdk></hcl-sdk>
            
        </div>
    );
};

export default HCLSDK;