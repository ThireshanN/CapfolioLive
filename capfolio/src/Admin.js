import React, { useState, useEffect, useContext } from "react";
import "./AdminPage.css";
import { AuthContext } from "./AuthContext";
import { Link } from "react-router-dom";
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardTitle,
  CCardText,
  CCardFooter,
} from "@coreui/react";
import MainImage from "./components/getMainImage";
import { ReactComponent as Heart } from "./images/heart.svg";
import { ReactComponent as Views } from "./images/views.svg";
import ProjectIntro from "./components/ProjectIntro";
import { Pagination } from "@mui/material";
import AdminTabs from "./AdminTabs";
const AdminPage = () => {
  const [allProjects, SetAllProjects] = useState([]);
  const [projectsToBeApproved, setProjectsToBeApproved] = useState([]);
  const [page, setPage] = useState(1);
  const projectsPerPage = 6;
  const { user, setUser } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
        if (user && user.userType === '3') {
            setIsAdmin(true);
        } 
        setIsAuthenticated(user !== null);
        console.log(user, isAdmin);
    }, [user]);

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const fetchAllProjects = async () => {
    const responseApprove = await fetch("/admin/approved/projects").then(
      (response) => response.json()
    );
    setProjectsToBeApproved(responseApprove);

    const response = await fetch("/project/AllProjectData").then((response) =>
      response.json()
    );
    SetAllProjects(response);
  };

  return (
    <>
      {isAdmin ? (
        <div className="admin-page">
          <div className="side-panel"></div>
          <div className="project-list">
            <AdminTabs
              allProjects={allProjects}
              projectToBeApproved={projectsToBeApproved}
            />
          </div>
        </div>
      ) : (
        <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Nice Try....You gotta login as Admin </h1>
    </div>
      )}
    </>
  );
};
export default AdminPage;