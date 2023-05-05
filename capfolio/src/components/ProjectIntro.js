import React, { useState, useEffect } from 'react';
import { Collapse, CButton, CCollapse, CListGroup, CListGroupItem, CCard, CCardBody, CRow, CCol, CCardImage, CCardTitle, CCardText, CCardFooter } from '@coreui/react';
import '../ProjectGallery.css';

function ProjectIntro({ projectIntro }) {
  const [applyFade, setApplyFade] = useState(false);
  const textRef = React.createRef();

  useEffect(() => {
    const checkTextHeight = () => {
      if (textRef.current) {
        const textHeight = textRef.current.offsetHeight;
        setApplyFade(textHeight > 100);
      }
    };

    checkTextHeight();

    const resizeObserver = new ResizeObserver(() => {
      checkTextHeight();
    });

    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        resizeObserver.unobserve(textRef.current);
      }
    };
  }, []);

  return (
    <div className='text-container'>
      <div className='fade-text custom-list-group-item' ref={textRef}>{projectIntro}</div>
      {applyFade && <div className="fade-effect"></div>}
    </div>
  );
}

export default ProjectIntro;