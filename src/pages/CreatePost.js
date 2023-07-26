import React, {useState, useEffect} from 'react';
import './CreatePost.css';
import { useNavigate } from 'react-router-dom';
import M from 'materialize-css';
import useLoader from "../hooks/useLoader";

function CreatePost() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const navigate = useNavigate();
    const [loader, showLoader, hideLoader] = useLoader();

    useEffect(() => {
        if (isImageUploaded) {//only call when the value of image exist
            //call to create post api
            showLoader();
            fetch("https://mern-insta-backend.onrender.com/createpost", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({
                    title: title,
                    body: body,
                    image: image
                })
            })
                .then(response => response.json())
                .then(function (data) {
                    if (data.error) {
                        M.toast({ html: data.error, classes: "#c62828 red darken-3" });
                        hideLoader();
                    }
                    else {
                        M.toast({ html: "Post created successfully!", classes: "#388e3c green darken-2" });
                        hideLoader();
                        navigate('/');
                    }
                }).catch(error => {
                    console.log(error);
                    hideLoader();

                })
        }
    }, [isImageUploaded]);//only call when the value of image changes

    const submitPost = () => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "insta-app-clone");
        formData.append("cloud_name", "dc5ngzlzb");
        showLoader();
        fetch("https://api.cloudinary.com/v1_1/instagramcloneapp/image/upload", {
            method: "post",
            body: formData
        }).then(response => response.json())
            .then(data => {
                hideLoader();
                setImage(data.url);
                setIsImageUploaded(true);
                console.log(data);
            })
            .catch(error => {
                console.log(error);
                hideLoader();
            });
    }

    return (
        <>
        {loader}
        <div className="card create-post-container">
            <input type="text" placeholder="Post Title" 
            value={title}
            onChange={(event) => setTitle(event.target.value)} />
            <input type="text" placeholder="Post Content" 
            value={body}
            onChange={(event) => setBody(event.target.value)} />
            <div className="file-field input field">
                <div className="btn #0d47a1 blue darken-4">
                    <span>Upload Image</span>
                    <input type="file" onChange={(event) => setImage(event.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <a onClick={() => submitPost()} className="wave-effect waves-light btn-large login-btn #0d47a1 blue darken-4">Submit Post</a>
        </div>
        </>
    )
}

export default CreatePost;