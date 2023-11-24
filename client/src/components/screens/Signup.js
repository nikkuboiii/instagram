import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css"
/* eslint-disable */


const Signup = () => {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])




    const uploadPic =()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","drc1ujqhf")
        fetch("https://api.cloudinary.com/v1_1/drc1ujqhf/image/upload",{
            method:'post',
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const uploadFields = ()=>{
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return M.toast({ html: "invalid email", classes: "#e53935 red darken-1" })
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#e53935 red darken-1" })

                }
                else {
                    M.toast({ html: data.message, classes: "#4caf50 green" })
                    navigate('/signin')
                }
            }).catch(err => {
                console.log(err)
            })
    }


    const PostData = () => {
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className="file-field input-field">
                    <div className="btn #ab47bc blue darken-1">
                        <span>Upload Pic</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #ab47bc purple lighten-1" onClick={() => PostData()}>Sign Up</button>
                <h5>
                    <Link to="/signin">Already have an account?</Link>
                </h5>

            </div>
        </div>
    )
}

export default Signup
