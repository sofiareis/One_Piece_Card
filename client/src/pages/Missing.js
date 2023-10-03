import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"
import './Collection.css'
import Card from "../components/Card"

function Missing() {
    const [data, setData] = useState([]);
    useEffect(() => {
        let processing = true
        fetchUserMissingCards(processing)
        return () => {
            processing = false
        }
    }, []);


    const fetchUserMissingCards = async(processing) => {
        await axios.get('/missing')
        .then(res => {
            if (processing) {
                setData(res.data.card)
            }
        })
        .catch(err => console.log(err))
    }
    
    return(
        <div className="Collection">
            <p className="Collection-title">Your Missing Cards</p>
            <p>{!data ? "Loading..." : 
                <div className="Collection-card-result">
                {data?.map( (item) => (
                        <Card card={item}/>
                ))}
                </div>
            }</p>
        </div>
    )
}

export default Missing

/*
<ul className="Search-card-result">
                <div className="Search-card">
                        <li key='title-name' className="Search-card-title">Name</li>
                        <li key='title-deck' className="Search-card-title">Deck</li>
                        <li key='title-type' className="Search-card-title">Type</li>
                        <li key='title-color' className="Search-card-title">Color</li>
                        <li key='title-rarity' className="Search-card-title">Rarity</li>
                    </div>
                {selectCard?.map( (item) => (
                    <div className="Search-card">
                        <li key={item.name} className="Search-card-name">{item.name}</li>
                        <li key={item.deck} className="Search-card-name">{item.deck}</li>
                        <li key={item.type} className="Search-card-name">{item.type}</li>
                        <li key={item.color} className="Search-card-name">{item.color}</li>
                        <li key={item.rarity} className="Search-card-name">{item.rarity}</li>
                        <li key={`collection_${item.name}`} className="Search-card-name">Collection</li>
                        <li key={`wishlist${item.name}`} className="Search-card-name">Wishlist</li>
                    </div>
                ))}
            </ul>
*/

