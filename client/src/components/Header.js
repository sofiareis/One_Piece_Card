import React from "react";
import { useLocation } from 'react-router-dom';
import './Header.css'

function Header() {
    const location = useLocation()

    if(location.pathname === '/') {
    return null
    }

    return(
        <nav className="nav-bar">
            <a href="/search">Search</a>
            <a href="/collection">Collection</a>
            <a href="/missing">Missing</a>
            <a href="/wishlist">Wishlist</a>
        </nav>
    )
}

export default Header