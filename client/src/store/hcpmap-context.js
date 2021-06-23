// Context specific for the HCLSDK
import React from 'react';

const HCPMapContext = React.createContext({
    quicksearch: [
        // {
        //     specialtyCode: '',
        //     specialtyLabel: 'All'
        // },
        {
            specialtyCode: 'SP.WUS.PD',
            specialtyLabel: 'PEDIATRICS'
        },
        {
            specialtyCode: 'SP.WUS.OBS',
            specialtyLabel: 'OBSTETRICS'
        },
        {
            specialtyCode: 'SP.WUS.P',
            specialtyLabel: 'PSYCHIATRY'
        }
    ]
});

export default HCPMapContext;