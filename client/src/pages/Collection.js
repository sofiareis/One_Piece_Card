import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"
import { getCurrentUser } from "../services/auth.service";
import './Collection.css'
import CardCollection from "../components/CardCollection"

function Collection() {
    const [data, setData] = useState([]);
    const user = getCurrentUser();
    useEffect(() => {
        let processing = true
        //getcurrent(processing)
        fetchUserCards(processing)
        return () => {
            processing = false
        }
    }, []);


    const fetchUserCards = async(processing) => {
        await axios.get(`/collection/${getCurrentUser()._id}`)
        .then(res => {
            console.log(res.data.card)
            if (processing) {
                setData(res.data.card)
            }
        })
        .catch(err => console.log(err))
        
    }
    
    return(
        <div className="Collection">
            <p>This will be the collection page yipe</p>
            <p>{user.username}</p>
            <p>{!data ? "Loading..." : 
                <ul className="Collection-card-result">
                <div className="Collection-card">
                        <li key='title-name' className="Collection-card-title">Card</li>
                        <li key='title-name' className="Collection-card-title">Name</li>
                        <li key='title-deck' className="Collection-card-title">Deck</li>
                        <li key='title-type' className="Collection-card-title">Type</li>
                        <li key='title-color' className="Collection-card-title">Color</li>
                        <li key='title-rarity' className="Collection-card-title">Rarity</li>
                    </div>
                {data?.map( (item) => (
                    <div className="Collection-card">
                        <a href="/card/001" className="card"><img className="Collection-card-img" src={require('../assets/images/OP01-001.png')} alt="OP01-001" /> </a>
                        <li key={item.card.name} className="Collection-card-name">{item.card.name}</li>
                        <li key={item.card.deck} className="Collection-card-name">{item.card.deck}</li>
                        <li key={item.card.type} className="Collection-card-name">{item.card.type}</li>
                        <li key={item.card.color} className="Collection-card-name">{item.card.color}</li>
                        <li key={item.card.rarity} className="Collection-card-name">{item.card.rarity}</li>
                        <li key={`collection_${item.card.name}`} className="Collection-card-name">{item.quantity}</li>
                        <li key={`delete${item.card.name}`} className="Collection-card-name">Delete</li>
                    </div>
                ))}
            </ul>
            }</p>
        </div>
    )
}

export default Collection

/*
<ul className="Collection-card-result">
                <div className="Collection-card">
                        <li key='title-name' className="Collection-card-title">Name</li>
                        <li key='title-deck' className="Collection-card-title">Deck</li>
                        <li key='title-type' className="Collection-card-title">Type</li>
                        <li key='title-color' className="Collection-card-title">Color</li>
                        <li key='title-rarity' className="Collection-card-title">Rarity</li>
                    </div>
                {selectCard?.map( (item.card) => (
                    <div className="Collection-card">
                        <li key={item.card.name} className="Collection-card-name">{item.card.name}</li>
                        <li key={item.card.deck} className="Collection-card-name">{item.card.deck}</li>
                        <li key={item.card.type} className="Collection-card-name">{item.card.type}</li>
                        <li key={item.card.color} className="Collection-card-name">{item.card.color}</li>
                        <li key={item.card.rarity} className="Collection-card-name">{item.card.rarity}</li>
                        <li key={`collection_${item.card.name}`} className="Collection-card-name">Collection</li>
                        <li key={`wishlist${item.card.name}`} className="Collection-card-name">Wishlist</li>
                    </div>
                ))}
            </ul>
*/

