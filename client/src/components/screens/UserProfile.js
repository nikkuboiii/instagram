import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from 'react-router-dom'

const Profile = () => {
    const [userProfile, setProfile] = useState(null)
    const [showfollow, setShowFollow] = useState(true)
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()

    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setProfile(result)

                // Check if the logged-in user is already following this profile user
                if (state && state.following.includes(userid)) {
                    setShowFollow(false);
                }
            })
    }, [userid, state])

    const followUser = () => {
        fetch('/follow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile(prevState => ({
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers, data._id]
                    }
                }))
                setShowFollow(false);
            })
    }

    const unfollowUser = () => {
        fetch('/unfollow', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile(prevState => ({
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: prevState.user.followers.filter(item => item !== data._id)
                    }
                }))
                setShowFollow(true);
            })
    }

    return (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
            {userProfile ? (
                <div>
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "18px 0px",
                        borderBottom: "1px solid grey"
                    }}>
                        <div>
                            <img style={{ width: "160px", height: "160px", borderRadius: "80px" }} src={userProfile.user.pic} alt="" />
                        </div>
                        <div>
                            <h3>{userProfile.user.name}</h3>
                            <h4>{userProfile.user.email}</h4>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                <h6>{userProfile.posts.length} posts</h6>
                                <h6>{userProfile.user.followers.length} followers</h6>
                                <h6>{userProfile.user.following.length} following</h6>
                            </div>
                            {showfollow ?
                                <button style={{margin:"10px"}} className="btn waves-effect waves-light #ab47bc purple lighten-1" onClick={() => followUser()}>Follow</button>
                                : <button style={{margin:"10px"}} className="btn waves-effect waves-light #ab47bc purple lighten-1" onClick={() => unfollowUser()}>UnFollow</button>
                            }

                        </div>
                    </div>
                    <div className="gallery">
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <img key={item._id} className="item" src={item.photo} alt={item.title} />
                                )
                            })
                        }
                    </div>
                </div>
            ) : (
                <h2>Loading...</h2>
            )}
        </div>
    )
}

export default Profile
