import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './Signup.css';
import M from 'materialize-css';
import useLoader from "../hooks/useLoader";

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePic, setProfilePic] = useState("");
    const [url, setUrl] = useState(undefined);
    const [loader, showLoader, hideLoader] = useLoader(); 

    const navigate = useNavigate();

    useEffect(() => {
        if (url) {
            submitData();
        }
    }, [url]);

    const submitData = () => {
        if(!fullName) {
            M.toast({ html: "Enter valid Name!", classes: "#c62828 red darken-3" });
            return
        }
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Enter valid email!", classes: "#c62828 red darken-3" });
            return
        }
        if(!password) {
            M.toast({ html: "Enter valid password!", classes: "#c62828 red darken-3" });
            return
        }
        showLoader();
        fetch('https://mern-insta-backend.onrender.com/register', {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName: fullName,
                email: email,
                password: password,
                profilePicUrl: url
            })
        }).then(response => response.json())
        .then((data) => {
            if(data.result) {
                hideLoader();
                M.toast({html: data.result, classes: "#388e3c green darken-2"})
                navigate('/login');
            }
            if(data.error) {
                hideLoader();
                M.toast({html: data.error, classes: "#c62828 red darken-3"})
            }
        }).catch(error => {
            hideLoader();
            M.toast({html: 'Something went wrong', classes: "#c62828 red darken-3"})
            console.log(error);
        });
    }

    const uploadProfilePicture = () => {
        const formData = new FormData();
        formData.append("file", profilePic);
        formData.append("upload_preset", "insta-app-clone");
        formData.append("cloud_name", "instagramcloneapp");
        showLoader();
        fetch("https://api.cloudinary.com/v1_1/instagramcloneapp/image/upload", {
            method: "post",
            body: formData
        }).then(response => response.json())
            .then(data => {
                setUrl(data.url);
                console.log(data);
                hideLoader();
            })
            .catch(error => {
                console.log(error);
                hideLoader();
            });
    }

    const onSubmitHandler = () => {
        if (profilePic) {
            uploadProfilePicture()
        } else {
            submitData()
        }
    }

  return (
    <>
    {loader}
    <div className="login-container">
        <div className="card login-card">
            <h2 className="title">Instagram</h2>
            <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
            />
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Profile picture</span>
                    <input type="file" onChange={(event) => setProfilePic(event.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <a className="wave-effect waves-light btn-large login-btn #0d47a1 blue darken-4"
                onClick={onSubmitHandler}>Sign Up</a>
            <h6><Link to="/login">Already have an account ?</Link></h6>
        </div>
    </div>
    </>
  )
}

export default Signup;