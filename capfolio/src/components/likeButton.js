import React, { useState } from "react";
import cn from "classnames";
import { ReactComponent as Hand } from "../images/hand.svg";

import "./likeStyles.css";

const particleList = Array.from(Array(10));

const LikeButton2 = () => {
  const [liked, setLiked] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [likes, setLikes] = useState(99);

  const handleClick = () => {
    if (clicked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setClicked(!clicked);
  };

  return (
    <button
      onClick={() => {
        setLiked(!liked);
        setClicked(true);
        handleClick();
      }}
      onAnimationEnd={() => setClicked(false)}
      className={cn("like-button-wrapper", {
        liked,
        clicked,
      })}
    >
      {liked && (
        <div className="particles">
          {particleList.map((_, index) => (
            <div
              className="particle-rotate"
              style={{
                transform: `rotate(${
                  (360 / particleList.length) * index + 1
                }deg)`,
              }}
            >
              <div className="particle-tick" />
            </div>
          ))}
        </div>
      )}
      <div className="like-button">
        <Hand />
        <span>Like</span>
        <span className={cn("suffix", { liked })}>d </span>
        <span className="likes-counter">{ `  | ${likes}` }</span>
      </div>
    </button>
  );
};

export default LikeButton2;