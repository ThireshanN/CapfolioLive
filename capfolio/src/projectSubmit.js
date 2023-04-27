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
        { value: "1", label: "Semester One" },
        { value: "2", label: "Semester Two" },

    ];

    const maxnumber = 3

    const handleSubmit = (e) => {
        e.preventDefault();

        const TeamName = document.getElementById('company').value;
        const projectName = document.getElementById('projectName').value;
        const capstoneYear = selectedYears;
        const capstoneSemester = selectedSemesters;
        const ProjectIntro = document.getElementById('intro').value;
        const Project_About = document.getElementById('about').value;
        const Project_Approach = document.getElementById('approach').value;
        const tech = selectedTechnologies;
        const teamMembers = selectedTeam;
        const VideoLink = document.getElementById('yt').value;
        const githubLink = document.getElementById('github').value;

        const string = String.raw`C:\Development\profile\aboutme.html`;
        console.log(string)
        let newstring = string.split('\\').join('/');
        console.log(newstring)
        //Puts the objects into an array
        const arrayTech = [];

        tech.forEach(e => arrayTech.push(e.label))

        const usersArray = []
        teamMembers.forEach(e => usersArray.push(e.label))
     
        
        console.log(capstoneSemester)
        let semesterString = capstoneSemester.label;

        if (semesterString == 'Semester One') {
            semesterString = 1
        }
        else {
            semesterString = 2
        }



        let yearString = capstoneYear.value;


        const data2 = {
            "ProjectName": "'" + projectName + "'",
            "IsApproved": 0,
            "projectDec": "'" + Project_About+ "'" ,
            "githubLink": "'" + githubLink + "'",
            "capstoneYear": "'" + yearString + "'",
            "capstoneSemester": semesterString,
            "adminID_FK": 7,
            "TeamName": TeamName,
            "VideoLink": "'" + VideoLink + "'",
            "ProjectIntro": "'" + ProjectIntro + "'",
            "Project_Approach": "'" + Project_Approach + "'",
            "Files": [],
            "Technologies": arrayTech,
            "Users": usersArray
        }

        console.log(JSON.parse(JSON.stringify(data2)));



        const data = {
            "ProjectName": "'woofs'",
            "IsApproved": 0,
            "projectDec": "'progressive web application'",
            "githubLink": "'http: //github.com'",
            "capstoneYear": "'2022'",
            "capstoneSemester": 1,
            "adminID_FK": 7,
            "TeamName": "'Animal'",
            "VideoLink": "'https: //www.youtube.com'",
            "ProjectIntro": "'Our goal is to create'",
            "Project_Approach": "'Our goal is to create'",
            "Files": [],
            "Technologies": ["TypeScript", "HTML", "CSS", "React"],
            "Users": [
                { "FirstName": "Jim", "lastName": "SuperMarioFamily" },
                { "FirstName": "Pam", "lastName": "SuperMarioFamily" },
                { "FirstName": "Dwight", "lastName": "SuperMarioFamily" },
                { "FirstName": "Kevin", "lastName": "SuperMarioFamily" }]
        }
        const body = JSON.parse(JSON.stringify(data))
        console.log(JSON.parse(JSON.stringify(data)));



        fetch('/project/FormAddProject', {
            method: 'POST',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: {

                body
                //"ProjectName": projectName,
                //"IsApproved": 0,
                //"projectDec": Project_About,
                //"githubLink": githubLink,
                //"capstoneYear": capstoneYear,
                //"capstoneSemester": capstoneSemester,
                //"adminID_FK": 7,
                //"TeamName": TeamName,
                //"VideoLink": VideoLink,
                //"ProjectIntro": ProjectIntro,
                //"Project_Approach": Project_Approach,
                //"Files": [],
                //"Technologies": tech,
                //"Users": teamMembers

            }
        }).then(() => {
            console.log('ProjectAdded')

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
                <CreatableSelect id='teamMembers' components={animatedComponents} isMulti onChange={handleChangeTeam} placeholder="type UPI's of students involved in this project" />

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