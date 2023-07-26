import React, {useState, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './Signup.css';
import M from 'materialize-css';
import { UserContext } from '../App';
import useLoader from "../hooks/useLoader";

const Login = () => {
    const { state, dispatch } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [loader, showLoader, hideLoader] = useLoader(); 

    const onSubmitHandler = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Enter valid email!", classes: "#c62828 red darken-3" });
            return
        }
        if(!password) {
            M.toast({ html: "Enter valid password!", classes: "#c62828 red darken-3" });
            return
        }
        showLoader();
        fetch('https://mern-insta-backend.onrender.com/login', {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(response => response.json())
        .then((data) => {
            if(data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
                hideLoader();
                //dispatch the action and state to the reducer
                dispatch({ type: "USER", payload: data.userInfo });
                M.toast({html: 'Logged in Successfully !', classes: "#388e3c green darken-2"})
                navigate('/');
            }
            if(data.error) {
                M.toast({html: data.error, classes: "#c62828 red darken-3"})
                hideLoader();
            }
        }).catch(error => {
            M.toast({html: 'Something went wrong', classes: "#c62828 red darken-3"})
            hideLoader();
            console.log(error);
        });
    }

  return (
    <>
    {loader}
    <div className="login-container">
        <div className="card login-card">
            <h2 className="title">Instagram</h2>
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
            <a className="wave-effect waves-light btn-large login-btn #0d47a1 blue darken-4"
                onClick={onSubmitHandler}>Login</a>
            <h6><Link to="/signup">Don't have an account ?</Link></h6>
        </div>
    </div>
    </>
  )
}

export default Login