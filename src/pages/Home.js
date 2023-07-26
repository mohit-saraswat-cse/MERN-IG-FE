import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { Link } from 'react-router-dom';
import './Home.css';
import useLoader from "../hooks/useLoader";
import ConfirmationModal from '../components/ConfirmationModal';

const Home = () => {
    const [posts, setPosts] = useState([]); //initialize to empty array
    const [commentData, setcommentData] = useState([]); //initialize to empty array
    const { state, dispatch } = useContext(UserContext);
    const [loader, showLoader, hideLoader] = useLoader(); 
    const [confirmation, setConfirmation] = useState();
    
    useEffect(() => {
        showLoader();
        fetch("https://mern-insta-backend.onrender.com/posts", {
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => response.json())
            .then(function (data) {
                console.log(data);
                setPosts(data.posts);
                hideLoader();
            }).catch(error => {
                console.log(error);
                hideLoader();
            });
    }, []);//we want to lad only once when component is mounting/loading thats why an empty array as dependency

    const likeUnlike = (postId, url) => {
        fetch(url, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ postId: postId })

        })
            .then(response => response.json())
            .then(function (updatedPost) {
                console.log(updatedPost);
                const newPostArr = posts.map((oldPost) => {
                    if (oldPost._id == updatedPost._id) {
                        return updatedPost;
                    } else {
                        return oldPost;
                    }
                });
                setPosts(newPostArr);
            }).catch(error => {
                console.log(error);
            });
    }

    const deletePostConfirmation = (postId) => {
        setConfirmation({
            title: 'Confirmation',
            message: 'Are you sure, you want to delete this post ?',
            postId: postId
        });
    }

    const confirmationHandler = (postId) => {
        if(postId) {
            deletePost(postId);
            setConfirmation(false);
        } else {
            setConfirmation(false);
        }
    }

    const deletePost = (postId) => {
        showLoader();
        fetch(`https://mern-insta-backend.onrender.com/deletepost/${postId}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }

        })
            .then(response => response.json())
            .then(function (deletedPost) {
                console.log("deletedPost = ", deletedPost);
                const newPostArr = posts.filter((oldPost) => {
                    return oldPost._id !== deletedPost.result._id //return the post whose id dont match the deleted id
                });
                hideLoader();
                setPosts(newPostArr);
            }).catch(error => {
                console.log(error);
                hideLoader();
            });
    }
    const submitComment = (event, postId) => {
        event.preventDefault();//avaoid the page refresh
        const commentText = event.target[0].value;

        fetch("https://mern-insta-backend.onrender.com/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ commentText: commentText, postId: postId })

        })
            .then(response => response.json())
            .then(function (updatedPost) {
                console.log(updatedPost);
                const newPostArr = posts.map((oldPost) => {
                    if (oldPost._id == updatedPost._id) {
                        return updatedPost;
                    } else {
                        return oldPost;
                    }
                });
                setPosts(newPostArr);
                setcommentData('');
            }).catch(error => {
                console.log(error);
            });
    }

  return (
    <>
    {loader}
    {confirmation && (
        <ConfirmationModal
          title={confirmation.title}
          message={confirmation.message}
          postId={confirmation.postId}
          onConfirm={confirmationHandler}
        />
      )}
    <div className="home-container">
        {
            posts.map((post) => {
                return (
                    <div className="card home-card" key={post._id}>
                        <h5 style={{paddingLeft: '1rem', paddingTop: '0.5rem'}}>
                            <img className="profilePic" src={post.author.profilePicUrl} alt="Profile picture" />
                            <Link to={post.author._id != state._id ? "/profile/" + post.author._id : "/profile"}>{post?.author?.fullName}</Link>
                            {post.author._id == state._id
                                    && <i onClick={() => deletePostConfirmation(post._id)}
                                        style={{ color: "red", cursor: "pointer", float: "right", fontSize: "34px" }}
                                        className="material-icons">delete_forever</i>}
                        </h5>
                        <div className="card-image">
                            <img src={post?.image} />
                        </div>
                        <div className="card-content">
                        {
                            post.likes.includes(state._id)
                                ? <i onClick={() => likeUnlike(post._id, 'https://mern-insta-backend.onrender.com/unlike')}
                                    className="material-icons"
                                    style={{ color: "red", cursor: "pointer" }}>favorite</i>
                                : <i onClick={() => likeUnlike(post._id, 'https://mern-insta-backend.onrender.com/like')}
                                    className="material-icons"
                                    style={{
                                        color: "red",
                                        marginRight: "10px", cursor: "pointer"
                                    }}>favorite_border</i>
                        }
                            <h6>{post.likes.length} likes</h6>
                            <h6>{post?.title}</h6>
                            <p>{post?.body}</p>
                            {
                                    post.comments.length > 0
                                        ? <h6 style={{ fontWeight: "600", color: "blue" }}>All Comments</h6>
                                        : ""
                                }

                                {
                                    post.comments.map((comment) => {
                                        return (<h6 key={post._id}>
                                            {/* <img className="profilePic" src={comment.commentedBy.profilePicUrl} alt="Profile picture" /> */}
                                            <span style={{ fontWeight: "500", marginRight: "10px" }}>{comment.commentedBy.fullName}</span>
                                            <span>{comment.commentText}</span>
                                        </h6>)
                                    })
                                }
                                <form onSubmit={(event) => { submitComment(event, post._id) }}>
                                    <input type="text" placeholder="Enter comment" value={commentData} onChange={(event) => setcommentData(event.target.value)} />
                                </form>
                        </div>
                    </div>
                )
            })
        }
    </div>
    </>
  )
}

export default Home;