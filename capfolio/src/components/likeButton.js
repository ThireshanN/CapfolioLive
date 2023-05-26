import React, { useState, useEffect } from "react";
import cn from "classnames";
import { ReactComponent as Hand } from "../images/hand.svg";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./likeStyles.css";

const particleList = Array.from(Array(10));

const LikeButton2 = (props) => {
  const navigate = useNavigate();

  const [liked, setLiked] = useState(null);
  const [clicked, setClicked] = useState(null);
  const [likes, setLikes] = useState("");

  const getLikes = async () => {
    const response = await fetch("/projects/like?id=" + props.likenumber).then(
      (response) => response.json()
    );
    setLikes(response);
  };

  const initialLikes = async () => {
    const response = await fetch(
      "/projects/ProjectsLiked?id=" + props.likenumber
    ).then((response) => response.json());
    if (response[response.length - 1].hasLiked == "0") {
      setLiked(false);
      setClicked(false);
    }

    if (response[response.length - 1].hasLiked == "1") {
      setLiked(true);
      setClicked(true);
    }
  };

  const checkLikes = async () => {
    fetch("/projects/ProjectsLiked?id=" + props.likenumber)
      .then((response) => {
        if (response.status === 404) {
          return response.text().then((errorBody) => {
            console.log(errorBody);
          });
        } else {
          return response.json().then((responseData) => {
            if (
              responseData.length > 0 &&
              responseData[responseData.length - 1].hasLiked == "0"
            ) {
              fetch("/projects/postLike", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  projectId: props.likenumber,
                }),
              }).then((response) => {
                return response.text().then((responseBody) => {
                  if (responseBody == '"Only logged in users can like"') {
                    navigate("/login");
                  } else {
                    setLiked(true);
                    setClicked(true);
                    getLikes();

                  }
                });
              });
            } else if (
              responseData.length > 0 &&
              responseData[responseData.length - 1].hasLiked == "1"
            ) {
              removeLike();
              setLiked(false);
              setClicked(false);
            }
          });
        }
      })

      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const removeLike = async () => {
    await fetch("/projects/postDisLike", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: props.likenumber,
      }),
    });
    getLikes();
  };

  useEffect(() => {
    getLikes();
  }, []);

  useEffect(() => {
    initialLikes();
  }, []);

  return (
    <button
      onClick={() => {
        checkLikes();
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
        <span className={cn("suffix", { liked })}>d &nbsp;</span>
        <span id="projectlike" className="likes-counter">
          {" "}
          {/* | {likes && likes.map((like) => like.No_of_likes)} */}
        </span>
      </div>
    </button>
  );
};

export default LikeButton2;
