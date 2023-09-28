import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"
import { getCurrentUser } from "../services/auth.service";

function Wishlist() {
    const [data, setData] = useState([]);
    const user = getCurrentUser();
    useEffect(() => {
        let processing = true
        //getcurrent(processing)
        fetchUserWishlist(processing)
        return () => {
            processing = false
        }
    }, []);


    const fetchUserWishlist = async(processing) => {
        await axios.get(`/wishlist/${getCurrentUser()._id}`)
        .then(res => {
            console.log(res.data.card)
            if (processing) {
                setData(res.data.card)
            }
        })
        .catch(err => console.log(err))
        
    }
    
    return(
        <div>
            <p>This will be the wishlist page yipe</p>
            <p>{user.username}</p>
            <p>{!data ? "Loading..." : 
                <ul>
                    {data?.map( (item) => (
                        <li key={item.name}>{item.name} {item.deck}</li>
                    ))}
                </ul>
            }</p>
        </div>
    )
}

export default Wishlist

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

