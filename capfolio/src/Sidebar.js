import "./Sidebar.css";
import React, { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import {
  Collapse,
  CButton,
  CCollapse,
  CCard,
  CCardBody,
} from "@coreui/react";


const Sidebar = () => {
    const startYears = [
      { value: "2020", label: "2020" },
      { value: "2021", label: "2021" },
      { value: "2022", label: "2022" },
      { value: "2023", label: "2023" },
    ];

    const startSemester = [
        { value: "Semester One", label: "Semester One" },
        { value: "Semester Two", label: "Semester Two" },
      ];


    const technologies = [
        { value: "React", label: "React" },
        { value: "Javascript", label: "Javascript" },
        { value: "HTML", label: "HTML" },
        { value: "C#", label: "C#" },
      ];

      const awarded = [
        { value: "None", label: "None" },
        { value: "Excellence Award", label: "Excellence Award" },
        { value: "Community Award", label: "Community Award" },
        { value: "People's Choice Award", label: "People's Choice Award" },
      ];

      const sortBy = [
        { value: "Latest to oldest", label: "Latest to oldest" },
        { value: "Oldest to latest", label: "Oldest to latest" },
        { value: "Highest to lowest likes", label: "Highest to lowest likes" },
        { value: "Lowest to highest Likes", label: "Lowest to highest Likes" },
        { value: "Alphabetical (A - Z)", label: "Alphabetical (A - Z)" },
        { value: "Alphabetical (Z - A)", label: "Alphabetical (Z - A)" },



      ];

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
    
      const [selectedAwards, setSelectedAwards] = useState([]);
      const handleChangeAwards = (selectedAwards) => {
        setSelectedAwards(selectedAwards);
      };

      const [selectedSortBy, setSelectedSortBy] = useState(null);
      const handleChangeSortBy = (selectedSortBy) => {
        setSelectedSortBy(selectedSortBy);
      };
    
      const handleApplyFilter = () => {
        const allSelectedOptions = [
          ...selectedYears,
          ...selectedSemesters,
          ...selectedTechnologies,
          ...selectedAwards,
        ];
        console.log("Selected Filters: ", allSelectedOptions);
        console.log("Sort By: ", selectedSortBy);
      };

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
                            <Select
                              placeholder={<div>Years...</div>}
                              components={animatedComponents}
                              isMulti
                              onChange={handleChangeYears}
                              options={startYears}
                            />
                          </div>
                          <div className="mt-3 me-0 w-25 col-xs-6">
                            <p>Semesters</p>
                            <Select
                              placeholder={<div>Semesters...</div>}
                              components={animatedComponents}
                              isMulti
                              onChange={handleChangeSemesters}
                              options={startSemester}
                            />
                          </div>
                          <div className="mt-3 me-0 w-25 col-xs-6">
                            <p>Technologies</p>
                            <Select
                              placeholder={<div>Made with...</div>}
                              components={animatedComponents}
                              isMulti
                              onChange={handleChangeTechnologies}
                              options={technologies}
                            />
                          </div>
                          <div className="mt-3 me-0 w-25 col-xs-6">
                            <p>Awards</p>
                            <Select
                              placeholder={<div>Awarded with...</div>}
                              components={animatedComponents}
                              isMulti
                              onChange={handleChangeAwards}
                              options={awarded}
                            />
                          </div>
                        </div>
                        <div className="row">
                            <div className="mt-3 me-0 w-50 col-xs-6">
                              <p>Sort by</p>
                              <Select
                                defaultValue={{ label: "Latest to oldest", value: "Latest to oldest" }}
                                className="basic-single"
                                classNamePrefix="select"
                                name="color"
                                onChange={handleChangeSortBy}
                                options={sortBy}
                              />
                            </div>
                        </div>
                      </div>
                      <div className="apply-filter-btn-wrapper">
                        <CButton className="apply-filter-btn" onClick={handleApplyFilter}>
                          Apply Filter
                        </CButton>
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