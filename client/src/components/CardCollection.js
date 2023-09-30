import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"
import { getCurrentUser } from "../services/auth.service";

function CardCollection({ card }) {
    const [quantity, setQuantity] = useState(card.quantity);
    const [error, setError] = useState('');

    const updateCardQuantity = async(e) => {
        e.preventDefault()
        if(quantity < 1){
            setError("Quantity needs to be more than 0");
        } else{
            setError('');
            const params = {
                params: {
                    card: card.card._id, 
                    quantity: quantity
                }
            };
            await axios.put(`/userUpdateCardQuantity/${getCurrentUser()._id}`, params)
            .then(res => {
                console.log(res.data)
            })
            .catch(err => console.log(err))
        }
    }

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
      };

    const handleDelete = (e) => {

    }

    return(
        <div className="Collection-card">
            <a href="/card/001" className="card"><img className="card-img" src={require('../assets/images/OP01-001.png')} alt="OP01-001" /> </a>
            <p className="Collection-card-name">{card.card.name}</p>
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
                <p>{error}</p>
                <button className="Collection-card-button" type="submit">Update</button>
            </form>
            <button className="Collection-delete">Delete</button>
            
        </div>
    )

}

export default CardCollection

/*

<button className="CardCollection-button" onClick={decreaseCardQuantity}>-</button>
<p>{quantity}</p>
<button className="CardCollection-button" onClick={increaseCardQuantity}>+</button>
*/