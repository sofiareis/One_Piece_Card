import React from "react";
import { useState, useEffect } from "react";
import axios from '../services/axiosConfig';

function Card({ card }) {
    const [error, setError] = useState('');
    const [isWishlistAdded, setWishlistAdded] = useState(false);
    const [wishlistAlert, setWishlistAlert] = useState('');
    const [isCollectiontAdded, setCollectiontAdded] = useState(false);

    const addCardToCollection = async(e) => {
        e.preventDefault()
        const params = {
            params: {
                card: e.target.getAttribute('card'), 
                quantity: 1
            }
        };
        console.log(params)
        console.log(e.target.getAttribute('card'))
        await axios.put('/collection/add', params)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => {
            console.log(err);
            if(err.response.status == 400){
                //setError('You already have that card!')
            }
        })
    }


    const addCardToWishlist = async(e) => {
        e.preventDefault()
        const params = {
            params: {
                card: e.target.getAttribute('card'), 
                quantity: 1
            }
        };
        await axios.put('/wishlist/add', params)
        .then(res => {
            setWishlistAdded(true);
            setWishlistAlert('Card added to Wishlist.');
            setTimeout(() => {
                setWishlistAlert('');
                setWishlistAdded(false);
            }, 4000);
        })
        .catch(err => {
            if(err.response.status == 409){
                setWishlistAlert(err.response.data.message);
                setTimeout(() => {
                    setWishlistAlert('');
                }, 2000);
            }
        })
    }

    const handleDeleteWishlist = (cardId) => {
        const params = {
            params: {
                card: cardId, 
            }
        };
        axios.put('/wishlist/delete', params)
            .then(res => {
                console.log(res.data)
            })
            .catch(err => console.log(err))
    }


    return(
        <div className="Search-card">
            <a href={`/card/${card.cid}`}><img className="card-img" src={card.image} alt={`${card.cid}`} /> </a>
            <p className="Search-card-name">{card.name}</p>
            <p className="Search-card-cid">{card.cid}</p>
            <div className="Search-card-form">
                <button type="submit" className="Search-card-button" card={card._id} onClick={addCardToCollection}>Collection</button>
                <button type="submit" className="Search-card-button" card={card._id} onClick={addCardToWishlist}>Wishlist</button>
            </div>
            <p className="Search-card-alert">
                {wishlistAlert} {isWishlistAdded && (
                <button className="Search-wishlist-delete" onClick={() => handleDeleteWishlist(card._id)}>Undo?</button>
                )}
            </p>   
        </div>
    )

}

export default Card