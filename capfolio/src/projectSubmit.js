import React, { useState, ChangeEvent, KeyboardEventHandler } from 'react';
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

    const [imageUrls, setImageUrls] = useState([]);


    const handleImageChange = (e) => {
        const files = e.target.files;
        const urls = [];

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = function (event) {
                urls.push(event.target.result);
                if (urls.length === files.length) {
                    setImageUrls([...imageUrls, ...urls]);
                }
            };
            reader.readAsDataURL(files[i]);
        }

        console.log(imageUrls)
   }
    

    function handleDelete(index) {
        setImageUrls(imageUrls.filter((_, i) => i !== index));
    }


    const handleSubmit = (event) => {

        event.preventDefault();
        
        const TeamName = document.getElementById('company').value;
        const projectName = document.getElementById('projectName').value;
        const capstoneYear = selectedYears;
        const capstoneSemester = selectedSemesters;
        const ProjectIntro = document.getElementById('intro').value;
        const Project_About = document.getElementById('about').value;
        const Project_Approach = document.getElementById('approach').value;
        const tech = selectedTechnologies;
        const teamMembers = selectedTeam;
        const files = imageUrls
        const VideoLink = document.getElementById('yt').value;
        const githubLink = document.getElementById('github').value;



        //const string = String.raw`C:\Development\profile\aboutme.html`;
        //let newstring = string.split('\\').join('/');




        //Puts the objects into an array
        const arrayTech = [];
        const usersArray = []

        tech.forEach(e => arrayTech.push(e.label))

        for (let i = 0; i < arrayTech.length; i++) {
            arrayTech[i] = arrayTech[i].replace(/'/g, "\"");
        }

        teamMembers.forEach(e => usersArray.push(e.label))
        for (let i = 0; i < usersArray.length; i++) {
            usersArray[i] = usersArray[i].replace(/'/g, "\"");
        }


        let yearString = capstoneYear.value;

        let semesterString = capstoneSemester.label;
        if (semesterString == 'Semester One') {
            semesterString = 1
        }
        else {
            semesterString = 2
        }


        for (let i = 0; i < files.length; i++) {
            files[i] = files[i].replace(/'/g, "\"");
        }

        const data2 = {
            "ProjectName": "'" + projectName + "'",
            "IsApproved": 0,
            "projectDec": "'" + Project_About + "'",
            "githubLink": "'" + githubLink + "'",
            "capstoneYear": "'" + yearString + "'",
            "capstoneSemester": semesterString,
            "adminID_FK": 7,
            "TeamName": TeamName,
            "VideoLink": "'" + VideoLink + "'",
            "ProjectIntro": "'" + ProjectIntro + "'",
            "Project_Approach": "'" + Project_Approach + "'",
            "Files": files,
            "Technologies": arrayTech,
            "Users": usersArray
        }
        const project = JSON.stringify(data2)
        console.log(project);



        fetch('/project/FormAddProject', {
            method: 'POST',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: {

                project
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
<input
        type="file"
        id="image-upload"
        name="image-upload"
        onChange={handleImageChange}
        multiple
      />


                <div className='displayThumbnail'>
                    {imageUrls.map((url, index) => (
                        <div key={index} >
                            <img className='thumbnail' src={url} alt={`Thumbnail ${index}`} />
                            <button onClick={() => handleDelete(index)}>Remove</button>                </div>
                    ))}
                </div>

                <MDBBtn className='mb-4' type='submit' block>
                    Submit Project!
                </MDBBtn>
            </form>



        </div>
    );
}