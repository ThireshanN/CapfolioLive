import React, { useState, useEffect, useRef } from 'react';
import './ProjectGallery.css';
import { Link, useMatch, useResolvedPat, useContext } from "react-router-dom";
import { Collapse, CButton, CCollapse, CListGroup, CListGroupItem, CCard, CCardBody, CRow, CCol, CCardImage, CCardTitle, CCardText, CCardFooter } from '@coreui/react';
import LikeButton from "./components/likeButton";
import AwardBanner from "./components/awardBanner.js";
import Sidebar from './Sidebar';
import MainImage from './components/getMainImage';

const ProjectGallery = () => {


  const [projects, setProjects] = useState('');
  // Function to collect data
  const AllProjectData = async () => {
    const response = await fetch(
      "/project/AllProjectData"
    ).then((response) => response.json());
    // console.log(response)
    setProjects(response);
    setFiltered(false); // Set filtered state to false when fetching all projects
  };

  // console.log(projects)

  useEffect(() => {
    AllProjectData();
  }, []);

  // Add a state to manage whether to show filtered projects or not
  const [filtered, setFiltered] = useState(false);

  const [filteredProjects, setFilteredProjects] = useState('');
  // Function to collect filtered data
  const FilteredProjectData = async () => {
    const response = await fetch("/project/FilteredProjectData").then((response) =>
      response.json()
    );
    setFilteredProjects(response);
    setFiltered(true); // Set filtered state to true when fetching filtered projects
  };

  console.log(filteredProjects)


  function renderAwardBanner(awardName) {
    switch (awardName) {
      case "Excellence Award":
        return <AwardBanner text={awardName} color="gold" />;
      case "Community Impact Award":
        return <AwardBanner text={awardName} color="red" />;
      case "People's Choice Award":
        return <AwardBanner text={awardName} color="green" />;
      default:
        return null;
    }
  }


  function getAwardBorderClass(awardName) {
    switch (awardName) {
      case "Excellence Award":
        return "excellence-border";
      case "Community Impact Award":
        return "community-impact-border";
      case "People's Choice Award":
        return "peoples-choice-border";
      default:
        return "";
    }
  }
  
  return (
    <div className="project-gallery">
      {/* Pass the FilteredProjectData function as a prop */}
      <Sidebar onApplyFilter={FilteredProjectData} />
      <div className="project-list">
        {/* Show filtered projects if filtered is true, otherwise show all projects */}
        <CRow xs={{ cols: 1, gutter: 4 }} sm={{ cols: 2 }} md={{ cols: 3 }} lg={{ cols: 3 }} xl={{ cols: 3 }} xxl={{ cols: 4 }}>
          {(filtered ? filteredProjects : projects) && (filtered ? filteredProjects : projects).map((project) => (
            <CCol xs>
              <Link to={`/project-view/${project.ProjectID}`}>
              <CCard className={`project-card h-100 ${getAwardBorderClass(project.AwardName)}`}>
              {project.AwardName !== "None" && renderAwardBanner(project.AwardName)}
                    <MainImage teamname={ project.TeamName} />
                <CCardBody>
                  <CCardTitle>{project.ProjectName}</CCardTitle>
                  <CCardText>
                    {project.TeamName}
                  </CCardText>
                  <CListGroup flush>
                    <div className='text-container'>
                      <CListGroupItem className='fade-text'>{project.ProjectIntro}</CListGroupItem>
                      <div className="fade-effect"></div>
                    </div>
                  </CListGroup>
                </CCardBody>
                {/* <CCardFooter>
                  <CCardText>
                    {'React | Next.js | Javascript | HTML'}
                  </CCardText>
                </CCardFooter> */}
                <CCardFooter>
                  <p className='semesterTag'>{project.capstoneYear} Semester {project.capstoneSemester}</p>
                    {/* <CButton><span>View Project</span></CButton>                 
                  <LikeButton likenumber={project.ProjectID} /> */}
                </CCardFooter>
              </CCard>
              </Link>
            </CCol>
          ))}
        </CRow>
      </div>
    </div>
  );
};

export default ProjectGallery;
