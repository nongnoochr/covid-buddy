import React, { useEffect } from 'react';

const HCLSDK = (props) => {
    
    useEffect(() => {
        // debugger
        // const HCLSDK = document.querySelector('hcl-sdk');
        // HCLSDK.init({
        //     apiKey: '30008a88a12364f2',
        //     appName: 'https://github.com/nongnoochr',
        //     appURL: 'https://github.com/nongnoochr'
        // });

        // debugger
        // customElements.whenDefined('hcl-sdk').then(function () {
        //     debugger

        // });
    }, []);

    return (
        <div className="sdk-parent-element" style={{ height: "75vh" }}>
            <hcl-sdk></hcl-sdk>

            MAP!
            
            {
                props.quicksearch !== 'All' ? 
                    (<div>Current Quick search: { props.quicksearch }</div>) : null
            }
            
        </div>
    );
};

export default HCLSDK;