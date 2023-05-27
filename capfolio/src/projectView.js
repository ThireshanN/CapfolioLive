import { Collapse, CButton } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "react-slideshow-image/dist/styles.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import ProjectTabs from "./components/ProjectTabs";
import LikeButton from "./components/likeButton";
import gitHubLogo from "./images/github-mark-white.png";
import { ReactComponent as Heart } from "./images/heart.svg";
import { ReactComponent as Views } from "./images/views.svg";
import "./projectView.css";

const ProjectView = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [responses, setResponses] = useState([]);
  const params = useParams();
  const [comments, setComments] = useState("");
  const [projects, setProject] = useState("");
  const [tech, setTech] = useState("");
  const [user, setUser] = useState("");
  const [img, setImage] = useState([]);
  const [lowRes, setLowRes] = useState();
  const [students, setStudents] = useState([]);

  // const blueBoxRef = useRef();

  const getProject = async () => {
    const response = await fetch("/projects/project?id=" + params.id).then(
      (response) => response.json()
    );

    const files = await fetch(`/project/listTeamFiles/${response[0].TeamId}`);
    const data = await files.json();
    setProject(response);

    let string = response[0].technologies.split(",");
    setTech(string);

    // Assuming you have the data stored in a variable called 'responseData'
    

    // Get all the images for the slideshow//
    const filteredFiles = data.filter((file) => !file.endsWith("/"));
    console.log(filteredFiles);
    const url = "https://capfoliostorage.s3.ap-southeast-2.amazonaws.com/";

    const firstElement = filteredFiles[0];
    const lastSlashIndex = firstElement.lastIndexOf("/");

    const folder = firstElement.substring(0, lastSlashIndex);
    const filename = firstElement.substring(lastSlashIndex);

    const reposnceArray = [];
    for (let i = 0; i < filteredFiles.length; i++) {
      let getHighRes = "";
      getHighRes = url + filteredFiles[i];
      reposnceArray.push(getHighRes);
    }
    console.log(reposnceArray)

    const processedUsers = response.map((item) => ({
      name: item.studentNames.split(","),
      upi: item.studentUPIs.split(","),
    }));
    setStudents(processedUsers);
    setImage(reposnceArray);
    //=====================================//
  };

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

  //-----------------------------------------------------------------//

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
        {img.map((response, index) => (
          <div className="each-slide-effect" key={index}>
            <div
              style={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
              }}
            >
              <img src={response} alt={`Slide ${index + 1}`} />
            </div>
          </div>
        ))}
      </Slider>
    );
  };

  const Header = ({ project }) => {
    return (
      <div className="titlePanel">
        <div className="centerTitle">
          <p className="semesterTag">
            {project.capstoneYear} Semester {project.capstoneSemester}
          </p>
          <p className="projecttitle">{project.ProjectName}</p>
          <div className="names">
            <p className="companyname">By {project.TeamName}</p>

            {/*{project.authors.map((name, i) =>*/}
            {/*    <div classname='name'>*/}
            {/*        <p key={`key${i}`}>{name},&nbsp;</p>*/}
            {/*    </div>*/}
            {/*)}*/}

            {students.map((user, index) => (
              //user.upi
              <div className="name" key={index}>
                <p>{user.name.join(", ")}</p>
              </div>
            ))}
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
            <div className="project-stats">
              <p>
                {" "}
                <Heart /> {params.id}{" "}
              </p>
              <p>
                {" "}
                <Views /> {project.viewCount}{" "}
              </p>
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
          <div className="project-stats">
            <p>
              {" "}
              <Heart /> {params.id}{" "}
            </p>
            <p>
              {" "}
              <Views /> {project.viewCount}{" "}
            </p>
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
        <div style={{ display: "flex" }}>
          <div className="projectTabs" style={{ width: "75%" }}>
            <ProjectTabs
              projects={projects}
              comments={comments}
              user={user}
              getComments={getComments}
            />
          </div>
          <div className="sidepanel-div" style={{ width: "25%" }}>
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
