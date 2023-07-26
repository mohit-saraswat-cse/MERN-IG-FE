import { useEffect, createContext, useReducer, useContext } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { reducer, initialState } from './reducers/userReducer';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import './App.css';
import OtherUserProfile from "./pages/OtherUserProfile";
import Postsfromfollowing from "./pages/PostsFromFollowing";

export const UserContext = createContext();

const CustomRouting = () => {
  

  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      dispatch({ type: "USER", payload: userInfo });
      //history.push('/');//user logged in so redirect to home
    } else {
      navigate('/login');
    }
  }, []);//called when component mounts and get called only once

  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<OtherUserProfile />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/postsfromfollowing" element={<Postsfromfollowing />} />
      </Routes>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <BrowserRouter>
      <UserContext.Provider value={{ state: state, dispatch: dispatch }}>
      <NavBar />
      <CustomRouting />
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
