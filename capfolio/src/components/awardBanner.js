import React from 'react';
import './awardStyles.css';
import { TbAward } from 'react-icons/tb';
import { TbMoodHeart } from 'react-icons/tb';
import { TbHeartHandshake } from 'react-icons/tb';

const AwardBanner = ({ text }) => {
    const getBannerStyle = (awardName) => {
        switch (awardName) {
            case 'Community Impact Award':
                return {
                    color: 'linear-gradient(270deg, #20A786 0%, #1ACB95 24.82%, rgba(133, 245, 94, 0.69) 93.44%, #64EE34 93.44%, #64EE34 93.44%)',
                    icon: TbMoodHeart
                };
            case 'Excellence Award':
                return {
                    color:'linear-gradient(270deg, #EFA30E 0%, #FAB651 39.42%, #EEDA71 93.44%)',
                    icon: TbAward
                };
            case 'Peoples Choice Award':
                return {
                    color: 'linear-gradient(270deg, #197FB8 4.87%, #2BA0E2 44.26%, #5EE3F5 93.44%)',
                    icon: TbHeartHandshake
                };
            default:
                return {
                    color: 'transparent',
                    icon: null
                };
        }
    };

    const { color, icon: Icon } = getBannerStyle(text);

    if (text === null) {
        return null;
    } else {
        return (
            <div className="award-banner" style={{ backgroundImage: color }}>
                {Icon && <Icon style={{ marginRight: '5px', marginLeft: '5px', fontSize: '32px'}} />}
                <span>{text}</span>
            </div>
        );
    }
};

export default AwardBanner;