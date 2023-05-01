import React, { useState, useEffect, useRef } from 'react';
import './projectView.css';
import redheart from './images/red-heart.png';
import avatar from './images/avatar.png';
import mainImage from './images/homepage-mockup.png';
import secondimage from './images/secondimage.png';
import thirdimage from './images/thirdimage.png';
import submitcomment from './images/send-button.png'
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import LikeButton from "./components/likeButton";
import { CButton, } from '@coreui/react';
import { withTheme } from '@emotion/react';
import gitHubLogo from './images/github-mark-white.png';
import { useParams } from 'react-router-dom';
import {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBTextArea
} from 'mdb-react-ui-kit';



const ProjectView = () => {
    const params = useParams();
    const [comments, setComments] = useState('');
    const [projects, setProject] = useState('');
    const [tech, setTech] = useState('');

    // const blueBoxRef = useRef();


    const getProject = async () => {
     

        const response = await fetch(
            "/projects/project?id=" + params.id
        ).then((response) => response.json());


        console.log(response)

        let string = response[0].technologies.split(",");
        setProject(response)

        setTech(string)        
    };


    // Function to collect data
    const getComments = async () => {
        const response = await fetch(
            "/projects/comment?id=" + params.id
        ).then((response) => response.json());

        setComments(response);
    };



    

    
    const handleSubmit = (e) => {
        e.preventDefault();
        var CommentDesc = document.getElementById('comment').value
     
        
        fetch('/projects/PostComment?id=' + params.id, {
            method: 'POST',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                "CommentDesc": CommentDesc,
             
            })
        }).then(() => {
            console.log('comment Added')
            getComments();

        })
        document.getElementById('comment').value = ''
    };


    useEffect(() => {
        getComments();
    }, []);
    
    useEffect(() => {
        getProject();
    }, []);
    



    const buttonStyle = {
        width: "30px",
        background: 'none',
        border: '0px',
        class: 'arrows'

    };

    const properties = {
        prevArrow: <button style={{ ...buttonStyle }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#fff"><path d="M242 180.6v-138L0 256l242 213.4V331.2h270V180.6z" /></svg></button>,
        nextArrow: <button style={{ ...buttonStyle }}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#fff"><path d="M512 256L270 42.6v138.2H0v150.6h270v138z" /></svg></button>
    }

    


    const Example = () => {

        return (
            <Slide indicators={true} duration={2000} className='slideshow' {...properties}>

                <div className="each-slide-effect">
                    <div style={{ 'backgroundImage': `url(${mainImage})` }}>

                    </div>
                </div>
                <div className="each-slide-effect">
                    <div style={{ 'backgroundImage': `url(${secondimage})` }}>

                    </div>
                </div>
                <div className="each-slide-effect">
                    <div style={{ 'backgroundImage': `url(${thirdimage})` }}>

                    </div>
                </div>
            </Slide>

        );
    };



    const Header = ({ project }) => {
        return (
            <div className='centerTitle'>
                <p className='projecttitle'>{project.ProjectName}</p>

                <div className="names">
                    <p className='companyname'>By  {project.TeamName} -&nbsp;</p>

                    {/*{project.authors.map((name, i) =>*/}
                    {/*    <div classname='name'>*/}
                    {/*        <p key={`key${i}`}>{name},&nbsp;</p>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>


                <div className='techUsed'>

             


                    { tech && tech.map((tech, i) =>
                        <div className='tech'>
                            <p key={`Key${i}`}>{tech}</p>
                        </div>
                    )}
                </div>

                <div className='pv-buttons'>
                    <CButton>  <a href={project.githubLink} target="_blank"> <img src={gitHubLogo}></img>  GitHub</a></CButton>
                    <div>
                        <div className='pv-likeButton'>
                            <LikeButton likenumber={params.id}/>
                            
                        </div>
                    </div>
                </div>

            </div>
        );
    };

    


    



    //Used to set bluebox height to size according to right column
    // const rightColumnRef = useRef();
    // const blueBoxRef = useRef();

    // useEffect(() => {
    //     const marginTop = parseFloat(window.getComputedStyle(rightColumnRef.current).marginTop);
    //     const rightColumnHeight = rightColumnRef.current.offsetHeight + marginTop + 20;
    //     blueBoxRef.current.style.setProperty('--right-column-height', `${rightColumnHeight}px`);
    // }, []);
    const rightColumnCallbackRef = (node) => {
        if (node) {
            const marginTop = parseFloat(window.getComputedStyle(node).marginTop);
            const rightColumnHeight = node.offsetHeight + marginTop + 20;
            const blueBoxElement = document.querySelector('.bluebox');
            if (blueBoxElement) {
                blueBoxElement.style.setProperty('--right-column-height', `${rightColumnHeight}px`);
            }
        }
    };
    
    // const blueBoxCallbackRef = (node) => {
    //     if (node) {
    //         blueBoxRef.current = node;
    //     }
    // };

    return (
        <div>
        
        
            <div className='bluebox-top'></div>
            <div className='bluebox' style={{ '--right-column-height': 'auto' }}>
                <div className='p-row'>
                    <div className='column headerleft'>
                        <div className='image'>
                            <Example />
                        </div>
                    </div>
                    <div className='column headerright' ref={rightColumnCallbackRef}>
                        <div className='teammembers'>
                            {projects && projects.map((project) => (
                                <Header key={project.id} project={project} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className='projectInformation-wrapper'>
                <div className='projectInformation'>
                    <h2>About {projects && projects.map((project) => project.ProjectName)}</h2>

                  
                    <p className='about'>{projects && projects.map((project) => project.ProjectIntro)} </p>
                    <h2>Project Approach</h2>
                    <p className='projectApproach'>{projects && projects.map((project) => project.Project_Approach)}</p>
                    (<iframe width="100%" height="400vw" allowfullscreen src={projects && projects.map((project) => project.VideoLink)}>
                    </iframe >)
                    
                </div>
            </div>


            {/* <div className="column right">  */}

            <div className='commentbox'>

                <div className='comments'>
                    <div className='commentheading'>
                        <h2>Comments</h2>

                    </div>
                    <div className='writecomment'>


                        <form onSubmit={handleSubmit}>


                            <MDBTextArea label='Write your comment here' id='comment' className='textAreaExample' rows={4} required onSubmit={handleSubmit} />

                            <button className='sendcomment'>
                                <CButton>Post Comment</CButton>
                            </button>
                        </form>


                    </div>

                    <div className='showcomments'>
                        {comments &&
                            comments.map((comment) => (

                                <div className='comment'>
                                    <div className='commentDetails'>
                                        <img className='comment-avatar' src={avatar} alt="avatar"></img>
                                        <p className='commentname'>{comment.FirstName}</p>

                                        <p className='commentUsertype'>{comment.UserType}</p>
                                        <p className='commentdate'>{comment.createdTime}</p>
                                    </div>
                                    <p className='commenttext'>{comment.CommentDesc}</p>
                                </div>
                            ))}

                    </div>
                </div>

            </div>

        </div>
        //     </div>
        // </div>


    );
};


export default ProjectView;