import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"
import { getCurrentUser } from "../services/auth.service";

function CardCollection(card) {
    console.log(card)
    const [quantity, setQuantity] = useState(card.card.quantity);
    console.log(quantity)
    console.log(card.card.card.name)

    const increaseCardQuantity = async(e) => {
        e.preventDefault()
        const params = {
            params: {
                card: card.card.card._id, 
                quantity: 1
            }
        };
        console.log(params)
        console.log(card)
        await axios.put(`/userUpdateCollection/${getCurrentUser()._id}`, params)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => console.log(err))
    }

    const decreaseCardQuantity = async(e) => {
        e.preventDefault()
        const params = {
            params: {
                card: card.card.card._id, 
                quantity: -1
            }
        };
        console.log(params)
        console.log(card)
        await axios.put(`/userUpdateCollection/${getCurrentUser()._id}`, params)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => console.log(err))
    }


    return(
        <div>
            <button className="CardCollection-button" onClick={decreaseCardQuantity}>-</button>
            <p>{quantity}</p>
            <button className="CardCollection-button" onClick={increaseCardQuantity}>+</button>
        </div>
    )

}

export default CardCollection