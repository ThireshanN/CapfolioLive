//click submit button, then post the comment to server
const postComment = async () => {
    const inputComment = document.getElementById("commentP").value;
    const inputName = document.getElementById("nameP").value;
  
    const a_complex = {
        headers: {
            //"Accept": "text/plain",
            //"Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "http://localhost:3000"
        },
        method: "POST",
        body: inputName + ": " + inputComment,
    }

    let allComments = "";
    const fetchPromise = await fetch('http://localhost:3000/public_api/comments', a_complex)
        .then(response => { console.log(response); return response.text(); })
        .then((data) => { console.log(data); allComments=data;})
        .catch((error) => { console.log(error); });
    
    
    //refesh comment section so user can see their comment. yay 
    document.getElementById("commentMsg").innerText = `${allComments}`;
    document.getElementById("commentMsg").style.display = "block";
  }