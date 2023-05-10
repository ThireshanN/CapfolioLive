import './Search.css';
import { React, useState, classes } from "react";
import "./App.css";
import SearchBar from './components/SearchBar';


const Search = ({ onApplySearch }) => {

  const handleSearch = (searchTerm) => {
    onApplySearch(searchTerm)
  };

  return (
    <div className="search-bg">
      <div className="illu"></div>
      {/* <div className="illu"><img src={require('./images/home-imgv2.png')} alt="Logo" draggable='false' /></div> */}
      <div className='headline'>A home dedicated to showcasing <span className='bright'>bright</span> futures</div>
      <div className="webzen-logo"><p>Made by the team at WebZen</p></div>
      {/* <img src={require('./images/webzen-logo-black.png')} alt="Logo" /> */}

      <div className="main">
        <div className="search">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

    </div>

  );
};

export default Search;
