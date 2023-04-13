import './Search.css';
import { React, useState, classes } from "react";
import TextField from "@mui/material/TextField";
//import List from "./Components/List"
//import "./App.css";
import { createTheme } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';

const theme = createTheme({
    palette: {
      primary: {
        main: '#42a5f5',
      },
      secondary: indigo,
    },
  })

const Search = () => (
    <div className="search-bg">
        <div className='headline'>A home dedicated to <br></br>showcasing bright futures</div>
        <div className="webzen-logo"><p>Made by the team at</p><img src={require('./webzen-logo-white.png')}  alt="Logo" /></div>
        <div className="illu"><img src={require('./capfolio-illu.png')}  alt="Logo" draggable='false'/></div>
        <div className="main">
        <div className="search">
            <TextField
            id="outlined-basic"
            variant="filled"
            color="primary"
            sx={{
                backgroundColor : 'white',
            }}
            fullWidth
            label="Search"
            />
        </div> 
    </div>
    
    </div>
    
  );

  export default Search;
  