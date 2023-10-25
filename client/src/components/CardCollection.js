import React from "react";
import { useState, useEffect } from "react";
import axios from '../services/axiosConfig';

function CardCollection({ card }) {
    const [quantity, setQuantity] = useState(card.quantity);
    const [error, setError] = useState('');

    const updateCardQuantity = async(e) => {
        e.preventDefault()
        if(quantity < 1){
            setError("Quantity needs to be bigger than 0");
        } else{
            setError('');
            const params = {
                params: {
                    card: card.card._id, 
                    quantity: quantity
                }
            };
            await axios.put('/collection/quantity', params)
            .then(res => {
                console.log(res.data)
            })
            .catch(err => console.log(err))
        }
    }

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
      };

    return(
        <div className="Collection-card">
            <a href={`/card/${card.card.cid}`}><img className="card-img" src={card.card.image} alt={`${card.card.cid}`} /> </a>
            <p className="Collection-card-name">{card.card.name}</p>
            <p className="Collection-card-error">{error}</p>
            <form className="Collection-card-form" onSubmit={updateCardQuantity}>
                <label>
                    Quantity:
                    <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="Collection-input"
                    />
                </label>
                <button className="Collection-card-button" type="submit">Update</button>
            </form>
            
        </div>
    )

}

export default CardCollection