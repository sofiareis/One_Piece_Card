import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"

function Card({ card }) {
    const [error, setError] = useState('');

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
        console.log(params)
        console.log((e.target.getAttribute('card')))
        await axios.put('/userUpdateWishlist', params)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => console.log(err))
    }


    return(
                    <div className="Search-card">
                        <a href="/card/001" className="card"><img className="card-img" src={require('../assets/images/OP01-001.png')} alt="OP01-001" /> </a>
                        <p className="Search-card-name">{card.name}</p>
                        <div className="Search-card-form">
                            <button type="submit" className="Search-card-button" card={card._id} onClick={addCardToCollection}>Collection</button>
                            <button type="submit" className="Search-card-button" card={card._id} onClick={addCardToWishlist}>Wishlist</button>
                        </div>
                        <p className="Search-card-error">{error}</p>
                    </div>
    
    )

}

export default Card

/*

<button className="CardCollection-button" onClick={decreaseCardQuantity}>-</button>
<p>{quantity}</p>
<button className="CardCollection-button" onClick={increaseCardQuantity}>+</button>
*/
