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
import Select from 'react-select';
import './projectSubmit.css';
import App from './App';




export default function ProjectSubmit() {
    
    const [selectedOption, setSelectedOption] = useState("");
    var handleChange = (selectedOption) => {
        console.log(selectedOption);
        setSelectedOption(selectedOption.value);
    };
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

    const [project, setProject] = useState('');
    const maxnumber = 3;
    const handleSubmit = (e) => {
        //e.preventDefault();

        //var company = document.getElementById('company').value;
        //var projectName = document.getElementById('projectName').value;
        //var year = document.getElementById('year').value
        //var semester = document.getElementById('semester').value
        //var intro = document.getElementById('intro').value
        //var about = document.getElementById('about').value
        //var approach = document.getElementById('approach').value
        //var tech = document.getElementById('tech').value
        //var teamMembers = document.getElementById('teamMembers').value
        //var yt = document.getElementById('yt').value
        //var github = document.getElementById('github').value



        //const regBodyFromClient = new ProjectSchema2();
        //regBodyFromClient.ProjectName = projectName
        //regBodyFromClient.IsApproved = 1;
        //regBodyFromClient.projectDec = about
        //regBodyFromClient.githubLink = ;
        //regBodyFromClient.capstoneYear = ;
        //regBodyFromClient.capstoneSemester = ;
        //regBodyFromClient.adminID_FK = ;
        //regBodyFromClient.TeamName = ;
        //regBodyFromClient.VideoLink = ;
        //regBodyFromClient.ProjectIntro = ;

        //setProject(company, projectName, year, semester, intro, about, approach, tech, teamMembers, yt, github)
        //console.log(project)
    }

    return (
        <div>
        
            <form className='projectsubmitform' onSubmit={handleSubmit }>
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
                            placeholder='Select year project was completed'
                        />
                    </MDBCol>
                    <MDBCol>
                        <Select
                            id = 'semester'
                            className="basic-single"
                            classNamePrefix="select"
                            isClearable
                            isSearchable
                            name="year"
                            options={semester}
                            placeholder='Select semester project was completed'
                        />
                    </MDBCol>
                </MDBRow>
             <MDBTextArea label='Project introduction' id='intro' className='textAreaExample' rows={2} />
            <MDBTextArea label='Tell us about your project' id='about' className='textAreaExample' rows={4} />
            <MDBTextArea label='Tell us about your project approach' id='approach' className='textAreaExample' rows={4} />
            
            <CreatableSelect id='tech' isMulti options={technologies} onChange={handleChange} placeholder='Select from the drop down or type' />
            <CreatableSelect id='teamMembers' isMulti onChange={handleChange} placeholder='Type names' />

            <MDBInput label='Github Link' id='github' type='url' />
            <MDBInput label='Youtube demo link' id='yt' type='url' />

                <label for="formFileMultiple" class="form-label">Upload screenshots of your project</label>
                <input class="form-control" type="file" id="formFileMultiple" multiple maxNumber={ maxnumber} />

            <MDBBtn className='mb-4' type='submit' block>
                Submit Project!
            </MDBBtn>
            </form>
        </div>
    );
}