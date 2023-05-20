import { CCardImage } from "@coreui/react";
import React, { useEffect, useState } from "react";
import Placeholder from "../images/download.png";
import ProgressiveImage from "react-progressive-graceful-image";

const MainImage = (props) => {
  const [img, setImage] = useState();
  const [lowRes, setLowRes] = useState();

  useEffect(() => {
    const getMainImage = async () => {
      const files = await fetch(`/project/listTeamFiles/${props.TeamId}`);
      const data = await files.json();

      const filteredFiles = data.filter((file) => !file.endsWith("/"));
      console.log(filteredFiles);
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
    };

    getMainImage();
  }, []);

  return (
    <ProgressiveImage src={img} placeholder={lowRes}>
      {(src) => <CCardImage id="imgcard" orientation="top" src={src} />}
    </ProgressiveImage>
  );
};

export default MainImage;
