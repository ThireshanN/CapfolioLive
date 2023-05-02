import {
    MDBBtn, MDBCol,
    MDBInput, MDBRow, MDBTextArea
} from 'mdb-react-ui-kit';
import React, { useState } from 'react';
import Select from 'react-select';
import makeAnimated from "react-select/animated";
import CreatableSelect from 'react-select/creatable';
import './projectSubmit.css';
import { Buffer } from "buffer";
import S3FileUpload from "react-s3";
import AWS from "aws-sdk";


const bucketName='capfoliostorage';
const bucketRegion = "ap-southeast-2";
const accessKeyId= 'AKIAUDUQU75VEF3VDCEL';
const secretAccessKey= '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';

const s3 = new AWS.S3({
    region: bucketRegion,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
});


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
    

    const config = {
        bucketName: 'capfoliostorage',
        region: "ap-southeast-2",
        accessKeyId: 'AKIAUDUQU75VEF3VDCEL',
        secretAccessKey: '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',
    }

    const animatedComponents = makeAnimated();

    //Has all the set states 
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



    const [images, setImages] = useState([]);
    const handleImageChange = (event) => {
        const selectedImages = Array.from(event.target.files);
        setImages([...images, ...selectedImages]);
    };
    const handleRemoveImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };


    const handleSubmit = async (event) => {

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

 
       
        let newLink = VideoLink.replace("watch?v=", "embed/");



        fetch('/project/FormAddProject', {
            method: 'POST',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                "ProjectName": "'" + projectName + "'",
                "IsApproved": 0,
                "projectDec": "'" + Project_About + "'",
                "githubLink": "'" + githubLink + "'",
                "capstoneYear": "'" + yearString + "'",
                "capstoneSemester": semesterString,
                "adminID_FK": 7,
                "TeamName": "'" + TeamName + "'",
                "VideoLink": "'" + newLink + "'",
                "ProjectIntro": "'" + ProjectIntro + "'",
                "Project_Approach": "'" + Project_Approach + "'",
                //"Files": files,
                "Technologies": arrayTech,
                "Users": usersArray
            })
        }).then(() => {
            console.log('ProjectAdded')

        })


        const promises = images.map(async (image) => {
            console.log(image)
            const filename = image.name;
            const key = '' + TeamName + "/" +filename ;
            const params = {
                Bucket: bucketName,
                Key: key,
                Body: image,
                ContentType: "image/*"
            };

            try {
                const data = await s3.upload(params).promise();
                return data;
            } catch (err) {
                console.error(err);
            }
        });

        try {
            const results = await Promise.all(promises);
            console.log(results);
        } catch (err) {
            console.error(err);
        }


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
                    {images.map((url, index) => (
                        <div key={index} >
                            <img className='thumbnail' src={URL.createObjectURL(url)} alt={`Thumbnail ${index}`} />
                            <button onClick={() => handleRemoveImage(index)}>Remove</button>                </div>
                    ))}
                </div>

                <MDBBtn className='mb-4' type='submit' block>
                    Submit Project!
                </MDBBtn>
            </form>



        </div>
    );
}