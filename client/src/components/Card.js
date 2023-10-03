import React from "react";
import { useState, useEffect } from "react";

function Card({ card }) {
    const [error, setError] = useState('');

    const handleDelete = (e) => {

    }

    const handleAddtoCollection = (e) => {

    }

    return(
        <div className="Collection-card">
            <a href="/card/001" className="card"><img className="card-img" src={require('../assets/images/OP01-001.png')} alt="OP01-001" /> </a>
            <p className="Collection-card-name">{card.name}</p>
            <button className="Collection-delete">Add to collection</button>
            <button className="Collection-delete">Delete</button>
            
        </div>
    )

}

export default Card

/*

<button className="CardCollection-button" onClick={decreaseCardQuantity}>-</button>
<p>{quantity}</p>
<button className="CardCollection-button" onClick={increaseCardQuantity}>+</button>
*/