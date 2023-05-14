import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { CButton } from "@coreui/react";
import { MDBTextArea } from "mdb-react-ui-kit";
import avatar from "../images/avatar.png";
import { useParams, useNavigate } from "react-router-dom";

function ProjectTabs({ projects, comments, user, getComments }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const params = useParams();

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
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
        }).then((response) => {
          return response.text().then((responseBody) => {
            if (responseBody == '"Only logged in Users can comment"') {
              navigate("/login");
            } else {
              getComments()
            }
          });
        });
        document.getElementById("comment").value = "";
      };

  const PopUp = ({ onYesClick, onNoClick }) => {
    return (
      <div class="popup">
        <h2>Confirmation</h2>
        <p>Are you sure you want to proceed?</p>
        <div class="popup-buttons">
          <button className="btn-yes" onClick={onYesClick}>
            Yes
          </button>
          <button className="btn-no" onClick={onNoClick}>
            No
          </button>
        </div>
      </div>
    );
  };


  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="About Project" />
        <Tab label="Project Poster" />
        <Tab label="Comments" />
      </Tabs>
      {selectedTab === 0 && (
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
            height="400"
            allowFullScreen
            src={
              projects && projects.map((project) => project.VideoLink)
            }
            title="Project Video"
          ></iframe>
        </div>
      )}
            {selectedTab === 1 && (
        <div className="projectInformation">
          <h2>
            This project poster will be displayed here.
            <br></br>
          </h2>

        </div>
      )}
      {selectedTab === 2 && (
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
      )}
    </Box>
  );
}

  export default ProjectTabs;