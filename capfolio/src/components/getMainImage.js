import { CCardImage } from "@coreui/react";
import React, { useEffect, useState } from "react";
import Placeholder from "../images/download.png";

const MainImage = (props) => {
  const [img, setImage] = useState();

  useEffect(() => {
    const getMainImage = async () => {
      const files = await fetch(`/project/listTeamFiles/${props.teamname}`);
      const data = await files.json();

      if (data.length === 0) {
        setImage(Placeholder);
      } else {
        console.log(data)
        const response = await fetch(`/project/retrieveFile/${data[0]}`);
        const mainImage = await response.text();
        console.log(mainImage);
        setImage(mainImage);
      }
    };

    getMainImage();
  }, []);

  return (
    <CCardImage id="imgcard" orientation="top" src={img} />
  );
};

export default MainImage;
