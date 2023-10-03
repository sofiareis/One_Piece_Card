import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"
import './Landing.css';

function Landing() {
    const handleSignin = (e) => {
        window.location.assign('/login')
        
    }
    const handleCreate = (e) => {
        window.location.assign('/signup')
    }

    return(
        <div>
            <div className="Landing">
                <header className="Landing-header">
                    <p className="Landing-header-title">One piece cards tracker</p>
                    <p className="Landing-subtitle">One Piece card game collection tracker. You can search for cards, add to your collection or wishlist.</p>
                    <div className="Landing-options">
                        <button className="Landing-button" type="submit" onClick={handleSignin}>Sign in</button>
                        <button className="Landing-button" type="submit" onClick={handleCreate}>Create Account</button>
                    </div> 
                </header>
                <div className="Landing-search">
                    <p className="Landing-title">Search for cards!</p>
                    <p className="Landing-desc">Search for cards and find all the available cards in the One Piece Card Game</p>
                </div>
                <div className="Landing-collection">
                    <p className="Landing-title">Add cards to your collection!</p>
                    <p className="Landing-desc">Add cards to your collection and manage it by specifying its quantity.</p>
                </div>
                <div className="Landing-wish">
                    <p className="Landing-title">Add cards to your wishlist!</p>
                    <p className="Landing-desc">Don't have a card but wish you did? Add it to your wishlist!</p>
                </div>
                <div className="Landing-missing">
                    <p className="Landing-title">Missing section</p>
                    <p className="Landing-desc">Check which cards your are missing by using the Missing section, where we automatically show you all the cards you are missing</p>
                </div>
            </div>
        </div>
    )
}

export default Landing