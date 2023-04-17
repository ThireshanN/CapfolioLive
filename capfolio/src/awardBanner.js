import React from 'react';
import './awardStyles.css';

const AwardBanner = ({ text }) => {
  return (
  <div className="award-banner">
    {text}
    </div>
  );
};

export default AwardBanner;