import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"
import './Missing.css'

function Missing() {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserMissingCards()
    }, []);


    const fetchUserMissingCards = async() => {
        await axios.get('/missing')
        .then(res => {
            setData(res.data.card)
        })
        .catch(err => console.log(err))
    }

    const handleAddCardToCollection = (cardId) => {
        const params = {
            params: {
                card: cardId, 
                quantity: 1
            }
        };
        axios.put('/collection/add', params)
        .then(res => {
            console.log(res.data)
            setData(data.filter((card) => card._id !== cardId));
        })
        .catch(err => {
            console.log(err);
        })
    }


    const handleAddCardToWishlist = (cardId) => {
        const params = {
            params: {
                card: cardId, 
                quantity: 1
            }
        };
        axios.put('/wishlist/add', params)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => console.log(err))
    }
    
    return(
        <div className="Missing">
            <p className="Missing-title">Your Missing Cards</p>
            <p>{!data ? "Loading..." : 
                <div className="Missing-card-result">
                {data?.map( (item) => (
                    <div className="Missing-card">
                        <a href="/card/001" className="card"><img className="card-img" src={require('../assets/images/OP01-001.png')} alt="OP01-001" /> </a>
                        <p className="Missing-card-name">{item.name}</p>
                        <div className="Missing-card-form">
                            <button type="submit" className="Missing-card-button" onClick={() => handleAddCardToCollection(item._id)}>Collection</button>
                            <button type="submit" className="Missing-card-button" onClick={() => handleAddCardToWishlist(item._id)}>Wishlist</button>
                        </div>
                        <p className="Missing-card-error">{error}</p>
                    </div>
                ))}
                </div>
            }</p>
        </div>
    )
}

export default Missing
