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
import CodeConfirmation from "./pages/CodeConfirmation";
import ResetPassword from "./pages/ResetPassword";
import PasswordResetCode from "./pages/PasswordResetCode";
import Admin from "./Admin";
import AdminProjectView from "./AdminProjectView";
import ViewStudentProfile from "./pages/viewStudentProfile";


function App() {
  return (
    <AuthProvider>
      <Navbar />
    
        <ScrollToTop>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="profile/:id" element={<ViewStudentProfile/>}/>
          <Route path="/project-view/:id" element={<ProjectView />} />
          <Route path="/project-submit" element={<ProjectSubmit />} />
          <Route path="/Code-Confirmation" element={<CodeConfirmation />} />
          <Route path="/Rest-Password" element={<ResetPassword />} />
          <Route path="/Email-Password" element={<PasswordResetCode />} />
          <Route path="/Admin-Page" element={<Admin />} />
          <Route path="/Admin-project-view/:id" element={<AdminProjectView />} />
        </Routes>
        </ScrollToTop>
        {/* </div>
        </div>
      // </div> */}
    </AuthProvider>
  )
}

export default App;
