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
import AWS from "aws-sdk";

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

const bucketName = "capfoliostorage";
const bucketRegion = "ap-southeast-2";
const accessKeyId = "AKIAUDUQU75VEF3VDCEL";
const secretAccessKey = "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";

const s3 = new AWS.S3({
  region: bucketRegion,
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [description, setDescription] = useState("");
  const [imgURL, setImgURL] = useState("");
  const [newFile, setNewFile] = useState([]);
  const [picture, setPicture] = useState("");
  const [projects, setProjects] = useState([]);
  const [userProject, setUserProject] = useState([]);
  const [isStudent, setStudent] = useState(false);
  const [userid, setUserId] = useState("");
  useEffect(() => {
    const fetchUserData = async () => {
      let userData;
      try {
        const response = await fetch("/auth/user");
        if (!response.ok) {
          throw new Error("User not authenticated");
        }
        userData = await response.json();
        console.log(userData.Photo);
        setName(`${userData.FirstName} ${userData.LastName}`);
        setPicture(userData.Photo);
        setProfession(userData.Type);
        setGithub(userData.githubLink);
        setLinkedin(userData.linkedin);
        setDescription(userData.userDescription);
        setUserId(userData.UserID);
        if (userData.UserType === 1) {
          setStudent(true);
        }

        console.log(userData.UserID);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }

      try {
        const projectResponse = await fetch(
          "/profile/likedProjects?id=" + userData.UserID
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
          "/profile/userproject?id=" + userData.UserID
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

  const handleSaveProfile = async () => {
    let createURL;
    
    console.log({
      name: name,
      profession: profession,
      github: github,
      linkedin: linkedin,
      description: description,
      picture: picture,
    });

    const [firstName, lastName] = name.split(" ");

    const highResPromises = newFile.map(async (file) => {
      console.log(file);
      const filename = file.name;
      const key =
        "" + "assets" + "/" + "profilePictures" + "/" + userid + "/" + filename;
      createURL =
        "https://capfoliostorage.s3.ap-southeast-2.amazonaws.com/assets/profilePictures/" +
        userid +
        "/" +
        filename;
      setImgURL(createURL);
      
      const Imgparams = {
        Bucket: bucketName,
        Key: key,
        ACL: "public-read",
        Body: file,
      };

      try {
        const data = await s3.upload(Imgparams).promise();
        return data;
      } catch (err) {
        console.error(err);
      }
    });

    try {
      await Promise.all(highResPromises);
      setPicture(createURL);

      await fetch("/profile/updateUser", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          linkedin: linkedin,
          github: github,
          userDesc: description,
          profession: profession,
          Picture: createURL ? createURL : picture,
        }),
      });
    } catch (error) {
      console.error(error);
    }

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

  const handleGitHubChange = (e) => {
    setGithub(e.target.value);
  };
  const handleLinkedinChange = (e) => {
    setLinkedin(e.target.value);
  };
  const handlePictureChange = async (file) => {
    const reader = new FileReader();

    reader.onload = async () => {
      console.log(reader.result);
      const newPictureSrc = reader.result;
      setPicture(newPictureSrc);
    };
    reader.readAsDataURL(file);
    const fileArray = [];
    fileArray.push(file);
    setNewFile(fileArray);
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                {isEditing ? (
                  <div>
                    <form action="/action_page.php">
                      <input
                        type="file"
                        id="myFile"
                        name="filename"
                        onChange={(e) => handlePictureChange(e.target.files[0])}
                      ></input>
                    </form>

                    <MDBCardImage
                      src={picture}
                      alt="avatar"
                      className="rounded-circle"
                      style={{ width: "150px", height: "150px" }}
                      fluid
                    />
                  </div>
                ) : (
                  <MDBCardImage
                    src={picture}
                    alt="avatar"
                    className="rounded-circle"
                    style={{ width: "150px", height: "150px" }}
                    fluid
                  />
                )}

                {isEditing ? (
                  <div>
                    <input
                      value={name}
                      onChange={handleNameChange}
                      placeholder="Name"
                    />
                    <input
                      value={profession}
                      onChange={handleProfessionChange}
                      placeholder="Occupation"
                    />
                    <textarea
                      value={description}
                      onChange={handleDescriptionChange}
                      placeholder="Tell us about yourself"
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
                  {isStudent ? (
                    <div>
                      {isEditing ? (
                        <MDBBtn onClick={handleSaveProfile}>
                          Save Profile
                        </MDBBtn>
                      ) : (
                        <MDBBtn onClick={handleEditProfile}>
                          Edit Profile
                        </MDBBtn>
                      )}
                      <Link to="/project-submit">
                        <MDBBtn outline className="ms-1">
                          Submit Project
                        </MDBBtn>
                      </Link>
                    </div>
                  ) : (
                    <div>
                      {isEditing ? (
                        <MDBBtn onClick={handleSaveProfile}>
                          Save Profile
                        </MDBBtn>
                      ) : (
                        <MDBBtn onClick={handleEditProfile}>
                          Edit Profile
                        </MDBBtn>
                      )}
                    </div>
                  )}
                </div>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0">
              <MDBCardBody className="p-0">
                <MDBListGroup flush className="rounded-3">
                  {isEditing ? (
                    <div>
                      <input
                        value={github}
                        onChange={handleGitHubChange}
                        placeholder="GitHub Profile"
                      />
                      <input
                        value={linkedin}
                        onChange={handleLinkedinChange}
                        placeholder="LinkedIn Profile"
                      />
                    </div>
                  ) : (
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
                  )}
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
};
export default Profile;
