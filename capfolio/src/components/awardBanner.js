import React from 'react';
import './awardStyles.css';

const AwardBanner = ({ text }) => {

    if (text === null) {
        return
    }
    else {
        return (
            <div className="award-banner">
                {text}
            </div>
        );
    }

    
};

export default AwardBanner;