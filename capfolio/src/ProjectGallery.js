import React, { useState, useEffect, useRef } from 'react';
import './ProjectGallery.css';
import { Link, useMatch, useResolvedPat, useContext } from "react-router-dom";
import { Collapse, CButton, CCollapse, CListGroup, CListGroupItem, CCard, CCardBody, CRow, CCol, CCardImage, CCardTitle, CCardText, CCardFooter } from '@coreui/react';
import LikeButton from "./components/likeButton";
import AwardBanner from "./components/awardBanner.js";
import Sidebar from './Sidebar';
import CSidebar from './components/CSidebar';
import MainImage from './components/getMainImage';
import { ReactComponent as Heart } from "./images/heart.svg";
import { ReactComponent as Views } from "./images/views.svg";
import ProjectIntro from './components/ProjectIntro'; 
import { Pagination } from '@mui/material';
import Search from './Search';

const ProjectGallery = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [isNoResults, setIsNoResults] = useState(false);
    const [page, setPage] = useState(1);

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const projectsPerPage = 6;
    const startIndex = (page - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    const displayedProjects = (isFiltered ? filteredProjects : projects).slice(startIndex, endIndex);


    const fetchAllProjects = async () => {
        const response = await fetch("/project/AllProjectData").then((response) => response.json());
        setProjects(response);
        setIsFiltered(false);
        setIsNoResults(false);

    };
   //Checks to see if it should render all projects or just filtered ones - used for when no options are selected
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
            //If nothing is return see noresults to true
            setIsNoResults(true);
        } else {
            setFilteredProjects(response);
            setIsFiltered(true);
            setIsNoResults(false);
        }
    };


    const fetchSearchedProject = async (body) => {
        console.log(body)
        const response = await fetch('project/searchProject?keyword=' + body).then((response) => response.json());
        if (response.length === 0) {
            //If nothing is return see noresults to true
            setIsNoResults(true);
        } else {
            setFilteredProjects(response);
            setIsFiltered(true);
            setIsNoResults(false);
        }
    }

    const handleApplyFilter = (body) => {
        fetchFilteredProjects(body);
    };

    const handleApplySearch = body => {
        fetchSearchedProject(body)
    }
    const [visible, setVisible] = useState(false);

    return (
        <div className="project-gallery">
            <Search onApplySearch={handleApplySearch} />
            

            {/*checks to see if the filter returned anything - if it does not it will show the message other genreate the cards like normal*/}
            {isNoResults && (
                <div className="no-results-message">
                    <Sidebar onApplyFilter={handleApplyFilter} />
                    <h2>No results found.</h2>
                </div>
            )}

            {!isNoResults && (
              <div className='gallery-wrapper'>
                <div className='filter'>
                    <Sidebar onApplyFilter={handleApplyFilter} />
                </div>
                <div className='cfilter'>
                    <CSidebar onApplyFilter={handleApplyFilter} />
                </div>
                <div className="project-list">
                    <CRow xs={{ cols: 1, gutter: 4 }} sm={{ cols: 2 }} md={{ cols: 2 }} lg={{ cols: 2 }} xl={{ cols: 3 }} xxl={{ cols: 3 }}>
                      {displayedProjects.map((project) => (

                            <CCol xs>
                              <Link to={`/project-view/${project.ProjectID}`}>
                                <CCard className="project-card h-100">
                                    <AwardBanner key={project.TeamName} text={project.AwardName} />
                                    <MainImage key={project.ProjectID} TeamId={project.TeamId} />
                                    <CCardBody>
                                        <CCardTitle>{project.ProjectName}</CCardTitle>
                                        <CCardText>
                                            {project.TeamName}
                                        </CCardText>
                                        <CListGroup flush>
                                          <ProjectIntro projectIntro={project.ProjectIntro} />
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
                                        <div className='project-stats'>
                                        <p> <Heart/> {project.likes} </p> 
                                        <p> <Views/> {project.viewCount} </p> 
                                        </div>
                                    </CCardFooter>
                                </CCard>
                                </Link>
                            </CCol>
                        ))}
                    </CRow>
                    <div className='pagination-wrapper'>
                      <Pagination
                      count={Math.ceil((isFiltered ? filteredProjects.length : projects.length) / projectsPerPage)}
                      page={page}
                      onChange={handleChangePage}
                      color="primary"
                      sx={{
                        marginTop: '20px',
                        marginLeft: '20%',
                        '& .MuiPaginationItem-root': {
                          backgroundColor: 'transparent',
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                        },
                        '& .MuiPaginationItem-page.Mui-selected': {
                          backgroundColor: '#72a0e9',
                          '&:hover': {
                            backgroundColor: '#72a0e9',
                          },
                        },
                        '& .MuiPaginationItem-page.Mui-selected.Mui-focusVisible': {
                          backgroundColor: '#72a0e9',
                        },
                        
                        '@media (max-width: 992px)': {
                        marginLeft: 0,
                        },
                    }}
                    />
                  </div>
                </div>
              </div>
            )}
        </div>
    );
};

export default ProjectGallery;