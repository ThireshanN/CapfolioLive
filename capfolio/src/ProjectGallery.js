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


    const FilteredProjectData = async (body) => {
        console.log(body)
        const response = await fetch("/project/FilteredProjectData", {
            method: 'POST',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: body

        }).then((response) =>
            response.json()
        );
        setFilteredProjects(response);
        setFiltered(true); // Set filtered state to true when fetching filtered projects


        console.log(filteredProjects)
    };

return (
    <div className="project-gallery">
        {/* Pass the FilteredProjectData function as a prop */}
        <Sidebar onApplyFilter={FilteredProjectData} />
        <div className="project-list">
            {/* Show filtered projects if filtered is true, otherwise show all projects */}
            <CRow xs={{ cols: 1, gutter: 4 }} sm={{ cols: 2 }} md={{ cols: 3 }} lg={{ cols: 4 }}>
                {(filtered ? filteredProjects : projects) && (filtered ? filteredProjects : projects).map((project) => (
                    <CCol xs>
                        <CCard className="project-card h-100">
                            {'None' != "None" && <AwardBanner text={'None'} />}
                            <MainImage teamname={project.TeamName} />
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
                            <CCardFooter>
                                <CCardText>
                                    {'React | Next.js | Javascript | HTML'}
                                </CCardText>
                            </CCardFooter>
                            <CCardFooter>
                                <Link to={`/project-view/${project.ProjectID}`}>
                                    <CButton><span>View Project</span></CButton>
                                </Link>
                                <LikeButton likenumber={project.ProjectID} />
                            </CCardFooter>
                        </CCard>
                    </CCol>
                ))}
            </CRow>
        </div>
    </div>
);
};

export default ProjectGallery;
