import React from "react";
import { useLocation } from 'react-router-dom';
import './Header.css'
import axios from "axios"
import LogoutIcon from '../assets/images/logout.svg'

function Header() {
    const location = useLocation()

    if(location.pathname === '/') {
    return null
    }

    //Put an icon instead
    if(location.pathname === '/login' || location.pathname === '/signup') {
        return(
            <nav className="nav-bar">
                <a className="nav-bar-title" href="/">Home</a>
            </nav>
        )
    }

    //NEEDS ERROR HANDLING?
    const logout = async() => {
        localStorage.removeItem("user");
        return await axios.get('/logout')
            .then(res => {return res.data})
    }

    return(
        <nav className="nav-bar">
            <a className="nav-bar-title" href="/search">Search</a>
            <a className="nav-bar-title" href="/collection">Collection</a>
            <a className="nav-bar-title" href="/missing">Missing</a>
            <a className="nav-bar-title" href="/wishlist">Wishlist</a>
            <div className="logout">
                
                <button className="logout-button" onClick={logout}><a href="/">Log Out</a></button>
            </div>
        </nav>
    )
}

export default Header


//<img src={LogoutIcon} className="logout-icon"></img>