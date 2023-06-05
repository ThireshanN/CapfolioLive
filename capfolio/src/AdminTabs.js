import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useParams, useNavigate } from "react-router-dom";
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
import { createTheme, ThemeProvider } from "@mui/material/styles";

function AdminTabs({ allProjects, projectToBeApproved }) {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const theme = createTheme({
    palette: {
      secondary: {
        main: "#0a89eb",
      },
    },
    components: {
      MuiTab: {
        styleOverrides: {
          root: {
            color: "#0a89eb",
            fontFamily: '"Outfit"',
            textTransform: "none",
          },
          selected: {
            color: "#0a89eb",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Projects Needing approval" />
          <Tab label="All Projects" />
        </Tabs>
        {selectedTab === 0 && (
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            md={{ cols: 2 }}
            lg={{ cols: 2 }}
            xl={{ cols: 3 }}
            xxl={{ cols: 3 }}
          >
            {projectToBeApproved.map((project) => (
              <CCol xs key={project.ProjectID}>
                <Link to={`/Admin-project-view/${project.ProjectID}`}>
                  <CCard className="project-card h-100">
                    <MainImage
                      key={project.ProjectID}
                      TeamId={project.TeamId}
                    />
                    <CCardBody>
                      <CCardTitle>{project.ProjectName}</CCardTitle>
                      <CCardText>{project.TeamName}</CCardText>
                      <ProjectIntro projectIntro={project.ProjectIntro} />
                    </CCardBody>
                    <CCardFooter>
                      <p className="semesterTag">
                        {project.capstoneYear} Semester{" "}
                        {project.capstoneSemester}
                      </p>
                      <div className="project-stats">
                        <p>
                          <Heart /> {project.likes}
                        </p>
                        <p>
                          <Views /> {project.viewCount}
                        </p>
                      </div>
                    </CCardFooter>
                  </CCard>
                </Link>
              </CCol>
            ))}
          </CRow>
        )}
        {selectedTab === 1 && (
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            md={{ cols: 2 }}
            lg={{ cols: 2 }}
            xl={{ cols: 3 }}
            xxl={{ cols: 3 }}
          >
            {allProjects.map((project) => (
              <CCol xs key={project.ProjectID}>
                <Link to={`/Admin-project-view/${project.ProjectID}`}>
                  <CCard className="project-card h-100">
                    <MainImage
                      key={project.ProjectID}
                      TeamId={project.TeamId}
                    />
                    <CCardBody>
                      <CCardTitle>{project.ProjectName}</CCardTitle>
                      <CCardText>{project.TeamName}</CCardText>
                      <ProjectIntro projectIntro={project.ProjectIntro} />
                    </CCardBody>
                    <CCardFooter>
                      <p className="semesterTag">
                        {project.capstoneYear} Semester{" "}
                        {project.capstoneSemester}
                      </p>
                      <div className="project-stats">
                        <p>
                          <Heart /> {project.likes}
                        </p>
                        <p>
                          <Views /> {project.viewCount}
                        </p>
                      </div>
                    </CCardFooter>
                  </CCard>
                </Link>
              </CCol>
            ))}
          </CRow>
        )}
        ;
      </Box>
    </ThemeProvider>
  );
}

export default AdminTabs;
