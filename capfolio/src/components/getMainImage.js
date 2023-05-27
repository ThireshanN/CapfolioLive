import { CCardImage } from "@coreui/react";
import React, { useEffect, useState } from "react";
import Placeholder from "../images/download.png";
import ProgressiveImage from "react-progressive-graceful-image";
import Skeleton from '@mui/material/Skeleton';

const MainImage = (props) => {
  const [img, setImage] = useState();
  const [lowRes, setLowRes] = useState();
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    const getMainImage = async () => {
      const files = await fetch(`/project/listTeamFiles/${props.TeamId}`);
      const data = await files.json();

      const filteredFiles = data.filter((file) => !file.endsWith("/"));
      console.log("The filtered files for ", props.TeamId, " are: ", filteredFiles);
      const url = "https://capfoliostorage.s3.ap-southeast-2.amazonaws.com/";

      if (data.length === 0) {
        setImage(Placeholder);
      } else {
        const firstElement = filteredFiles[0];
        const lastSlashIndex = firstElement.lastIndexOf("/");

        const folder = firstElement.substring(0, lastSlashIndex);
        const filename = firstElement.substring(lastSlashIndex);

        const getLowRes = url + folder + filename;
        setLowRes(getLowRes);

        const getHighRes = url + filteredFiles[0];
        setImage(getHighRes);
      }
      setIsLoading(false); // Data has been fetched and set, stop loading
    };

    getMainImage();
  }, []);

  return (
    isLoading ? (
      <Skeleton variant="rectangular" width="100%" height={190} />
    ) : (
      <ProgressiveImage src={img} placeholder={lowRes}>
        {(src) => <CCardImage id="imgcard" orientation="top" src={src} />}
      </ProgressiveImage>
    )
  );
};

export default MainImage;
