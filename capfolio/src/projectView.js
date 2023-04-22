import React, { useState, useEffect } from 'react'
import './projectView.css';
import heart from './images/red-heart.png';
import mainImage from './images/homepage-mockup.png'
import secondimage from './images/secondimage.png';
import thirdimage from './images/thirdimage.png';
import submitcomment from './images/send-button.png'
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import LikeButton from "./components/likeButton";


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
        videolink: "https://www.youtube.com/embed/tgbNymZ7vqY"

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
            <div>
                <p className='projecttitle'>{project.title}</p>

                <div className="names">
                    <p className='companyname'>By  {project.companyName} -&nbsp;</p>

                    {project.authors.map((name, i) =>
                        <div className='name'>
                            <p key={`Key${i}`}>{name},&nbsp;</p>
                        </div>
                    )}

                </div>


                <div className='techUsed'>
                    {project.tech.map((tech, i) =>
                        <div className='tech'>
                            <p key={`Key${i}`}>{tech}</p>
                        </div>
                    )}

                </div>
                <div className='pv-likeButton'>
                    <LikeButton />
                </div>
            </div>
        );
    };

    const Fetchfakedatakristen = () => {
        const [data, setData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            fetch(`/test`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `This is an HTTP error: The status is ${response.status}`
                        );
                    }
                    return response.text();
                })
                .then((actualData) => {
                    setData(actualData);
                    setError(null);
                })
                .catch((err) => {
                    setError(err.message);
                    setData(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, []);

        return (
            <p>{data}</p>
        );
    }




    const [comments, setComments] = useState('');

    const [name, setName] = useState('TestUser');

    // Function to collect data
    const getApiData = async () => {
        const response = await fetch(
            "/getcomments"
        ).then((response) => response.json());

        setComments(response);
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        var comment = document.getElementById('comment').value
        const com = { name, comment }
        var datatosend = JSON.stringify(com)
  
        fetch('/postcomments', {
            method: 'POST',
            header: { "Content-Type": "application/json" },
            body: datatosend
        }).then(() => {
            console.log('comment Added')
        })
    };

    
     useEffect(() => {
        getApiData();
    }, []);

  
    return (

        <div>

            <div className='bluebox'>
                <div className='p-row'>
                    <div className='column headerleft'>
                        <div className='image'>
                            <Example />
                        </div>
                    </div>
                    <div className='column headerright'>
                        <div className='teammembers'>
                            {projects.map((project) => (
                                <Header key={project.id} project={project} />
                            ))}
                        </div>


                    </div>
                </div>
            </div>

            <div className="rowcontent">
                <div className='column left'>
                    <div className='projectInformation'>
                        <h2>About {projects.map((project) => project.title)}</h2>
                        <p className='about'>{projects.map((project) => project.about)} </p>
                        <h2>Project Approach</h2>
                        <p className='projectApproach'>{projects.map((project) => project.projectApproach)}</p>
                        <h2>Api Request From Our Backend:</h2>
                        <Fetchfakedatakristen />
                        <iframe width="100%" height="350vh" src={projects.map((project) => project.videolink)}>
                        </iframe>
                    </div>



                </div>


                <div className="column right">

                    <div className='commentbox'>

                        <div className='likesection'>
                            <p className='liketext'>Give your support to {projects.map((project) => project.title)} with a like</p>
                            <div className='likepost'>
                                <img className='likebutton' src={heart}></img>
                                <p className='likecount'>60 Likes</p>
                            </div>
                        </div>

                        <div className='comments'>
                            <div className='commentheading'>
                                <h2>Comments</h2>
                            </div>
                            <div className='writecomment'>


                                <form onSubmit={handleSubmit}>
                                    <textarea
                                        placeholder="Write your comment here..."
                                        id='comment'
                                        type='text'
                                        required
                                        
                                    ></textarea>
                                    
                                    <button>
                                    <img className='submitcomment' src={submitcomment} ></img>
                                    </button>
                                </form>

                                
                            </div>

                            <div className='showcomments'>
                                {comments &&
                                    comments.map((comment) => (
                                        <div className='comment'>
                                            <p className='commenttext'>{comment.comment}</p>
                                            <p className='commentname'>{comment.name}</p>
                                        </div>
                                    ))}

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>


    );
};


export default ProjectView;