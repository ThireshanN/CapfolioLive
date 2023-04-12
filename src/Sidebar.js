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
            <h2>Filter</h2>
        <div className="row">
            <div className="mt-1 me-auto w-50 col-xs-6">
                <p>Year</p>
                <Select options={years} />
            </div>
            <div className="mt-1 me-auto w-50 col-xs-6">
                <p>Semester</p>
                <Select options={semester} />
            </div>
        </div>
        <div className="row">
            <div className="mt-4 me-auto w-50 col-xs-6">
                <p>Technologies</p>
                <Select isMulti onChange={handleChange} options={technologies} />
            </div>
            <div className="mt-4 me-auto w-50 col-xs-6">
                <p>Awards</p>
                <Select isMulti onChange={handleChange} options={awarded} />
            </div>
        </div>
        </div>
      </div>
    );
  };
  
  export default Sidebar;