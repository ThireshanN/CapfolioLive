import React, { useState, useEffect } from "react";
import "./AdminPage.css";
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
    <div className="admin-page">
      <div className="side-panel"></div>
      <div className="project-list">
        <AdminTabs
          allProjects={allProjects}
          projectToBeApproved={projectsToBeApproved}
        />
      </div>
    </div>
  );
};

export default AdminPage;
