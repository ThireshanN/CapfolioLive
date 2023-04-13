import './Sidebar.css';
import React, { useState } from "react";
import Select from 'react-select'
//import "./App.css";
import "bootstrap/dist/css/bootstrap.css";


const Sidebar = () => {
    const years = [
      { value: "blues", label: "2020" },
      { value: "rock", label: "2021" },
      { value: "jazz", label: "2022" },
      { value: "orchestra", label: "2023" },
    ];

    const semester = [
        { value: "blues", label: "Semester One" },
        { value: "rock", label: "Semester Two" },
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
    
  
    return (
      <div>
        <div class='filter-bg'>
            <div className="filters">
            <h3>Filter</h3>
        <div className="row">
            <div className="mt-1 me-auto w-25 col-xs-6">
                <p>Date Range</p>
                <p>From</p>
                <Select placeholder={<div>Year</div>} options={years} />
            </div>
            <div className="mt-1 me-auto w-25 col-xs-6">
                <p><br></br></p>
                <p><br></br></p>
                <Select placeholder={<div>Semester</div>} options={semester} />
            </div>
            <div className="mt-1 me-auto w-25 col-xs-6">
            <p><br></br></p>
                <p>To</p>
                <Select placeholder={<div>Year</div>} options={years} />
            </div>
            <div className="mt-1 me-auto w-25 col-xs-6">
            <p><br></br></p>
                <p><br></br></p>
                <Select placeholder={<div>Semester</div>} options={semester} />
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
      </div>
    );
  };
  
  export default Sidebar;