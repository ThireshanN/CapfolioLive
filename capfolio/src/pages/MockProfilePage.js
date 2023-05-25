import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import './Profile.css';
import redHeartImage from '../images/red-heart.png';
import { Link } from "react-router-dom";
import icon from '../images/avatar.png';
import { Drawer, Avatar, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [profession, setProfession] = useState('Software Engineer');
    const [github, setGithub] = useState('https://github.com');
    const [linkedin, setLinkedin] = useState('https://linkedin.com');
    const [description, setDescription] = useState('I am a CompSci student at the University of Auckland and I have taken COMPSCI399 in 2023 Semester 1.');
    const [picture, setPicture] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:3000/auth/user');

                if (!response.ok) {
                    throw new Error('User not authenticated');
                }

                const userData = await response.json();
                setName(`${userData.FirstName} ${userData.LastName}`);
                setPicture(userData.Photo)
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchUserData();
    }, []);

    const handleSave = () => {
        console.log({
            name: name,
            profession: profession,
            github: github,
            linkedin: linkedin,
            description: description,
            picture: picture
        });

        setIsEditing(false);
    };

    return (
        <div>
        {/* Side panel */}
        <Drawer variant="permanent" PaperProps={{
            sx: { width: "30%" },
          }}>
        <div className="SidePanel">
            <div className="ProfileDetails" sx={{ p: 2 }}>
                <Avatar alt="Profile Image" src={picture} sx={{ width: 80, height: 80 }} />
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>{name}</Typography>
                <Typography variant="body2">{profession}</Typography>
                <p>{description}</p>
            </div>
            <List sx={{ mt: 2 }}>
                <ListItem button component="a" href={github} target="_blank" rel="noreferrer">
                    <ListItemIcon>
                        <GitHubIcon />
                    </ListItemIcon>
                    <ListItemText primary="GitHub" />
                </ListItem>
                <ListItem button component="a" href={linkedin} target="_blank" rel="noreferrer">
                    <ListItemIcon>
                        <LinkedInIcon />
                    </ListItemIcon>
                    <ListItemText primary="LinkedIn" />
                </ListItem>
            </List>
        </div>
    </Drawer>
    </div>
    );
}

export default Profile;
