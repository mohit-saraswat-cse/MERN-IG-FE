import React, {useContext, useEffect} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';
import './NavBar.css';

const NavBar = () => {
    
    const {state, dispatch} = useContext(UserContext);

    var elem = document.querySelector('.sidenav');
    var instance = M.Sidenav.init(elem);
        
    const navigate = useNavigate();
    let navList = null;

    const logout = () => {
        dispatch({type: 'LOGOUT'});
        navigate('/login')
    }

    
    if (state) {//if the user object is present
        navList = (
            <>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li key="11189" ><NavLink className={(navData) => (navData.isActive ? 'active' : 'link')}to="/">Home</NavLink></li>
                    <li key="11177" ><NavLink className={(navData) => (navData.isActive ? 'active' : 'link')}to="/create-post">Create Post</NavLink></li>
                    <li key="11178" ><NavLink className={(navData) => (navData.isActive ? 'active' : 'link')}to="/postsfromfollowing">Posts from Followings</NavLink></li>
                    <li key="11179" ><NavLink className={(navData) => (navData.isActive ? 'active' : 'link')}to="/profile">Profile</NavLink></li>
                    <li key="11190" >
                        <button onClick={() => logout()} className="btn waves-effect #b71c1c red darken-4">Logout</button>
                    </li>
                </ul>
                <ul className="sidenav right" id="mobile-demo">
                    <li key="11189" ><NavLink className={(navData) => (navData.isActive ? 'active' : 'link')}to="/">Home</NavLink></li>
                    <li key="11177" ><NavLink className={(navData) => (navData.isActive ? 'active' : 'link')}to="/create-post">Create Post</NavLink></li>
                    <li key="11178" ><NavLink className={(navData) => (navData.isActive ? 'active' : 'link')}to="/postsfromfollowing">Posts from Followings</NavLink></li>
                    <li key="11179" ><NavLink className={(navData) => (navData.isActive ? 'active' : 'link')}to="/profile">Profile</NavLink></li>
                    <li key="11190" >
                        <button onClick={() => logout()} className="btn waves-effect #b71c1c red darken-4">Logout</button>
                    </li>
                </ul>
            </>
        )
    } else {
        navList = (
            <>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li key="11175" ><NavLink className={(navData) => (navData.isActive ? 'active' : 'link')}to="/login">Login</NavLink></li>
                    <li key="11176" ><NavLink className={(navData) => (navData.isActive ? 'active' : 'link')}to="/signup">Signup</NavLink></li>
                </ul>
                <ul className="sidenav right" id="mobile-demo">
                    <li key="11175" ><NavLink className={(navData) => (navData.isActive ? 'active' : 'link')}to="/login">Login</NavLink></li>
                    <li key="11176" ><NavLink className={(navData) => (navData.isActive ? 'active' : 'link')}to="/signup">Signup</NavLink></li>
                </ul>
            </>
        )
    }
    

    
  return (
    <nav>
        <div className="nav-wrapper white" style={{padding: '0rem 1rem'}}>
        <NavLink to={state ? "/" : "/login"} className="brand-logo" id="brand-logo">Instagram</NavLink>
        <NavLink to={state ? "/" : "/login"} data-target="mobile-demo" id="brand-logo" className="sidenav-trigger"><i className="material-icons">menu</i></NavLink>
        {navList}
        </div>
    </nav>
  )
}


export default NavBar;