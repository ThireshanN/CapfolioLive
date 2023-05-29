import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import ResizeDetector from 'react-resize-detector';
import "../projectView.css";
import Skeleton from '@mui/material/Skeleton';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ProjectPoster({pdf, onDocumentLoad, loadState }) { //Passing id as props
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(null);


  const onDocumentLoadSuccess = () => {
    console.log("Document loaded successfully, setting isLoading to false");
    onDocumentLoad(false);
    console.log({loadState});
  }
  console.log({pdf})

  const onDocumentLoadError = (error) => {
    console.log('Error while loading document!', error);
    onDocumentLoad(false);
  }

  
  const onTextLoadSuccess = () => {
    console.log("Text loaded successfully");
  }

  const onResize = (width) => {
    setContainerWidth(width);
  };

  const openInNewTab = () => {
    window.open(pdf);
  };


  return (
    <div onClick={openInNewTab} style={{cursor: 'pointer'}}>
      <ResizeDetector handleWidth onResize={onResize}>
        <Document
          file={pdf}
        //   loading={<Skeleton variant="rectangular" width="100%" height={490} />}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          renderTextLayer={false}
          onRenderTextLayerSuccess={onTextLoadSuccess}
        >
          <Page pageNumber={pageNumber} width={containerWidth} />
        </Document>
      </ResizeDetector>
    </div>
  );
}

export default ProjectPoster;