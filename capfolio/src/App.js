import Navbar from "./Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import { Route, Routes } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import ProjectView from "./projectView";
function App() {
  return (
    <>
      <Navbar />
      {/* <div className="container">
      <div className="auth-wrapper">
        <div className="auth-inner"> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/project-view" element={<ProjectView />} />
        </Routes>
        {/* </div>
        </div>
      // </div> */}
    </>
  )
}

export default App;