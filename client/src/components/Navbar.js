import React,{useContext} from "react";
import {Link,useNavigate} from 'react-router-dom';
import { UserContext } from "../App";


const Navbar = () => {
    const {state,dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    const renderList = ()=>{
        if(state){
            return [
                <li key="profile"><Link to="/profile">Profile</Link></li>,
                <li key="create"><Link to="/create">Create Post</Link></li>,
                <li key="myfollowingspost"><Link to="/myfollowingspost">My Following posts</Link></li>,
                <li key="logout">
                    <button className="btn waves-effect waves-light #ab47bc purple lighten-1" onClick={()=>{
                        localStorage.clear()
                        dispatch({type:"CLEAR"})
                        navigate('/signin')
                    }}>Logout</button>
                </li>

            ]
        }else{
            return [
                <li key="signin"><Link to="/signin">Signin</Link></li>,
                    <li key="signup"><Link to="/signup">Signup</Link></li>
            ]
        }
    }
    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right ">
                    {renderList()}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar