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
import { Link, useParams } from "react-router-dom";
import MainImage from "../components/getMainImage";
import "./Profile.css";

const ViewStudentProfile = () => {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [projects, setProjects] = useState([]);
  const [userProject, setUserProject] = useState([]);
  const params = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      let userData;
      try {
        const response = await fetch(
          "/profile/viewStudentProfile?id=" + params.id
        );
        userData = await response.json();
        console.log(userData.FirstName);
        setName(`${userData[0].FirstName} ${userData[0].LastName}`);
        setPicture(userData[0].Picture);
        setProfession(userData[0].Profession);
        setGithub(userData[0].GithubLink);
        setLinkedin(userData[0].LinkedIn);
        setDescription(userData[0].UserDescription);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }

      try {
        const projectResponse = await fetch(
          "/profile/likedProjects?id=" + userData[0].UserID
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
          "/profile/userproject?id=" + userData[0].UserID
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

  const [firstName, lastName] = name.split(" ");

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

                <div>
                  <h5 className="my-3">{name}</h5>
                  <p className="text-muted mb-1">{profession}</p>
                  <p className="text-muted mb-1">{description}</p>
                </div>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0">
              <MDBCardBody className="p-0">
                <MDBListGroup flush className="rounded-3">
                  <div>
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
                  </div>
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <h1 className="myProject">{name.split(" ")[0]}'s Project</h1>
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
          <h1 className="myProject">{name.split(" ")[0]}'s liked projects</h1>

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
};
export default ViewStudentProfile;
