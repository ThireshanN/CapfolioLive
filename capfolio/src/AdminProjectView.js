import { Collapse, CButton } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "react-slideshow-image/dist/styles.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import LikeButton from "./components/likeButton";
import gitHubLogo from "./images/github-mark-white.png";
import { ReactComponent as Heart } from "./images/heart.svg";
import { ReactComponent as Views } from "./images/views.svg";
import "./projectView.css";
import YouTubeIcon from '@mui/icons-material/YouTube';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import AWS from "aws-sdk";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

const bucketName = "capfoliostorage";
const bucketRegion = "ap-southeast-2";
const accessKeyId = "YOUR_ACCESS_KEY_ID";
const secretAccessKey = "YOUR_SECRET_ACCESS_KEY";

const s3 = new AWS.S3({
  region: bucketRegion,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

const AdminProjectView = () => {
  const [data, setData] = useState([]);
  const [responses, setResponses] = useState([]);
  const params = useParams(); 
  const [projects, setProject] = useState("");
  const [tech, setTech] = useState("");
  const [capstoneYear, setCapstoneYear] = useState('');
  const [capstoneSemester, setCapstoneSemester] = useState('');
  const [ProjectName, setProjectName] = useState(''); 
  const [TeamName, setTeamName] = useState('');
  const [githubLink, setgithubLink] = useState('');
  const [VideoLink, setVideoLink] = useState('');
  const [projectIntro, setProjectIntro] = useState('');
  const [projectApproach, setProjectApproach] = useState('');
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [selectedAwards, setSelectedAwards] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [projectId, setProjectId] = useState();
  const [isEditing, setIsEditing] = useState(false);
  
  const [pdf, setPDF] = useState()
  const [img, setImage] = useState([]);
  const [students, setStudents] = useState([]);

  const getProject = async () => {
    
    const response = await fetch("/projects/project?id=" + params.id).then(
      (response) => response.json()
    );

    const files = await fetch(`/project/listTeamFiles/${response[0].TeamId}`);
    const data = await files.json();
    setProject(response);

    let string = response[0].technologies.split(",");
    setTech(string);
    

    // Get all the images for the slideshow//
    const filteredFiles = data.filter((file) => !(file.endsWith("/") || file.includes('lowres') || file.includes('/projectPoster/')));
    const extractPDF = data.filter((file) => file.includes('/projectPoster/'));
    console.log(extractPDF)
    console.log(filteredFiles);
    const url = "https://capfoliostorage.s3.ap-southeast-2.amazonaws.com/";
    const getPDF = url + extractPDF
    console.log(getPDF)
    setPDF(getPDF)

    const reposnceArray = [];
    for (let i = 0; i < filteredFiles.length; i++) {
      let getHighRes = "";
      getHighRes = url + filteredFiles[i];
      reposnceArray.push(getHighRes);
    }
    console.log(reposnceArray)
    setImage(reposnceArray);

    const processedUsers = response.map((item) => ({
      name: item.studentNames.split(","),
      upi: item.studentUPIs.split(","),
    }));
    setStudents(processedUsers);
    //=====================================//
  };



  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    // Save the edited project information
    console.log({
      ProjectName: ProjectName,
      TeamName: TeamName,
      capstoneYear: capstoneYear,
      capstoneSemester: capstoneSemester,
      projectIntro: projectIntro,
      projectApproach: projectApproach,
      selectedTechnologies,
      selectedAwards,
    });

    const techoo = selectedTechnologies;
    techoo.forEach((e) => arrayTech.push(e.label));
    const arrayTech = [];
    for (let i = 0; i < arrayTech.length; i++) {
      arrayTech[i] = arrayTech[i].replace(/'/g, '"');
    }


    // STILL HAVE TO DO THE ARRAY THING LIKE YOU DID IN TECHOO FOR AWARDS

    //UPDATING THE DATABASE

    fetch("/admin/updateProject", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: projectId,
        Name: ProjectName,
        Description: projectIntro,
        Year: capstoneYear,
        Semester: capstoneSemester,
        github: githubLink,
        TeamName: TeamName,
        video: VideoLink,
        Intro: projectIntro,
        approach: projectApproach
      }),
    });


    // Perform the necessary saving logic here

    // Reset the editing state
    setIsEditing(false);
  };

  const handleApproveProject = (e) => {
    e.preventDefault();
    fetch("/admin/approveProject", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: projectId
      }),
    });
  }
  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  }

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

  useEffect(() => {
    getProject();
  }, []);

  useEffect(() => {
    setProjectName(projects && projects.map((project) => project.ProjectName).join(' '));
    setTeamName(projects && projects.map((project) => project.TeamName).join(' '));
    setCapstoneYear(projects && projects.map((project) => project.capstoneYear).join(' '));
    setCapstoneSemester(projects && projects.map((project) => project.capstoneSemester).join(' '));
    setVideoLink(projects && projects.map((project) => project.VideoLink).join(' '));
    setgithubLink(projects && projects.map((project) => project.githubLink).join(' '));
    setProjectIntro(projects && projects.map((project) => project.ProjectIntro).join(' '));
    setProjectApproach(projects && projects.map((project) => project.Project_Approach).join(' '));
    setProjectId(projects && projects.map((project) => project.ProjectID).join(' '));
  }, [projects]);

  useEffect(() => {
    fetch("/project/technologyNames")
      .then((response) => response.json())
      .then((data) => setTechnologies(data))
      .catch((error) => console.error(error));
  }, []);

  const techOptions = technologies.map((techy) => ({
    value: techy,
    label: techy,
  }));

  const handleChangeTechnologies = (selectedTechnologies) => {
    setSelectedTechnologies(selectedTechnologies);
  };

  const handleChangeAwards = (selectedAwards) => {
    setSelectedAwards(selectedAwards);
  };

  const awarded = [
    { value: "None", label: "None" },
    { value: "Excellence Award", label: "Excellence Award" },
    { value: "Community Award", label: "Community Award" },
    { value: "People's Choice Award", label: "People's Choice Award" },
  ];

  const buttonStyle = {
    width: "30px",
    background: "none",
    border: "0px",
    class: "arrows",
  };
  const [selectedTab, setSelectedTab] = useState(0);
  
    const handleChange = (event, newValue) => {
      setSelectedTab(newValue);
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

  const ApproveOrDelete = ({}) =>{
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px", // Adjust the margin value as needed
          }}> 
            <Stack direction="row" spacing={2}>
                <Button variant="outlined" startIcon={<DeleteIcon />}  color="error">
                    Delete
                </Button>
                <Button variant="contained" endIcon={<SendIcon />} color="success">
                    Approve
                </Button>
            </Stack>
        </div>
      );
  }
  // This is passed all the components 
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
                  <div className="titlePanel">
                    <div className="centerTitle">
                      <p className="semesterTag">
                        {isEditing ? (
                          <>
                            <input
                              type="text"
                              value={capstoneYear}
                              onChange={(e) => setCapstoneYear(e.target.value)}
                            />
                            Semester{" "}
                            <input
                              type="text"
                              value={capstoneSemester}
                              onChange={(e) => setCapstoneSemester(e.target.value)}
                            />
                          </>
                        ) : (
                          `${capstoneYear} Semester ${capstoneSemester}`
                        )}
                      </p>
                      <p className="projecttitle">
                        {isEditing ? (
                          <input
                            type="text"
                            value={ProjectName}
                            onChange={handleProjectNameChange}
                          />
                        ) : (
                          ProjectName
                        )}
                      </p>
                      <div className="names">
                        <p className="companyname">
                          By{" "}
                          {isEditing ? (
                            <input
                              type="text"
                              value={TeamName}
                              onChange={(e) => setTeamName(e.target.value)}
                            />
                          ) : (
                            TeamName
                          )}
                        </p>
                      </div>
                      <p className="proj-desc">{project.ProjectIntro}</p>
                      <div className="pv-buttons">
                        {isEditing ? (
                          <input
                            type="text"
                            value={githubLink}
                            onChange={(e) => setgithubLink(e.target.value)}
                          />
                        ) : (
                          <CButton>
                            <a href={githubLink} target="_blank" rel="noreferrer">
                              <img src={gitHubLogo} alt="GitHub Logo" /> GitHub
                            </a>
                          </CButton>
                        )}
                        {isEditing ? (
                          <input
                            type="text"
                            value={VideoLink}
                            onChange={(e) => setVideoLink(e.target.value)}
                          />
                        ) : (
                          <CButton>
                            <a href={VideoLink} target="_blank" rel="noreferrer">
                              <YouTubeIcon /> YouTube
                            </a>
                          </CButton>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              <div className="pv-buttons">
              {isEditing ? (
                <button onClick={handleSave} className="btn btn-primary">
                  Save
                </button>
              ) : (
                <button onClick={handleEdit} className="btn btn-primary">
                  Edit
                </button>
              )}
            </div>
            </div>
          </div>
        </div>
      </div>
      <div className="projectInformation-wrapper">
        <div style={{ display: "flex" }}>
          <div className="projectTabs" style={{ width: "75%" }}>
            <Box sx={{ width: "100%" }}>
              <Tabs
                value={selectedTab}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="About Project" />
                <Tab label="Project Poster" />
              </Tabs>
              {selectedTab === 0 && (
                <div className="projectInformation">
                  <h2>
                    About{" "}
                    {projects &&
                      projects.map((project) => project.ProjectName)}
                  </h2>
                  {isEditing ? (
                    <textarea
                      value={projectIntro}
                      onChange={(event) => setProjectIntro(event.target.value)}
                    ></textarea>
                  ) : (
                    <p className="about">{projectIntro}</p>
                  )}
                  <h2>Project Approach</h2>
                  {isEditing ? (
                    <textarea
                      value={projectApproach}
                      onChange={(event) => setProjectApproach(event.target.value)}
                    ></textarea>
                  ) : (
                    <p className="about">{projectApproach}</p>
                  )}
                </div>
              )}
              {selectedTab === 1 && (
                <div className="projectInformation">
                  <h2>This project poster will be displayed here.</h2>
                  <br />
                </div>
              )}
            </Box>
          </div>
          {!isEditing && (
            <div className="sidepanel-div" style={{ width: "25%" }}>
              <div className="sidePanel">
                <div className="centerTitle">
                  <div className="names"></div>
                </div>
                <div className="techUsed">
                  <CreatableSelect
                    required
                    className="formLinks"
                    id="tech"
                    isMulti
                    options={techOptions}
                    maxMenuHeight={250}
                    onChange={handleChangeTechnologies}
                    placeholder="Select from the drop down or type the technologies you used in the project"
                  />
                </div>
                <div className="techUsed">
                  <CreatableSelect
                    required
                    className="formLinks"
                    id="awards"
                    isMulti
                    options={awarded}
                    maxMenuHeight={250}
                    onChange={handleChangeAwards}
                    placeholder="Select or type the awards for the project"
                  />
                </div>
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px", // Adjust the margin value as needed
          }}> 
            <Stack direction="row" spacing={2}>
                <Button variant="outlined" startIcon={<DeleteIcon />}  color="error">
                    Delete
                </Button>
                <Button variant="contained" endIcon={<SendIcon />} onClick={handleApproveProject} color="success">
                    Approve
                </Button>
            </Stack>
        </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default AdminProjectView;

///og thats working 