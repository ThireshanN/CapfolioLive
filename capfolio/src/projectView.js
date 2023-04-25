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


const projects = [

    {
        id: 1,
        title: 'Capfolio',
        description: 'Project1 is C++',
        image: 'https://via.placeholder.com/350x200',
        link: 'https://www.example.com',
        mainImage: 'public/homepage-mockup.png',
        authors: ["Josh Hanna", " Josephine Chen", 'Kristen Coupe', 'Medhavi Desai', 'Imashi Kinigama', 'Thireshan Naidoo'],
        tech: ["React", 'node.JS', 'AWS', 'C#'],
        companyName: 'WebZen',
        about: "In today's world, there are numerous real- world problems that still require solutions.One way for students to gain hands - on experience in tackling these challenges is through the capstone course.By taking part in this course, students can develop the computer science skills that are highly sought after by prospective employers.However, the in-person showcase at the end of the capstone course may have limitations in terms of reaching potential employers and clients.",
        projectApproach: "The project management methodology that will be used in this project is Scrum, which is an iterative and incremental framework that is based on the principles of Agile development. Our team will hold sprint planning meetings weekly, where the tasks for the upcoming week are planned.The tasks from the product backlog that our team created at the start will be completed in the current sprint. We have chosen Scrum as the project management methodology since it provides a framework for continuous improvement and encourages collaboration and communication among team members.In order to implement Scrum, we will be using Notion, as it provides a visual representation of the whole Scrum workflow.Each task that is created on Notion will be in the backlog until it is assigned to a team member.The task will then move along the board and finally reach the 'Done' state. The diagram on the following page shows our team's current workflow on Notion.",
        videolink: "https://www.youtube.com/embed/tgbNymZ7vqY",
        gitHubLink: 'https://github.com/uoa-compsci399-s1-2023/project-team-11',
    }
]


const ProjectView = () => {




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

                <div className='tech'>
                       <p>"React"</p>
                    </div>
                    <div className='tech'>
                        <p>"HTML"</p>
                    </div>
                    <div className='tech'>
                        <p>"JS"</p>
                    </div>


                    {/*{project.tech.map((tech, i) =>*/}
                    {/*    <div className='tech'>*/}
                    {/*        <p key={`Key${i}`}>{tech}</p>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>

                <div className='pv-buttons'>
                    <CButton>  <a href={project.githubLink} target="_blank"> <img src={gitHubLogo}></img>  GitHub</a></CButton>
                    <div>
                        <div className='pv-likeButton'>
                            <LikeButton />
                        </div>
                    </div>
                </div>

            </div>
        );
    };

    



    const [comments, setComments] = useState('');

    const params = useParams();
    const [projects, setProject] = useState('');

    // const blueBoxRef = useRef();

    const getProject = async () => {
     

        const response = await fetch(
            "/projects/project?id=" + params.id
        ).then((response) => response.json());


        console.log(response)
        setProject(response)
        
    };


    // Function to collect data
    const getComments = async () => {
        const response = await fetch(
            "/comment/getComments"
        ).then((response) => response.json());

        setComments(response);
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        var CommentDesc = document.getElementById('comment').value
        var userID = 1
        var projectID = 1

        fetch('/comment/PostComment', {
            method: 'POST',
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                "CommentDesc": CommentDesc,
                "UserID_FK": userID,
                "ProjectID_FK": projectID
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

            {/* <div className="rowcontent"> */}
            <div className='projectInformation-wrapper'>
                <div className='projectInformation'>
                    <h2>About {projects && projects.map((project) => project.ProjectName)}</h2>
                    <p className='about'>{projects && projects.map((project) => project.ProjectIntro)} </p>
                    <h2>Project Approach</h2>
                    <p className='projectApproach'>{projects && projects.map((project) => project.Project_Approach)}</p>
                    
                    <iframe width="100%" height="350vh" src={projects && projects.map((project) => project.VideoLink)}>
                    </iframe>
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