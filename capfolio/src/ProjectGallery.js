import React, { useState, useEffect, useRef } from 'react';
import './ProjectGallery.css';
import { Link, useMatch, useResolvedPat, useContext } from "react-router-dom";
import { Collapse, CButton, CCollapse, CListGroup, CListGroupItem, CCard, CCardBody, CRow, CCol, CCardImage, CCardTitle, CCardText, CCardFooter } from '@coreui/react';
import LikeButton from "./components/likeButton";
import AwardBanner from "./components/awardBanner.js";
import Sidebar from './Sidebar';
import MainImage from './components/getMainImage';

const ProjectGallery = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [isNoResults, setIsNoResults] = useState(false);

    const fetchAllProjects = async () => {
        const response = await fetch("/project/AllProjectData").then((response) => response.json());
        setProjects(response);
        setIsFiltered(false);
        setIsNoResults(false); // add this line to reset isNoResults

    };
    useEffect(() => {
        if (!isFiltered) {
            setFilteredProjects([]);
        }
    }, [isFiltered]);

    useEffect(() => {
        fetchAllProjects();
    }, []);

    const fetchFilteredProjects = async (body) => {
        const response = await fetch("/project/FilteredProjectData", {
            method: 'POST',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: body
        }).then((response) => response.json());

        if (response.length === 0) {
            setIsNoResults(true);
        } else {
            setFilteredProjects(response);
            setIsFiltered(true);
            setIsNoResults(false);
        }
    };

    const handleApplyFilter = (body) => {
        fetchFilteredProjects(body);
    };

    return (
        <div className="project-gallery">
            <Sidebar onApplyFilter={handleApplyFilter} />
            {isNoResults && (
                <div className="no-results-message">
                    <h2>No results found.</h2>
                </div>
            )}
            {!isNoResults && (
                <div className="project-list">
                    <CRow xs={{ cols: 1, gutter: 4 }} sm={{ cols: 2 }} md={{ cols: 3 }} lg={{ cols: 3 }} xl={{ cols: 3 }} xxl={{ cols: 4 }}>
                        {(isFiltered ? filteredProjects : projects).map((project) => (
                            <CCol xs>
                              <Link to={`/project-view/${project.ProjectID}`}>
                                <CCard className="project-card h-100">
                                    <AwardBanner key={project.TeamName} text={project.AwardName} />
                                    <MainImage key={project.ProjectID} teamname={project.TeamName} />
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
                                        {/* <Link to={`/project-view/${project.ProjectID}`}>
                                            <CButton><span>View Project</span></CButton>
                                        </Link>
                                        <LikeButton key={project.TeamName} likenumber={project.ProjectID} /> */}
                                    </CCardFooter>
                                </CCard>
                                </Link>
                            </CCol>
                        ))}
                    </CRow>
                </div>
            )}
        </div>
    );
};

export default ProjectGallery;