import { CButton } from "@coreui/react";
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import LikeButton from "./components/likeButton";
import gitHubLogo from "./images/github-mark-white.png";
import "./projectView.css";
import animationData from "./images/icons8-trash.json";
import lottie from "lottie-web";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ProjectTabs from './components/ProjectTabs';
import { ReactComponent as Heart } from "./images/heart.svg";
import { ReactComponent as Views } from "./images/views.svg";

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
  const navigate = useNavigate();

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
    await fetch('/projects/deletecomment').then(() => {
      setShowPopUp(false);
    }) 
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

  const Slideshow = () => {
    
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
      };
      return (
        <Slider className="slideshow" {...settings}>
          {responses.map((response, index) => (
            <div className="each-slide-effect" key={index}>
              <div
                style={{
                  backgroundImage: `url(${response})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '100%',
                }}
              ></div>
            </div>
          ))}
        </Slider>
    );
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


  const Header = ({ project }) => {
    return (
    <div className="titlePanel">
      <div className="centerTitle">
        <p className='semesterTag'>{project.capstoneYear} Semester {project.capstoneSemester}</p>
        <p className="projecttitle">{project.ProjectName}</p>
        <div className="names">
          <p className="companyname">By {project.TeamName}</p>

          {/*{project.authors.map((name, i) =>*/}
          {/*    <div classname='name'>*/}
          {/*        <p key={`key${i}`}>{name},&nbsp;</p>*/}
          {/*    </div>*/}
          {/*)}*/}
        </div>
        <p className="proj-desc">{project.ProjectIntro}</p>
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
        <div className="sidePanel-mobile">
              <div className="centerTitle">
                <div className='project-stats'>
                  <p> <Heart/> {params.id} </p> 
                  <p> <Views/> {project.viewCount} </p> 
                </div>
                <div className="names">

                  {/*{project.authors.map((name, i) =>*/}
                  {/*    <div classname='name'>*/}
                  {/*        <p key={`key${i}`}>{name},&nbsp;</p>*/}
                  {/*    </div>*/}
                  {/*)}*/}
                </div>
              </div>
              <div className="techUsed">
                {tech &&
                  tech.map((tech, i) => (
                    <div className="tech">
                      <p key={`Key${i}`}>{tech}</p>
                    </div>
                  ))}
              </div>
            </div>
      </div>
    );
  };

  const ProjectSidePanel = ({ project }) => {
    return (
    <div className="sidePanel">
      <div className="centerTitle">
        <div className='project-stats'>
          <p> <Heart/> {params.id} </p> 
          <p> <Views/> {project.viewCount} </p> 
        </div>
        <div className="names">

          {/*{project.authors.map((name, i) =>*/}
          {/*    <div classname='name'>*/}
          {/*        <p key={`key${i}`}>{name},&nbsp;</p>*/}
          {/*    </div>*/}
          {/*)}*/}
        </div>
        

    </div>
        <div className="techUsed">
          {tech &&
            tech.map((tech, i) => (
              <div className="tech">
                <p key={`Key${i}`}>{tech}</p>
              </div>
            ))}
        </div>

      </div>
    );
  };


  return (
    <div>
      <div className="bluebox">
        <div className="p-row">
          <div className="column headerleft">
            <div className="image">
              <Slideshow />
            </div>
          </div>
          <div className="column headerright">
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
      <div style={{ display: 'flex'}}>
        <div style={{ width: '75%' }}>
          <ProjectTabs projects={projects} comments={comments} user={user} getComments={getComments} />
        </div>
        <div className="sidepanel-div" style={{ width: '25%', }}>
          {projects &&
                  projects.map((project) => (
                    <ProjectSidePanel key={project.id} project={project} />
                  ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;
