import React from 'react';
import './ProjectGallery.css';
import { Link, useMatch, useResolvedPat, useContext } from "react-router-dom";
import { Collapse, CButton, CCollapse,CListGroup, CListGroupItem, CCard, CCardBody, CRow, CCol, CCardImage, CCardTitle, CCardText, CCardFooter } from '@coreui/react';
import LikeButton from "./likeButton";
import AwardBanner from "./awardBanner.js";

const projects = [
  {
    id: 1,
    title: 'Project 1',
    team: 'Team WebZen',
    description: 'In todays world, there are numerous real-world problems that still require solutions.One way for students to gain hands - on experience in tackling these challenges is through the capstone course.By taking part in this course, students can develop the computer science skills that are highly sought after by prospective employers',
    image: 'https://via.placeholder.com/350x200',
    technologies:'React | Next.js | Javascript | HTML',
    link: 'https://www.example.com',
    hasAward: false,
    awardText:'',
  },
  {
    id: 2,
    title: 'Project 2',
    team: 'Team WebZen',
    description: 'In todays world, there are numerous real-world problems that still require solutions.One way for students to gain hands - on experience in tackling these challenges is through the capstone course.By taking part in this course, students can develop the computer science skills that are highly sought after by prospective employers',
    image: 'https://via.placeholder.com/350x200',
    technologies:'React | Next.js | Javascript | HTML',
    link: 'https://www.example.com',
    hasAward: true,
    awardText:'Excellence Award',
  },
  {
    id: 3,
    title: 'Project 3',
    team: 'Team WebZen',
    description: 'In todays world, there are numerous real-world problems that still require solutions.One way for students to gain hands - on experience in tackling these challenges is through the capstone course.By taking part in this course, students can develop the computer science skills that are highly sought after by prospective employers',
    image: 'https://via.placeholder.com/350x200',
    technologies:'React | Next.js | Javascript | HTML',
    link: 'https://www.example.com',
    hasAward: false,
    awardText:'',
  },
  {
    id: 4,
    title: 'Project 4',
    team: 'Team WebZen',
    description: 'In todays world, there are numerous real-world problems that still require solutions.One way for students to gain hands - on experience in tackling these challenges is through the capstone course.By taking part in this course, students can develop the computer science skills that are highly sought after by prospective employers',
    image: 'https://via.placeholder.com/350x200',
    technologies:'React | Next.js | Javascript | HTML',
    link: 'https://www.example.com',
    hasAward: false,
    awardText:'',
  },{
    id: 5,
    title: 'Project 5',
    team: 'Team WebZen',
    description: 'In todays world, there are numerous real-world problems that still require solutions.One way for students to gain hands - on experience in tackling these challenges is through the capstone course.By taking part in this course, students can develop the computer science skills that are highly sought after by prospective employers',
    image: 'https://via.placeholder.com/350x200',
    technologies:'React | Next.js | Javascript | HTML',
    link: 'https://www.example.com',
    hasAward: false,
    awardText:'',
  },{
    id: 6,
    title: 'Project 6',
    team: 'Team WebZen',
    description: 'In todays world, there are numerous real-world problems that still require solutions.One way for students to gain hands - on experience in tackling these challenges is through the capstone course.By taking part in this course, students can develop the computer science skills that are highly sought after by prospective employers',
    image: 'https://via.placeholder.com/350x200',
    technologies:'React | Next.js | Javascript | HTML',
    link: 'https://www.example.com',
    hasAward: false,
    awardText:'',
  },{
    id: 7,
    title: 'Project 7',
    team: 'Team WebZen',
    description: 'In todays world, there are numerous real-world problems that still require solutions.One way for students to gain hands - on experience in tackling these challenges is through the capstone course.By taking part in this course, students can develop the computer science skills that are highly sought after by prospective employers',
    image: 'https://via.placeholder.com/350x200',
    technologies:'React | Next.js | Javascript | HTML',
    link: 'https://www.example.com',
    hasAward: false,
    awardText:'',
  },{
    id: 8,
    title: 'Project 8',
    team: 'Team WebZen',
    description: 'In todays world, there are numerous real-world problems that still require solutions.',
    image: 'https://via.placeholder.com/350x200',
    technologies:'React | Next.js | Javascript | HTML',
    link: 'https://www.example.com',
    hasAward: false,
    awardText:'',
  },
];

const ProjectGallery = () => {
  const ProjectCard = ({ project }) => {
    return (
      <div className="project-card">
        <img src={project.image} alt={project.title} />
        <div className="project-info">
          <h3>{project.title}</h3>
          <p>{project.team}</p>
          <Link to='/project-view'>View Project</Link>
        </div>
      </div>
    );
  };

  return (
    <div className="project-gallery">
       <div className="project-list">
        {/* {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))} */}
      

        <CRow xs={{ cols: 1, gutter: 4 }} sm={{ cols: 2}} md={{ cols: 3 }} lg={{ cols: 4 }}>
          
          {projects.map((project) => (
            <CCol xs>
            <CCard className="project-card h-100">
              {project.hasAward && <AwardBanner text={project.awardText} />}
              <CCardImage orientation="top" src={project.image} />
              <CCardBody>
                <CCardTitle>{project.title}</CCardTitle>
                <CCardText>
                  {project.team}
                </CCardText>
                <CListGroup flush>
                  <div className='text-container'>
                  <CListGroupItem className='fade-text'>{project.description}</CListGroupItem>
                  <div className="fade-effect"></div>
                  </div>
                </CListGroup>
              </CCardBody>
              <CCardFooter>
                <CCardText>
                    {project.technologies}
                </CCardText>
              </CCardFooter>
              <CCardFooter>
                          <Link to='/project-view'>
                              <CButton><span>View Project</span></CButton>
                          </Link>
                <LikeButton />
                {/* <small className="text-medium-emphasis">Last updated 3 mins ago</small> */}
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
