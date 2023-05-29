import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import { Link } from 'react-router-dom';
import { CRow, CCol, CCard, CCardBody, CCardTitle, CCardText, CCardFooter } from '@coreui/react';
import MainImage from './components/getMainImage';
import { ReactComponent as Heart } from './images/heart.svg';
import { ReactComponent as Views } from './images/views.svg';
import ProjectIntro from './components/ProjectIntro';
import { Pagination } from '@mui/material';

const AdminPage = () => {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const projectsPerPage = 6;

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const fetchAllProjects = async () => {
    const response = await fetch('/admin/approved/projects').then((response) => response.json());
    setProjects(response);
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * projectsPerPage;
  const endIndex = startIndex + projectsPerPage;
  const displayedProjects = projects.slice(startIndex, endIndex);

  return (
    
    <div className="admin-page">
        <div className="side-panel">
      </div>
      <div className="project-list">
        <CRow xs={{ cols: 1, gutter: 4 }} sm={{ cols: 2 }} md={{ cols: 2 }} lg={{ cols: 2 }} xl={{ cols: 3 }} xxl={{ cols: 3 }}>
          {displayedProjects.map((project) => (
            <CCol xs key={project.ProjectID}>
              <Link to={`/Admin-project-view/${project.ProjectID}`}>
                <CCard className="project-card h-100">
                <MainImage key={project.ProjectID} TeamId={project.TeamId} />
                  <CCardBody>
                    <CCardTitle>{project.ProjectName}</CCardTitle>
                    <CCardText>{project.TeamName}</CCardText>
                    <ProjectIntro projectIntro={project.ProjectIntro} />
                  </CCardBody>
                  <CCardFooter>
                    <p className="semesterTag">
                      {project.capstoneYear} Semester {project.capstoneSemester}
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
        <div className="pagination-wrapper">
          <Pagination
            count={Math.ceil(projects.length / projectsPerPage)}
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
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

