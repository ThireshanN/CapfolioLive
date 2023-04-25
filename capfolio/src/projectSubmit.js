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

    const [selectYear, setSelectedYear] = useState("")
    const [selectSem, setSelectSem] = useState("")
    const [selectTeam, setSelectTeam] = useState([])
    const [selectTech, setSelectTech] = useState([])

    var handleYearChange = (selectYear) => {
        setSelectedYear(selectYear.value)
    }

    var handleSemChange = (selectSem) => {
        setSelectSem(selectSem.value)
    }

    var handleTeamChange = (selectTeam) => {
        
        setSelectTeam(selectTeam.value)
        console.log(selectTeam)
    }

    var handleTechChange = (selectTech) => {
        setSelectTech(selectTech.value)
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


    const maxnumber = 3;
    const handleSubmit = (e) => {
        e.preventDefault();
        let project = []

        e.preventDefault();
        let newProject = {
            company: document.getElementById('company').value,
            projectName: document.getElementById('projectName').value,
            year: [],
            semester: [],
            intro: document.getElementById('intro').value,
            about: document.getElementById('about').value,
            approach: document.getElementById('approach').value,
            tech: [{}],
            teamMembers: [{}],
            yt: document.getElementById('yt').value,
            github: document.getElementById('github').value,
        }

        

        newProject['year'].push(selectYear)
        newProject['tech'].push(selectTech)
        newProject['teamMembers'].push(selectTeam)
        newProject['semester'].push(selectSem)

        project.push(newProject)
        
        console.log(project)
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
                            placeholder='Select year project was completed'
                            onChange={handleYearChange }
                        />
                    </MDBCol>
                    <MDBCol>
                        <Select
                            id='semester'
                            className="basic-single"
                            classNamePrefix="select"
                            isClearable
                            isSearchable
                            name="year"
                            options={semester}
                            placeholder='Select semester project was completed'
                            onChange={handleSemChange }

                        />
                    </MDBCol>
                </MDBRow>
                <MDBTextArea label='Project introduction' id='intro' className='textAreaExample' rows={2} />
                <MDBTextArea label='Tell us about your project' id='about' className='textAreaExample' rows={4} />
                <MDBTextArea label='Tell us about your project approach' id='approach' className='textAreaExample' rows={4} />

                <CreatableSelect id='tech' isMulti options={technologies} onChange={handleTechChange} placeholder='Select from the drop down or type' />
                <CreatableSelect id='teamMembers' isMulti onChange={handleTeamChange} placeholder='Type names' />

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