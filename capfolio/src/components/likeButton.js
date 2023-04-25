import React, { useState, useEffect } from "react";
import cn from "classnames";
import { ReactComponent as Hand } from "../images/hand.svg";

import "./likeStyles.css";

const particleList = Array.from(Array(10));

const LikeButton2 = (props) => {

    console.log(props)
    const [liked, setLiked] = useState(null);
    const [clicked, setClicked] = useState(false);
    const [likes, setLikes] = useState('');


    const getLikes = async () => {
        const response = await fetch(
            "/projects/like?id=" + props.likenumber
        ).then((response) => response.json());

        setLikes(response)
        console.log(response)


    };

    const newlike = async () => {
        await fetch(
            "/projects/postLike",{
            method: 'POST',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                'projectId': props.likenumber
            })
        })
        console.log('projectLiked')
        getLikes()
    };


    const removeLike = async () => {
        await fetch(
            "/projects/postDisLike?id=" + props.likenumber, {
                method: 'DELETE',
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({
                    'projectId': props.likenumber
                })
        })
        console.log('projectdisliked')
        getLikes()
    };


    useEffect(() => {
        getLikes();
    }, []);




    const handleClick = () => {
        if (clicked) {


            removeLike()
            setClicked(!clicked);



        }
        else {

            newlike()
            setClicked(!clicked);



        }

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
                                transform: `rotate(${(360 / particleList.length) * index + 1
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
                <span id='projectlike' className="likes-counter">   |{likes && likes.map((like) => like.No_of_likes)}</span>
            </div>
        </button>
    );
};

export default LikeButton2;