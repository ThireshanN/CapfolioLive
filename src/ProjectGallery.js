import React from 'react';
import './ProjectGallery.css';
import { Link, useMatch, useResolvedPath } from "react-router-dom";

const projects = [
  {
    id: 1,
    title: 'Project 1',
    description: 'Project1 is C++',
    image: 'https://via.placeholder.com/350x200',
    link: 'https://www.example.com',
  },
  {
    id: 2,
    title: 'Project 2',
    description: 'This is a HealthApp',
    image: 'https://via.placeholder.com/350x200',
    link: 'https://www.example.com',
  },
  {
    id: 3,
    title: 'Project 3',
    description: 'This is a webpage',
    image: 'https://via.placeholder.com/350x200',
    link: 'https://www.example.com',
  },
  {
    id: 4,
    title: 'Project 4',
    description: 'This is a modbile app',
    image: 'https://via.placeholder.com/350x200',
    link: 'https://www.example.com',
  },{
    id: 5,
    title: 'Project 5',
    description: 'This is a modbile app',
    image: 'https://via.placeholder.com/350x200',
    link: 'https://www.example.com',
  },{
    id: 6,
    title: 'Project 6',
    description: 'This is a modbile app',
    image: 'https://via.placeholder.com/350x200',
    link: 'https://www.example.com',
  },{
    id: 7,
    title: 'Project 7',
    description: 'This is a modbile app',
    image: 'https://via.placeholder.com/350x200',
    link: 'https://www.example.com',
  },{
    id: 8,
    title: 'Project 8',
    description: 'This is a modbile app',
    image: 'https://via.placeholder.com/350x200',
    link: 'https://www.example.com',
  },
];

const ProjectGallery = () => {
  const ProjectCard = ({ project }) => {
    return (
      <div className="project-card">
        <img src={project.image} alt={project.title} />
        <div className="project-info">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <Link to='/project-view'>View Project</Link>
        </div>
      </div>
    );
  };

  return (
    <div className="project-gallery">
      <div className="project-list">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectGallery;
