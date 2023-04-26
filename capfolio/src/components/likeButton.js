import React, { useState, useEffect } from "react";
import cn from "classnames";
import { ReactComponent as Hand } from "../images/hand.svg";

import "./likeStyles.css";

const particleList = Array.from(Array(10));

const LikeButton2 = (props) => {

    console.log(props)
    const [liked, setLiked] = useState(null);
    const [clicked, setClicked] = useState(null);
    const [likes, setLikes] = useState('');


    const getLikes = async () => {
        const response = await fetch(
            "/projects/like?id=" + props.likenumber
        ).then((response) => response.json());

        setLikes(response)
        console.log(response)


    };


    const initialLikes = async () => {
        const response = await fetch('/projects/ProjectsLiked?id=' + props.likenumber).then((response) => response.json());

        console.log(response)
        if (response[response.length - 1].hasLiked == '0') {
            console.log(response[response.length - 1].hasLiked)
            setLiked(false)
            setClicked(false)
           

        }

        if (response[response.length - 1].hasLiked == '1') {
            console.log(response[response.length - 1].hasLiked)
            setLiked(true)
            setClicked(true)        }

    }



    const checkLikes = async () => {
        const response = await fetch('/projects/ProjectsLiked?id=' + props.likenumber).then((response) => response.json());

        console.log(response)
        if (response[response.length - 1].hasLiked == '0') { 
            console.log(response[response.length - 1].hasLiked)
          
            newlike()
            setLiked(true)
            setClicked(true)

        }

        if (response[response.length - 1].hasLiked == '1') {
            console.log(response[response.length - 1].hasLiked)
         
            removeLike()
            setLiked(false)
            setClicked(false)
        }

    }

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
        getLikes();
        
    };


    const removeLike = async () => {
        await fetch(
            "projects/postDisLike", {
                method: 'DELETE',
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({
                    'projectId': props.likenumber
                })
        })
        console.log('projectdisliked')
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
                checkLikes()
           
                
                
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