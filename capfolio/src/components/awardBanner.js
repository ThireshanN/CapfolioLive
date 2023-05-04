import React from 'react';
import './awardStyles.css';
// import CommunityIcon from '../images/community.svg';
// import ExcellenceIcon from '../images/excellence.svg';
// import PeoplesChoiceIcon from '../images/peopleschoice.svg';

const AwardBanner = ({ text }) => {
    const getBannerStyle = (awardName) => {
        switch (awardName) {
            case 'Community Impact Award':
                return {
                    color: 'linear-gradient(270deg, #20A786 0%, #1ACB95 24.82%, rgba(133, 245, 94, 0.69) 93.44%, #64EE34 93.44%, #64EE34 93.44%)',
                    // icon: CommunityIcon
                };
            case 'Excellence Award':
                return {
                    color:'linear-gradient(270deg, #EFA30E 0%, #FAB651 39.42%, #EEDA71 93.44%)',
                    // icon: ExcellenceIcon
                };
            case 'Peoples Choice Award':
                return {
                    color: 'linear-gradient(270deg, #197FB8 4.87%, #2BA0E2 44.26%, #5EE3F5 93.44%)',
                    // icon: PeoplesChoiceIcon
                };
            default:
                return {
                    color: 'transparent',
                    icon: null
                };
        }
    };

    const { color, icon } = getBannerStyle(text);

    if (text === null) {
        return null;
    } else {
        return (
            <div className="award-banner" style={{ backgroundImage: color }}>
                <img src={icon} alt="" style={{ marginRight: '4px' }} />
                <span>{text}</span>
            </div>
        );
    }
};

export default AwardBanner;