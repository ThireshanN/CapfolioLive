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

    const startSemester = [
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

      const sortBy = [
        { value: "blues", label: "Latest to oldest" },
        { value: "none", label: "Oldest to latest" },
        { value: "jazz", label: "Highest to lowest likes" },
        { value: "rock", label: "Lowest to highest Likes" },
        { value: "alphabetD", label: "Alphabetical (A - Z)" },
        { value: "alphabetA", label: "Alphabetical (Z - A)" },



      ];

    const [selectedOption, setSelectedOption] = useState("");
    var handleChange = (selectedOption) => {
        console.log(selectedOption);
        setSelectedOption(selectedOption.value);
      };

      const [isClearable, setIsClearable] = useState(true);
      const [visible, setVisible] = useState(false)

      const animatedComponents = makeAnimated();

    return (
      <div>
  
        <div>
          <div className='filter-btn'>
            <CButton href="#" onClick={(event) => {
            event.preventDefault()
            setVisible(!visible)
            }}>
            Filter
            </CButton>
          </div>
          <CCollapse visible={visible}>
            <CCard className="mt-3">
              <CCardBody>
                <div class='filter-bg'>
                  <div className='bg-content-wrapper'>
                    <div className="filters">
                        <div className="row">
                            <div className="mt-3 me-0 w-25 col-xs-6">
                                <p>Years</p>
                                <Select placeholder={<div>Years...</div>} components={animatedComponents} isMulti onChange={handleChange} options={startYears} />
                            </div>
                            <div className="mt-3 me-0 w-25 col-xs-6">
                                <p>Semesters</p>
                                <Select placeholder={<div>Semesters...</div>} components={animatedComponents} isMulti onChange={handleChange} options={startSemester} />
                            </div>
                            <div className="mt-3 me-0 w-25 col-xs-6">
                                <p>Technologies</p>
                                <Select placeholder={<div>Made with...</div>} components={animatedComponents} isMulti onChange={handleChange} options={technologies} />
                            </div>
                            <div className="mt-3 me-0 w-25 col-xs-6">
                                <p>Awards</p>
                                <Select placeholder={<div>Awarded with...</div>} components={animatedComponents} isMulti onChange={handleChange} options={awarded} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="mt-3 me-0 w-50 col-xs-6">
                                <p>Sort by</p>
                                <Select
                                  defaultValue={{ label: "Latest to oldest", value: "blues" }}
                                  className="basic-single"
                                  classNamePrefix="select"
                                  name="color"
                                  options={sortBy}
                                />
                          </div>
                        </div>
                      </div>
                    <div className='apply-filter-btn-wrapper'>
                      <CButton className='apply-filter-btn'>Apply Filter</CButton>
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