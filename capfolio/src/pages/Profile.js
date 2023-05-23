import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
} from "mdb-react-ui-kit";
import React from "react";
import ProjectIntro from "../components/ProjectIntro";
import { ReactComponent as Heart } from "../images/heart.svg";
import { ReactComponent as Views } from "../images/views.svg";
import AwardBanner from "../components/awardBanner.js";

import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardText,
  CCardTitle,
  CCol,
  CListGroup,
  CRow,
} from "@coreui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainImage from "../components/getMainImage";
import "./Profile.css";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("Software Engineer");
  const [github, setGithub] = useState("https://github.com");
  const [linkedin, setLinkedin] = useState("https://linkedin.com");
  const [description, setDescription] = useState(
    "I am a CompSci student at the University of Auckland and I have taken COMPSCI399 in 2023 Semester 1."
  );
  const [picture, setPicture] = useState("");
  const [projects, setProjects] = useState([]);
  const [userProject, setUserProject] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      let userData;
      try {
        const response = await fetch("http://localhost:3000/auth/user");
        if (!response.ok) {
          throw new Error("User not authenticated");
        }
        userData = await response.json();
        setName(`${userData.FirstName} ${userData.LastName}`);
        setPicture(userData.Photo);
        console.log(userData.UserID);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }

      try {
        const projectResponse = await fetch(
          "http://localhost:3000/profile/likedProjects?id=" + userData.UserID
        );
        if (!projectResponse.ok) {
          throw new Error("Error getting project data");
        }

        const projectData = await projectResponse.json();
        setProjects(projectData);
      } catch (error) {
        console.error("Error fetching project data:", error.message);
      }

      try {
        const userProjectResponse = await fetch(
          "http://localhost:3000/profile/userproject?id=" + userData.UserID
        );
        if (!userProjectResponse.ok) {
          throw new Error("Error getting project data");
        }

        const userProjectData = await userProjectResponse.json();
        setUserProject(userProjectData);
      } catch (error) {
        console.error("Error fetching project data:", error.message);
      }
    };
    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    console.log({
      name: name,
      profession: profession,
      github: github,
      linkedin: linkedin,
      description: description,
      picture: picture,
    });

    setIsEditing(false);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleProfessionChange = (e) => {
    setProfession(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src={picture}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "150px" }}
                  fluid
                />
                {isEditing ? (
                  <div>
                    <input value={name} onChange={handleNameChange} />
                    <input
                      value={profession}
                      onChange={handleProfessionChange}
                    />
                    <textarea
                      value={description}
                      onChange={handleDescriptionChange}
                    />
                  </div>
                ) : (
                  <div>
                    <h5 className="my-3">{name}</h5>
                    <p className="text-muted mb-1">{profession}</p>
                    <p className="text-muted mb-1">{description}</p>
                  </div>
                )}
                <div className="d-flex justify-content-center mb-2">
                  {isEditing ? (
                    <MDBBtn onClick={handleSaveProfile}>Save Profile</MDBBtn>
                  ) : (
                    <MDBBtn onClick={handleEditProfile}>Edit Profile</MDBBtn>
                  )}
                  <MDBBtn outline className="ms-1">
                    Submit Project
                  </MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0">
              <MDBCardBody className="p-0">
                <MDBListGroup flush className="rounded-3">
                  <a href={github}>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon
                        fab
                        icon="github fa-lg"
                        style={{ color: "#333333" }}
                      />
                      <MDBCardText>GitHub</MDBCardText>
                    </MDBListGroupItem>
                  </a>
                  <a href={linkedin}>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon
                        fab
                        icon="linkedin fa-lg"
                        style={{ color: "#55acee" }}
                      />
                      <MDBCardText>LinkedIn</MDBCardText>
                    </MDBListGroupItem>
                  </a>
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <h1 className="myProject">My Project</h1>
            <MDBCard className="mb-4">
              {userProject.map((project) => (
                <CCol xs>
                  <Link to={`/project-view/${project.ProjectID}`}>
                    <CCard className="project-card h-100">
                      <AwardBanner
                        key={project.TeamName}
                        text={project.AwardName}
                      />
                      <MainImage
                        key={project.ProjectID}
                        TeamId={project.TeamId}
                      />
                      <CCardBody>
                        <CCardTitle>{project.ProjectName}</CCardTitle>
                        <CCardText>{project.TeamName}</CCardText>
                        <CListGroup flush>
                          <ProjectIntro projectIntro={project.ProjectIntro} />
                        </CListGroup>
                      </CCardBody>

                      <CCardFooter>
                        <p className="semesterTag semtag">
                          {project.capstoneYear} Semester{" "}
                          {project.capstoneSemester}
                        </p>

                        <div className="project-stats">
                          <p>
                            {" "}
                            <Heart /> {project.likes}{" "}
                          </p>
                          <p>
                            {" "}
                            <Views /> {project.viewCount}{" "}
                          </p>
                        </div>
                      </CCardFooter>
                    </CCard>
                  </Link>
                </CCol>
              ))}
            </MDBCard>
          </MDBCol>
        </MDBRow>
        <div className="project-list-liked-projects">
          <h1 className="myProject">My liked projects</h1>

          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            md={{ cols: 3 }}
            lg={{ cols: 4 }}
            xl={{ cols: 4 }}
            xxl={{ cols: 4 }}
          >
            {projects.map((project) => (
              <CCol xs>
                <Link to={`/project-view/${project.ProjectID}`}>
                  <CCard className="project-card h-100">
                    <AwardBanner
                      key={project.TeamName}
                      text={project.AwardName}
                    />
                    <MainImage
                      key={project.ProjectID}
                      TeamId={project.TeamId}
                    />
                    <CCardBody>
                      <CCardTitle>{project.ProjectName}</CCardTitle>
                      <CCardText>{project.TeamName}</CCardText>
                      <CListGroup flush>
                        <ProjectIntro projectIntro={project.ProjectIntro} />
                      </CListGroup>
                    </CCardBody>

                    <CCardFooter>
                      <p className="semesterTag">
                        {project.capstoneYear} Semester{" "}
                        {project.capstoneSemester}
                      </p>

                      <div className="project-stats">
                        <p>
                          {" "}
                          <Heart /> {project.likes}{" "}
                        </p>
                        <p>
                          {" "}
                          <Views /> {project.viewCount}{" "}
                        </p>
                      </div>
                    </CCardFooter>
                  </CCard>
                </Link>
              </CCol>
            ))}
          </CRow>
        </div>
      </MDBContainer>
    </section>
  );
}
export default Profile;
