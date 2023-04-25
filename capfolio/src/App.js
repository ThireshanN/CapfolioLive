import Navbar from "./Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import { Route, Routes } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import ProjectView from "./projectView";
import ScrollToTop from "./ScrollToTop";
import { AuthProvider } from "./AuthContext";
import Profile from "./pages/Profile";
import ProjectSubmit from "./projectSubmit";


function App() {
  return (
    <AuthProvider>
      <Navbar />
      {/* <div className="container">
      <div className="auth-wrapper">
        <div className="auth-inner"> */}
        <ScrollToTop>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/project-view/:id" element={<ProjectView />} />
          <Route path="/project-submit" element={<ProjectSubmit />} />
        </Routes>
        </ScrollToTop>
        {/* </div>
        </div>
      // </div> */}
    </AuthProvider>
  )
}

export default App;
