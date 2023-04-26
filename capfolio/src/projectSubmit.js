import React, { useState, KeyboardEventHandler } from 'react';
import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBTextArea
} from 'mdb-react-ui-kit';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from "react-select/animated";
import Select from 'react-select';
import './projectSubmit.css';
import App from './App';
import { compare } from 'bcrypt';




export default function ProjectSubmit() {
    const animatedComponents = makeAnimated();

    const [selectedYears, setSelectedYears] = useState([]);
    const handleChangeYears = (selectedYears) => {
        setSelectedYears(selectedYears);
    };

    const [selectedSemesters, setSelectedSemesters] = useState([]);
    const handleChangeSemesters = (selectedSemesters) => {
        setSelectedSemesters(selectedSemesters);
    };

    const [selectedTechnologies, setSelectedTechnologies] = useState([]);
    const handleChangeTechnologies = (selectedTechnologies) => {
        setSelectedTechnologies(selectedTechnologies);
    };

    const [selectedTeam, setSelectedTeam] = useState([]);
    const handleChangeTeam = (selectedTeam) => {
        setSelectedTeam(selectedTeam);
    }




    const technologies = [
        { value: "blues", label: "React" },
        { value: "rock", label: "Javascript" },
        { value: "jazz", label: "HTML" },
        { value: "orchestra", label: "C#" },
    ];

    const years = [
        { value: "2017", label: "2017" },
        { value: "2018", label: "2018" },
        { value: "2019", label: "2019" },
        { value: "2020", label: "2020" },
        { value: "2021", label: "2021" },
        { value: "2022", label: "2022" },
        { value: "2023", label: "2023" },
    ];

    const semester = [
        { value: "sem1", label: "Semester One" },
        { value: "sem2", label: "Semester Two" },

    ];

    const maxnumber = 3

    const handleSubmit = (e) => {
        e.preventDefault();
   
        TeamName = document.getElementById('company').value;
        projectName = document.getElementById('projectName').value;
        capstoneYear = selectedYears;
        capstoneSemester = selectedSemesters;
        ProjectIntro = document.getElementById('intro').value;
        Project_About = document.getElementById('about').value;
        Project_Approach = document.getElementById('approach').value;
        tech = selectedTechnologies;
        teamMembers = selectedTeam;
        VideoLink = document.getElementById('yt').value;
        githubLink = document.getElementById('github').value;


            fetch('/project/FormAddProject', {
                method: 'POST',
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({
                    "ProjectName": projectName,
                    "IsApproved": 0,
                    "projectDec": project_About,
                    "githubLink": githubLink,
                    "capstoneYear": capstoneYear,
                    "capstoneSemester": capstoneSemester,
                    "adminID_FK": 7,
                    "TeamName": TeamName,
                    "VideoLink": VideoLink,
                    "ProjectIntro": ProjectIntro,
                    "Project_Approach": Project_Approach,
                    "Files": [],
                    "Technologies": tech,
                    "Users": teamMembers

                })
            }).then(() => {
                console.log('ProjectAdded')
                getComments();

            })
   

    }


    return (
        <div>

            <form className='projectsubmitform' onSubmit={handleSubmit}>
                <MDBRow className='mb-4'>
                    <MDBCol>
                        <MDBInput id='company' label='Company Name' />
                    </MDBCol>
                    <MDBCol>
                        <MDBInput id='projectName' label='Project Title' />
                    </MDBCol>
                </MDBRow>


                <MDBRow className='mb-4'>
                    <MDBCol>
                        <Select
                            id='year'
                            className="basic-single"
                            classNamePrefix="select"
                            isClearable
                            isSearchable
                            name="year"
                            options={years}
                            components={animatedComponents}
                            placeholder='Select year project was completed'
                            onChange={handleChangeYears}
                        />
                    </MDBCol>
                    <MDBCol>
                        <Select
                            id='semester'
                            className="basic-single"
                            classNamePrefix="select"
                            isClearable
                            isSearchable
                            components={animatedComponents}
                            name="year"
                            options={semester}
                            placeholder='Select semester project was completed'
                            onChange={handleChangeSemesters}

                        />
                    </MDBCol>
                </MDBRow>
                <MDBTextArea label='Project introduction' id='intro' className='textAreaExample' rows={2} />
                <MDBTextArea label='Tell us about your project' id='about' className='textAreaExample' rows={4} />
                <MDBTextArea label='Tell us about your project approach' id='approach' className='textAreaExample' rows={4} />

                <CreatableSelect id='tech' isMulti components={animatedComponents} options={technologies} onChange={handleChangeTechnologies} placeholder='Select from the drop down or type' />
                <CreatableSelect id='teamMembers' components={animatedComponents} isMulti onChange={handleChangeTeam} placeholder='Type names' />

                <MDBInput label='Github Link' id='github' type='url' />
                <MDBInput label='Youtube demo link' id='yt' type='url' />

                <label for="formFileMultiple" class="form-label">Upload screenshots of your project</label>
                <input class="form-control" type="file" id="formFileMultiple" multiple maxNumber={maxnumber} />

                <MDBBtn className='mb-4' type='submit' block>
                    Submit Project!
                </MDBBtn>
            </form>
        </div>
    );
}