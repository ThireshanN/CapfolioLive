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

      if (data.length === 0) {
        setImage(Placeholder);
      } else {
        const firstElement = data[0];
        const lastSlashIndex = firstElement.lastIndexOf("/");
        const folder = firstElement.substring(0, lastSlashIndex);
        const filename = firstElement.substring(lastSlashIndex);

        const getLowRes = await fetch(
          `/project/retrieveFile/${folder}/lowres${filename}`
        );
        const lowmainImg = await getLowRes.text();
        setLowRes(lowmainImg);

        const response = await fetch(`/project/retrieveFile/${data[0]}`);
        const mainImage = await response.text();
        console.log(mainImage);
        setImage(mainImage);
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
