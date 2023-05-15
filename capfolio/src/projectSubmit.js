import {
  MDBBtn,
  MDBCol,
  MDBInput,
  MDBRow,
  MDBTextArea,
} from "mdb-react-ui-kit";
import React, { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CreatableSelect from "react-select/creatable";
import "./projectSubmit.css";
import { Buffer } from "buffer";
import S3FileUpload from "react-s3";
import AWS from "aws-sdk";
import {
  Collapse,
  CButton,
  CCollapse,
  CListGroup,
  CListGroupItem,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CCardImage,
  CCardTitle,
  CCardText,
  CCardFooter,
} from "@coreui/react";

const bucketName = "capfoliostorage";
const bucketRegion = "ap-southeast-2";
const accessKeyId = "AKIAUDUQU75VEF3VDCEL";
const secretAccessKey = "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";

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
    bucketName: "capfoliostorage",
    region: "ap-southeast-2",
    accessKeyId: "AKIAUDUQU75VEF3VDCEL",
    secretAccessKey: "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",
  };

  function makeid(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
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
  };

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

  const [text1, setText1] = useState("");
  function handleText1Input(event) {
    const inputText = event.target.value;
    if (inputText.length <= 5000) {
      setText1(inputText);
    }
  }

  const [text2, setText2] = useState("");
  function handleText2Input(event) {
    const inputText = event.target.value;
    if (inputText.length <= 5000) {
      setText2(inputText);
    }
  }

  const [text3, setText3] = useState("");
  function handleText3Input(event) {
    const inputText = event.target.value;
    if (inputText.length <= 5000) {
      setText3(inputText);
    }
  }

  const counterClassName = (text) =>
    text.length >= 5000 ? "characterCount max" : "characterCount";

  const thumbnailClassName = (length) =>
    length < 1 ? "noDisplayThumbnail" : "AlldisplayThumbnail";

  const handleSubmit = async (event) => {
    event.preventDefault();
    const teamID = makeid(16);

    //Need to check teamID is unique.

    //------------------Format the data -----------------------------------------//

    const TeamName = document.getElementById("company").value;
    const projectName = document.getElementById("projectName").value;
    const capstoneYear = selectedYears;
    const capstoneSemester = selectedSemesters;
    const ProjectIntro = document.getElementById("intro").value;
    const Project_About = document.getElementById("about").value;
    const Project_Approach = document.getElementById("approach").value;
    const tech = selectedTechnologies;
    const teamMembers = selectedTeam;
    const VideoLink = document.getElementById("yt").value;
    const githubLink = document.getElementById("github").value;

    const arrayTech = [];
    const usersArray = [];

    tech.forEach((e) => arrayTech.push(e.label));

    for (let i = 0; i < arrayTech.length; i++) {
      arrayTech[i] = arrayTech[i].replace(/'/g, '"');
    }

    teamMembers.forEach((e) => usersArray.push(e.label));
    for (let i = 0; i < usersArray.length; i++) {
      usersArray[i] = usersArray[i].replace(/'/g, '"');
    }

    let yearString = capstoneYear.value;

    let semesterString = capstoneSemester.label;
    if (semesterString == "Semester One") {
      semesterString = 1;
    } else {
      semesterString = 2;
    }

    let newLink = VideoLink.replace("watch?v=", "embed/");

    //------------------------------------------------------------//

    await fetch("/project/FormAddProject", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ProjectName: "'" + projectName + "'",
        IsApproved: 0,
        projectDec: "'" + Project_About + "'",
        githubLink: "'" + githubLink + "'",
        capstoneYear: "'" + yearString + "'",
        capstoneSemester: semesterString,
        adminID_FK: 7,
        TeamName: "'" + TeamName + "'",
        VideoLink: "'" + newLink + "'",
        ProjectIntro: "'" + ProjectIntro + "'",
        Project_Approach: "'" + Project_Approach + "'",
        Technologies: arrayTech,
        Users: usersArray,
      }),
    }).then(() => {
      const promises = images.map(async (image) => {
        const filename = image.name;
        const key = "" + TeamName + "/" + filename;
        const params = {
          Bucket: bucketName,
          Key: key,
          Body: image,
          ContentType: "image/*",
        };

        try {
          const data = await s3.upload(params).promise();
          return data;
        } catch (err) {
          console.error(err);
        }
      });

      try {
        const results = Promise.all(promises);
        console.log(results);
      } catch (err) {
        console.error(err);
      }
    });
  };

  return (
    <div>
      <form
        id="studentprojectSubmit"
        className="projectsubmitform"
        onSubmit={handleSubmit}
      >
        <CRow
          xs={{ cols: 1, gutter: 4 }}
          sm={{ cols: 1 }}
          md={{ cols: 1 }}
          lg={{ cols: 2 }}
          xl={{ cols: 2 }}
          xxl={{ cols: 2 }}
        >
          <CCol xs>
            <MDBInput id="company" label="Company Name" />
          </CCol>
          <CCol>
            <MDBInput id="projectName" label="Project Title" />
          </CCol>
        </CRow>

        <CRow
          xs={{ cols: 1, gutter: 4 }}
          sm={{ cols: 1 }}
          md={{ cols: 1 }}
          lg={{ cols: 2 }}
          xl={{ cols: 2 }}
          xxl={{ cols: 2 }}
        >
          <CCol xs>
            <Select
              id="year"
              className="basic-single"
              classNamePrefix="select"
              isClearable
              isSearchable
              name="year"
              options={years}
              components={animatedComponents}
              placeholder="Select year project was completed"
              onChange={handleChangeYears}
            />
          </CCol>
          <CCol>
            <Select
              id="semester"
              className="basic-single"
              classNamePrefix="select"
              isClearable
              isSearchable
              components={animatedComponents}
              name="year"
              options={semester}
              placeholder="Select semester project was completed"
              onChange={handleChangeSemesters}
            />
          </CCol>
        </CRow>

        <MDBTextArea
          label="Project introduction"
          id="intro"
          className="textAreaExample"
          rows={2}
          onInput={handleText1Input}
          value={text1}
        />
        <div className={counterClassName(text1)}>
          <p>{text1.length}/5000</p>
        </div>

        <MDBTextArea
          label="Tell us about your project"
          id="about"
          className="textAreaExample"
          rows={4}
          onInput={handleText2Input}
          value={text2}
        />
        <div className={counterClassName(text2)}>
          <p>{text2.length}/5000</p>
        </div>

        <MDBTextArea
          label="Tell us about your project approach"
          id="approach"
          className="textAreaExample"
          rows={4}
          onInput={handleText3Input}
          value={text3}
        />
        <div className={counterClassName(text3)}>
          <p>{text3.length}/5000</p>
        </div>

        <CreatableSelect
          className="formLinks"
          id="tech"
          isMulti
          components={animatedComponents}
          options={technologies}
          onChange={handleChangeTechnologies}
          placeholder="Select from the drop down or type the technologies you used in the project"
        />
        <CreatableSelect
          className="formLinks"
          id="teamMembers"
          components={animatedComponents}
          isMulti
          onChange={handleChangeTeam}
          placeholder="Type UPI's of students involved in this project - Please ensure all members are signed up with their UoA login"
        />

        <MDBInput
          className="formLinks"
          label="Github Link"
          id="github"
          type="url"
        />
        <MDBInput
          className="formLinks"
          label="Youtube demo link"
          id="yt"
          type="url"
        />
        <input
          className="formLinks"
          type="file"
          id="image-upload"
          name="image-upload"
          onChange={handleImageChange}
          multiple
        />

        <div className={thumbnailClassName(images.length)}>
          {images.map((url, index) => (
            <div key={index} className="displayImage">
              <img
                title="Click to delete"
                className="thumbnail"
                onClick={() => handleRemoveImage(index)}
                src={URL.createObjectURL(url)}
                alt={`Thumbnail ${index}`}
              />
            </div>
          ))}
        </div>

        <MDBBtn className="mb-4" type="submit" block>
          Submit Project!
        </MDBBtn>
      </form>
    </div>
  );
}
