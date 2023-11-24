import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../../App'
import M from "materialize-css"
import { Link } from "react-router-dom"


const Home = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch('/getsubpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setData(result.posts)
            })
    }, [dispatch])

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                // Find the index of the liked post in the data array
                const postIndex = data.findIndex(item => item._id === result._id);

                if (postIndex !== -1) {
                    // Create a copy of the updated post
                    const updatedPost = { ...data[postIndex] };
                    // Update the likes array in the copied post
                    updatedPost.likes = result.likes;

                    // Create a copy of the data array and replace the updated post
                    const newData = [...data];
                    newData[postIndex] = updatedPost;

                    // Update the state with the new data
                    setData(newData);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                // Find the index of the unliked post in the data array
                const postIndex = data.findIndex(item => item._id === result._id);

                if (postIndex !== -1) {
                    // Create a copy of the updated post
                    const updatedPost = { ...data[postIndex] };
                    // Update the likes array in the copied post
                    updatedPost.likes = result.likes;

                    // Create a copy of the data array and replace the updated post
                    const newData = [...data];
                    newData[postIndex] = updatedPost;

                    // Update the state with the new data
                    setData(newData);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    const makeComment = (text, postId, profilePic) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postId,
                text,
                profilePic, // Include the profilePic in the request
            }),
        })
        .then((res) => res.json())
        .then((result) => {
            console.log(result);
            const newData = data.map((item) => {
                if (item._id === result._id) {
                    return result;
                } else {
                    return item;
                }
            });
            setData(newData);
        })
        .catch((err) => {
            console.log(err);
        });
    };
    
    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
    }
    const deleteComment = (postId, commentId) => {
        fetch(`/deletecomment/${postId}/${commentId}`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        result.postedBy = item.postedBy;
                        return result
                    }
                    else {
                        return item
                    }
                })
                setData(newData);
                M.toast({ html: "Comment Deleted Successfully", classes: "#388e3c green darken-1" });
            })
    }



    return (
        <div className="home">
            {data.map(item => {
                // Store the profile picture URL
                const profilePic = item.postedBy.pic;
    
                return (
                    <div className="card home-card" key={item._id}>
                        <div className="card-header" style={{ display: "flex", alignItems: "center" }}>
                            <img
                                src={profilePic} // Use the stored profile picture URL
                                alt="Profile Pic"
                                className="circle profile-pic"
                                style={{ marginRight: "10px", width: "40px", height: "40px" }} // Adjust styling as needed
                            />
                            <h5 style={{ margin: "10px", padding: "6px" }}>
                                <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>
                                    {item.postedBy.name}
                                </Link>
                            </h5>
                            {item.postedBy._id === state._id && (
                                <i
                                    className="material-icons delete-button"
                                    onClick={() => deletePost(item._id)}
                                >
                                    delete
                                </i>
                            )}
                        </div>
    
                        <div className="card-image">
                            <img src={item.photo} alt="" />
                        </div>
                        <div className="card-content">
                            <div className="like-buttons">
                                <i className="material-icons like-icon" style={{ color: "red" }}>favorite</i>
                                {item.likes.includes(state._id) ? (
                                    <i className="material-icons" onClick={() => unlikePost(item._id)}>thumb_down</i>
                                ) : (
                                    <i className="material-icons" onClick={() => likePost(item._id)}>thumb_up</i>
                                )}
                            </div>
                            <h6>{item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {item.comments.map(record => {
                                return (
                                    <div key={record._id} className="comment">
                                        <div className="comment-header">
                                            <span>{record.postedBy.name}:</span>
                                            {record.postedBy._id === state._id && (
                                                <i
                                                    className="material-icons delete-button delete-icon btn btn-sm"
                                                    onClick={() => deleteComment(item._id, record._id)}
                                                >
                                                    delete
                                                </i>
                                            )}
                                        </div>
                                        <div className="comment-text">
                                            <span className="text-secondary">{record.text}</span>
                                        </div>
                                    </div>
                                );
                            })}
    
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                // Use the stored profile picture URL here
                                makeComment(e.target[0].value, item._id, profilePic);
                            }}>
                                <input type="text" placeholder="add a comment" />
                            </form>
                        </div>
                    </div>
                );
            })}
        </div>
    );
    
    
}

export default Home