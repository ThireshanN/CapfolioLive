const dnsname = 'ec2-3-27-128-129.ap-southeast-2.compute.amazonaws.com';
//const URL = `http://${dnsname}:3000/api`;
const URL = 'http://localhost:3000/api';



function signOut() {
    var auth2 = google.accounts.id.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}

function onSignIn(credential) {
    var profile = credential.getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
}

const ViewComments = async () => {
    //alert("Hello!\nYou will now view the comments");
    let allComments = "";
    const a_complex = {
        headers: {
            "Accept": "text/plain",
            "Content-Type": "text/plain"
        },
        method: "GET"
    }
    const fetchPromise = await fetch(URL, a_complex)
        .then(response => { console.log(response); return response.text(); })
        .then((data) => { console.log(data); allComments = data;})
        .catch((error) => { console.log(error); });

    document.getElementById("commentMsg").innerText = `${allComments}`;
    document.getElementById("commentMsg").style.display = "block";
}


const PostComments = async () => {
    //alert("Hello!\nThank you for posting a comment!");
    const inputComment = document.getElementById("commentP").value;
    const inputName = document.getElementById("nameP").value;
    let allComments = "";
    const a_complex = {
        headers: {
            "Accept": "text/plain",
            "Content-Type": "text/plain"
        },
        method: "POST",
        body: inputName + ": " + inputComment,
    }
    
    const fetchPromise = await fetch(URL, a_complex)
        .then(response => { console.log(response); return response.text(); })
        .then((data) => { console.log(data); allComments = data; })
        .catch((error) => { console.log(error); });

    document.getElementById("commentMsg").innerText = `${allComments}`;
    document.getElementById("commentMsg").style.display = "block";
}