
const ViewComments = async () => {
    alert("Hello!\nYou will now view the comments");
    let allComments = "";
    const a_complex = {
        headers: {
            "Accept": "text/plain",
            "Content-Type": "text/plain"
        },
        method: "GET"
    }
    const fetchPromise = await fetch('http://localhost:3000/api', a_complex)
        .then(response => { console.log(response); return response.text(); })
        .then((data) => { console.log(data); allComments = data;})
        .catch((error) => { console.log(error); });

    document.getElementById("commentMsg").innerText = `${allComments}`;
    document.getElementById("commentMsg").style.display = "block";
}


const PostComments = async () => {
    alert("Hello!\nThank you for posting a comment!");
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
    const fetchPromise = await fetch('http://localhost:3000/api', a_complex)
        .then(response => { console.log(response); return response.text(); })
        .then((data) => { console.log(data); allComments = data; })
        .catch((error) => { console.log(error); });

    document.getElementById("commentMsg").innerText = `${allComments}`;
    document.getElementById("commentMsg").style.display = "block";
}