import './Search.css';
import { React, useState, classes } from "react";
import TextField from "@mui/material/TextField";
// import List from "./components/List"
import "./App.css";
// import { createTheme } from '@mui/material/styles';
// import { indigo } from '@mui/material/colors';
import SearchBar from './components/SearchBar';

// const theme = createTheme({
//     palette: {
//       primary: {
//         main: '#42a5f5',
//       },
//       secondary: indigo,
//     },
//   })

const Search = () => {

      const handleSearch = (searchTerm) => {
        console.log('Search:', searchTerm);
      };

      return (
        <div className="search-bg">
                    <div className="illu"><img src={require('./images/capfolio-illu.png')}  alt="Logo" draggable='false'/></div>
            <div className='headline'>A home dedicated to <br></br>showcasing bright futures</div>
            <div className="webzen-logo"><p>Made by the team at</p><img src={require('./images/webzen-logo-white.png')}  alt="Logo" /></div>

            <div className="main">
              <div className="search"> 
                <SearchBar onSearch={handleSearch} />
                  {/* <TextField
                  id="outlined-basic"
                  variant="filled"
                  color="primary"
                  sx={{
                      backgroundColor : 'white',
                  }}
                  fullWidth
                  label="Search"
                  /> */}
              </div> 
          </div>
        
        </div>
      
      );
    };
    
  export default Search;
  