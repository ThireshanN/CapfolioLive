import { CButton } from "@coreui/react";
import { MDBTextArea } from "mdb-react-ui-kit";
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import LikeButton from "./components/likeButton";
import avatar from "./images/avatar.png";
import gitHubLogo from "./images/github-mark-white.png";
import "./projectView.css";
import animationData from "./images/icons8-trash.json";
import lottie from "lottie-web";

import AWS from "aws-sdk";

const bucketName = "capfoliostorage";
const bucketRegion = "ap-southeast-2";
const accessKeyId = "AKIAUDUQU75VEF3VDCEL";
const secretAccessKey = "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";

const s3 = new AWS.S3({
  region: bucketRegion,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

const ProjectView = () => {
  const [data, setData] = useState([]);
  const [responses, setResponses] = useState([]);
  const params = useParams();
  const [comments, setComments] = useState("");
  const [projects, setProject] = useState("");
  const [tech, setTech] = useState("");
  const [user, setUser] = useState("");
  // const blueBoxRef = useRef();

  const getProject = async () => {
    const response = await fetch("/projects/project?id=" + params.id).then(
      (response) => response.json()
    );

    fetch("/project/listTeamFiles/" + response[0].TeamName)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.error("There was a problem fetching the data:", error);
      });

    let string = response[0].technologies.split(",");
    setProject(response);

    setTech(string);
  };

  useEffect(() => {
    const fetchResponses = async () => {
      const responseArray = [];

      for (const element of data) {
        const response = await fetch(`/project/retrieveFile/${element}`);
        const data = await response.text();
        responseArray.push(data);
      }
      console.log(responseArray);
      setResponses(responseArray);
    };

    fetchResponses();
  }, [data]);

  // Function to collect data
  const getComments = async () => {
    const response = await fetch("/projects/comment?id=" + params.id).then(
      (response) => response.json()
    );

    setComments(response);

    const userID = await fetch("/auth/user").then((userID) => userID.json());

    setUser(userID.UserID);
    console.log(response);
  };

  //Code to handle deleting comments that a user made
  const [showPopUp, setShowPopUp] = useState(false);

  const handleYesClick = async () => {
    // Make your HTTP request here
    // ...
    // Close the pop-up
    //setShowPopUp(false);
  };

  const handleNoClick = () => {
    // Close the pop-up
    setShowPopUp(false);
  };

  //-----------------------------------------------------------------//

  const handleSubmit = (e) => {
    e.preventDefault();
    var CommentDesc = document.getElementById("comment").value;

    fetch("/projects/PostComment?id=" + params.id, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        CommentDesc: CommentDesc,
      }),
    }).then(() => {
      console.log("comment Added");
      getComments();
    });
    document.getElementById("comment").value = "";
  };

  useEffect(() => {
    getComments();
  }, []);

  useEffect(() => {
    getProject();
  }, []);

  const buttonStyle = {
    width: "30px",
    background: "none",
    border: "0px",
    class: "arrows",
  };

  const properties = {
    prevArrow: (
      <button style={{ ...buttonStyle }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="#fff"
        >
          <path d="M242 180.6v-138L0 256l242 213.4V331.2h270V180.6z" />
        </svg>
      </button>
    ),
    nextArrow: (
      <button style={{ ...buttonStyle }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="#fff"
        >
          <path d="M512 256L270 42.6v138.2H0v150.6h270v138z" />
        </svg>
      </button>
    ),
  };

  const Example = () => {
    return (
      <Slide
        indicators={true}
        duration={2000}
        className="slideshow"
        {...properties}
      >
        {responses.map((response) => (
          <div className="each-slide-effect">
            <div style={{ backgroundImage: `url(${response})` }}></div>
          </div>
        ))}
      </Slide>
    );
  };

  const PopUp = ({ onYesClick, onNoClick }) => {
    return (
      <div class="popup">
        <h2>Confirmation</h2>
        <p>Are you sure you want to proceed?</p>
        <div class="popup-buttons">
        <button className="btn-yes" onClick={onYesClick}>Yes</button>
        <button className="btn-no" onClick={onNoClick}>No</button>
        </div>
      </div>
    );
  };

  const Header = ({ project }) => {
    return (
      <div className="centerTitle">
        <p className="projecttitle">{project.ProjectName}</p>

        <div className="names">
          <p className="companyname">By {project.TeamName} -&nbsp;</p>

          {/*{project.authors.map((name, i) =>*/}
          {/*    <div classname='name'>*/}
          {/*        <p key={`key${i}`}>{name},&nbsp;</p>*/}
          {/*    </div>*/}
          {/*)}*/}
        </div>

        <div className="techUsed">
          {tech &&
            tech.map((tech, i) => (
              <div className="tech">
                <p key={`Key${i}`}>{tech}</p>
              </div>
            ))}
        </div>

        <div className="pv-buttons">
          <CButton>
            {" "}
            <a href={project.githubLink} target="_blank">
              {" "}
              <img src={gitHubLogo}></img> GitHub
            </a>
          </CButton>
          <div>
            <div className="pv-likeButton">
              <LikeButton likenumber={params.id} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  //Used to set bluebox height to size according to right column
  // const rightColumnRef = useRef();
  // const blueBoxRef = useRef();

  // useEffect(() => {
  //     const marginTop = parseFloat(window.getComputedStyle(rightColumnRef.current).marginTop);
  //     const rightColumnHeight = rightColumnRef.current.offsetHeight + marginTop + 20;
  //     blueBoxRef.current.style.setProperty('--right-column-height', `${rightColumnHeight}px`);
  // }, []);
  const rightColumnCallbackRef = (node) => {
    if (node) {
      const marginTop = parseFloat(window.getComputedStyle(node).marginTop);
      const rightColumnHeight = node.offsetHeight + marginTop + 20;
      const blueBoxElement = document.querySelector(".bluebox");
      if (blueBoxElement) {
        blueBoxElement.style.setProperty(
          "--right-column-height",
          `${rightColumnHeight}px`
        );
      }
    }
  };

  return (
    <div>
      <div className="bluebox-top"></div>
      <div className="bluebox" style={{ "--right-column-height": "auto" }}>
        <div className="p-row">
          <div className="column headerleft">
            <div className="image">
              <Example />
            </div>
          </div>
          <div className="column headerright" ref={rightColumnCallbackRef}>
            <div className="teammembers">
              {projects &&
                projects.map((project) => (
                  <Header key={project.id} project={project} />
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="projectInformation-wrapper">
        <div className="projectInformation">
          <h2>
            About {projects && projects.map((project) => project.ProjectName)}
          </h2>

          <p className="about">
            {projects && projects.map((project) => project.ProjectIntro)}{" "}
          </p>
          <h2>Project Approach</h2>
          <p className="projectApproach">
            {projects && projects.map((project) => project.Project_Approach)}
          </p>
          <iframe
            width="100%"
            height="400vw"
            allowfullscreen
            src={projects && projects.map((project) => project.VideoLink)}
          ></iframe>
        </div>
      </div>

      {/* <div className="column right">  */}

      <div className="commentbox">
        <div className="comments">
          <div className="commentheading">
            <h2>Comments</h2>
          </div>
          <div className="writecomment">
            <form onSubmit={handleSubmit}>
              <MDBTextArea
                label="Write your comment here"
                id="comment"
                className="textAreaExample"
                rows={4}
                required
                onSubmit={handleSubmit}
              />

              <button className="sendcomment">
                <CButton>Post Comment</CButton>
              </button>
            </form>
          </div>

          <div className="showcomments">
            {comments &&
              comments.map((comment) => {
                if (comment.User === user) {
                  return (
                    <div className="comment">
                      <div className="commentDetails">
                        <img
                          className="comment-avatar"
                          src={avatar}
                          alt="avatar"
                        ></img>
                        <p className="commentname">{comment.FirstName}</p>

                        <p className="commentUsertype">{comment.UserType}</p>
                        <p className="commentdate">{comment.createdTime}</p>
                      </div>
                      <p className="commenttext">{comment.CommentDesc}</p>

                      <div
                        className="deletecommentContainer"
                        onClick={() => setShowPopUp(true)}
                      >
                        <svg
                          id="deleteComment"
                          class="icon-trash"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 28 40"
                          width="40"
                          height="40"
                        >
                          <path
                            class="trash-lid"
                            fill-rule="evenodd"
                            d="M6 15l4 0 0-3 8 0 0 3 4 0 0 2 -16 0zM12 14l4 0 0 1 -4 0z"
                          />
                          <path
                            class="trash-can"
                            d="M8 17h2v9h8v-9h2v9a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z"
                          />
                        </svg>
                      </div>

                      {showPopUp && (
                        <div className="overlay">
                          <PopUp
                            onYesClick={handleYesClick}
                            onNoClick={handleNoClick}
                          />
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div className="comment">
                      <div className="commentDetails">
                        <img
                          className="comment-avatar"
                          src={avatar}
                          alt="avatar"
                        ></img>
                        <p className="commentname">{comment.FirstName}</p>

                        <p className="commentUsertype">{comment.UserType}</p>
                        <p className="commentdate">{comment.createdTime}</p>
                      </div>
                      <p className="commenttext">{comment.CommentDesc}</p>
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </div>
    </div>
    //     </div>
    // </div>
  );
};

export default ProjectView;
