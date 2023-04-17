import React, { useState, useContext} from 'react';


const LikeButton = () => {
  const [likes, setLikes] = useState(99);
  const [isClicked, setIsClicked] = useState(false);
  const [liked, setLiked] = useState(null);

  const handleClick = () => {
    if (isClicked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsClicked(!isClicked);
  };

  return (
    <button className={ `like-button ${isClicked && 'liked'}` } onClick={ handleClick }>
      <span className="likes-counter">{ `Like | ${likes}` }</span>
    </button>
  );
};

export default LikeButton;