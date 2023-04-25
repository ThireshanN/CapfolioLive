import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import './Profile.css';
import icon from '../images/icon.png';

function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [profession, setProfession] = useState('Software Engineer');
    const [github, setGithub] = useState('https://github.com');
    const [linkedin, setLinkedin] = useState('https://linkedin.com');
    const [description, setDescription] = useState('I am a CompSci student at the University of Auckland and I have taken COMPSCI399 in 2023 Semester 1.');
    const [picture, setPicture] = useState('');
    //alert("WTF");
    //alert("WTF");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:3000/auth/user');

                if (!response.ok) {
                    throw new Error('User not authenticated');
                }

                const userData = await response.json();
                setName(`${userData.FirstName} ${userData.LastName}`);
                setPicture(icon)

                //setPicture(userData.Photo === 'red-heart' ? redHeartImage : userData.Photo);
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
        <div className='auth-inner'>
            <div className="Profile">
                <div className="PictureContainer">
                    <img className="Picture" src={picture} alt="Profile" />
                </div>
                <div className="Info">
                    {isEditing ? (
                        <div>
                            <input
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                            <input
                                type="text"
                                value={profession}
                                onChange={(event) => setProfession(event.target.value)}
                            />
                            <input
                                type="text"
                                value={github}
                                onChange={(event) => setGithub(event.target.value)}
                            />
                            <input
                                type="text"
                                value={linkedin}
                                onChange={(event) => setLinkedin(event.target.value)}
                            />
                            <textarea
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                            ></textarea>
                            <button onClick={handleSave}>Save</button>
                        </div>
                    ) : (
                        <div>
                            <h1>{name}</h1>
                            <h3>{profession}</h3>
                            <div className="Links">
                                <a href={github} target="_blank" rel="noreferrer">
                                    Github
                                </a>
                                <a href={linkedin} target="_blank" rel="noreferrer">
                                    LinkedIn
                                </a>
                            </div>
                            <p>{description}</p>
                            <button onClick={() => setIsEditing(true)}>Edit</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;