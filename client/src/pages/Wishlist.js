import React from "react";
import { useState, useEffect } from "react";
import axios from '../services/axiosConfig';
import './Wishlist.css'

function Wishlist() {
    const [data, setData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserWishlist()
    }, []);


    const fetchUserWishlist = async() => {
        await axios.get('/wishlist')
        .then(res => {
            setData(res.data.card)
        })
        .catch(err => console.log(err))
        
    }

    const handleDelete = (cardId) => {
        const params = {
            params: {
                card: cardId, 
            }
        };
        axios.put('/wishlist/delete', params)
            .then(res => {
                console.log(res.data)
                setData(data.filter((card) => card._id !== cardId));
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
            axios.put('/wishlist/delete', params)
            .then(res => {
                console.log(res.data)
                setData(data.filter((card) => card._id !== cardId));
            })
        })
        .catch(err => {
            console.log(err);
            if(err.response.status == 400){
                //setError('You already have that card!')
                axios.put('/wishlist/delete', params)
                .then(res => {
                    console.log(res.data)
                    setData(data.filter((card) => card._id !== cardId));
                })
            }
        })
    }
    
    return(
        <div className="Wishlist">
            <p className="Wishlist-title">Your Wishlist</p>
            <p>{!data ? "Loading..." : 
                <div className="Wishlist-card-result">
                {data?.map( (item) => (
                    <div className="Wishlist-card-div" key={item._id}>
                        <div className="Wishlist-card">
                            <a href="/card/001" className="card"><img className="card-img" src={require('../assets/images/OP01-001.png')} alt="OP01-001" /> </a>
                            <p className="Wishlist-card-name">{item.name}</p>
                            <div className="Wishlist-card-form">
                                <button type="submit" className="Wishlist-card-button" card={item._id} onClick={() => handleAddCardToCollection(item._id)}>Move to Collection</button>
                            </div>
                            <p className="Wishlist-card-error">{error}</p>
                        </div>
                        <button className="Wishlist-delete" onClick={() => handleDelete(item._id)}>Delete</button>
                    </div>
                ))}
                </div>
            }</p>
        </div>
    )
}

export default Wishlist

