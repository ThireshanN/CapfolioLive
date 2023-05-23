import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

function AdminProjectTabs({ projects }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [projectIntro, setProjectIntro] = useState('');
  const [projectApproach, setProjectApproach] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setProjectIntro(projects && projects.map((project) => project.ProjectIntro).join(' '));
    setProjectApproach(projects && projects.map((project) => project.Project_Approach).join(' '));
  }, [projects]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Save the edited project information
    console.log({
      projectIntro: projectIntro,
      projectApproach: projectApproach
    });

    // Perform the necessary saving logic here

    // Reset the editing state
    setIsEditing(false);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="About Project" />
        <Tab label="Project Poster" />
      </Tabs>
      {selectedTab === 0 && (
        <div className="projectInformation">
          <h2>
            About {projects && projects.map((project) => project.ProjectName)}
          </h2>
          {isEditing ? (
            <textarea
              value={projectIntro}
              onChange={(event) => setProjectIntro(event.target.value)}
            ></textarea>
          ) : (
            <p className="about">{projectIntro}</p>
          )}
          <h2>Project Approach</h2>
          {isEditing ? (
            <textarea
              value={projectApproach}
              onChange={(event) => setProjectApproach(event.target.value)}
            ></textarea>
          ) : (
            <p className="projectApproach">{projectApproach}</p>
          )}
          <iframe
            width="100%"
            height="400"
            allowFullScreen
            src={projects && projects.map((project) => project.VideoLink)}
            title="Project Video"
          ></iframe>
          {isEditing ? (
            <button onClick={handleSave} className="btn btn-primary">Save</button>
          ) : (
            <button onClick={handleEdit} className="btn btn-primary">Edit</button>
          )}
        </div>
      )}
      {selectedTab === 1 && (
        <div className="projectInformation">
          <h2>
            This project poster will be displayed here.
            <br></br>
          </h2>
        </div>
      )}
    </Box>
  );
}

export default AdminProjectTabs;
