import './Search.css';
import { React, useState, classes } from "react";
import "./App.css";
import SearchBar from './components/SearchBar';


const Search = () => {

  const handleSearch = (searchTerm) => {
    console.log('Search:', searchTerm);
  };

  return (
    <div className="search-bg">
      <div className="illu"><img src={require('./images/capfolio-illu.png')} alt="Logo" draggable='false' /></div>
      <div className='headline'>A home dedicated to showcasing <span className='bright'>bright</span> futures</div>
      <div className="webzen-logo"><p>Made by the team at</p><img src={require('./images/webzen-logo-white.png')} alt="Logo" /></div>

      <div className="main">
        <div className="search">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

    </div>

  );
};

export default Search;
