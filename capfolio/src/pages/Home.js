import React from "react";
import Search from "../Search";
import Sidebar from "../Sidebar";
import ProjectGallery from "../ProjectGallery";


const Home = () =>{
    return (
    <div>
        <Search />
        <Sidebar />
        <ProjectGallery />
    </div>
    )
};

export default Home;