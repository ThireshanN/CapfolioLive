import './Sidebar.css';
import React, { useState, useMemo, useRef  } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
//import "./App.css";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import { Collapse, CButton, CCollapse,  CCard, CCardBody } from '@coreui/react';



const Sidebar = () => {
    const startYears = [
      { value: "2020", label: "2020" },
      { value: "2021", label: "2021" },
      { value: "2022", label: "2022" },
      { value: "2023", label: "2023" },
    ];


    const endYears = [
        { value: "2020", label: "2020" },
        { value: "2021", label: "2021" },
        { value: "2022", label: "2022" },
        { value: "2023", label: "2023" },
      ];

      const options2021 = [
        { value: "2021", label: "2021" },
        { value: "2022", label: "2022" },
        { value: "2023", label: "2023" },
      ];

      const options2022 = [
        { value: "2022", label: "2022" },
        { value: "2023", label: "2023" },
      ];

      const options2023 = [
        { value: "2023", label: "2023" },
      ];

    const startSemester = [
        { value: "SemesterOne", label: "Semester One" },
        { value: "SemesterTwo", label: "Semester Two" },
      ];

      const endSemester = [
        { value: "SemesterOne", label: "Semester One" },
        { value: "SemesterTwo", label: "Semester Two" },
      ];

    const technologies = [
        { value: "blues", label: "React" },
        { value: "rock", label: "Javascript" },
        { value: "jazz", label: "HTML" },
        { value: "orchestra", label: "C#" },
      ];

      const awarded = [
        { value: "none", label: "None" },
        { value: "blues", label: "Excellence Award" },
        { value: "rock", label: "Community Award" },
        { value: "jazz", label: "People's Choice Award" },
      ];

    const [selectedOption, setSelectedOption] = useState("");
    var handleChange = (selectedOption) => {
        console.log(selectedOption);
        setSelectedOption(selectedOption.value);
      };

      const [isClearable, setIsClearable] = useState(true);
      const [visible, setVisible] = useState(false)

    return (
      <div>
 
      <div>
        <CButton href="#" onClick={(event) => {
        event.preventDefault()
        setVisible(!visible)
        }}>
        Filter
        </CButton>

        <CCollapse visible={visible}>
      <CCard className="mt-3">
        <CCardBody>
          <div class='filter-bg'>
            <div className="filters">
            {/* <h3>Filter</h3> */}
        <div className="row">
            <div className="mt-1 me-auto w-25 col-xs-3">
                <p>Date Range</p>
                <p>From</p>
                <Select placeholder={<div>Year</div>} isClearable={isClearable} options={startYears} />
            </div>
            <div className="mt-1 me-auto w-25 col-xs-3">
                <p><br></br></p>
                <p><br></br></p>
                <Select placeholder={<div>Semester</div>} isClearable={isClearable} options={startSemester} />
            </div>
            <div className="mt-1 me-auto w-25 col-xs-3">
            <p><br></br></p>
                <p>To</p>
                <Select placeholder={<div>Year</div>} isClearable={isClearable} options={endYears} />
            </div>
            <div className="mt-1 me-auto w-25 col-xs-3">
            <p><br></br></p>
                <p><br></br></p>
                <Select placeholder={<div>Semester</div>} isClearable={isClearable} options={endSemester} />
            </div>
        </div>
        <div className="row">
            <div className="mt-5 me-auto w-50 col-xs-6">
                <p>Technologies</p>
                <Select placeholder={<div>Made with...</div>} isMulti onChange={handleChange} options={technologies} />
            </div>
            <div className="mt-5 me-auto w-50 col-xs-6">
                <p>Awards</p>
                <Select placeholder={<div>Awarded with...</div>} isMulti onChange={handleChange} options={awarded} />
            </div>
        </div>
        </div>
      </div>
        </CCardBody>
      </CCard>
    </CCollapse>
    </div> 
      </div>
 
    );
  };
  
  export default Sidebar;