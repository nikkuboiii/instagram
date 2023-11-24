import React,{useState,useContext} from "react";
import { Link,useNavigate } from "react-router-dom";
import {UserContext} from "../../App"
import M from "materialize-css"
/* eslint-disable */

const SignIn = () => {
    const {state,dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    const [password,setPassword]=useState("")
    const [email,setEmail]=useState("")
    const PostData = ()=>{
        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            return M.toast({html: "invalid email",classes:"#e53935 red darken-1"})
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error,classes:"#e53935 red darken-1"})

            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html:"signed in success",classes:"#4caf50 green"})
                navigate ('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input type="text" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button className="btn waves-effect waves-light #ab47bc purple lighten-1" onClick={()=>PostData()}>Login</button>
                <h5>
                    <Link to="/signup">Don't have an account?</Link>
                </h5>

            </div>
        </div>
    )
}

export default SignIn
