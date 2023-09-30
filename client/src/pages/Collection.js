import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"
import { deck } from "../components/CardInfo";
import { getCurrentUser } from "../services/auth.service";
import './Collection.css'
import CardCollection from "../components/CardCollection"

function Collection() {
    const [data, setData] = useState([]);
    //const [searchCard, setSearchCard] = useState('');
    //const [selectSet, setSelectSet] = useState('')
    const user = getCurrentUser();
    useEffect(() => {
        let processing = true
        fetchUserCards(processing)
        return () => {
            processing = false
        }
    }, []);


    const fetchUserCards = async(processing) => {
        await axios.get(`/collection/${user._id}`)
        .then(res => {
            if (processing) {
                setData(res.data.card)
            }
        })
        .catch(err => console.log(err)) 
    }

    //do we need filter? yea...
    //need to see how to do it with prisma
    /*
    const fetchCardsCondition = async(e) => {
        e.preventDefault()

        const params = {
            params: {
                name: searchCard,
                deck: selectSet,
            }
        }

        await axios.get(`/collectionCondition/${user._id}`, params)
        .then(res => {
            setData(res.data)
        })
        .catch(err => console.log(err))
    }

    

    const SelectSetDropdown = () => {
        return (
            <select className="Search-form-dropdown" value={selectSet} onChange={(e) => {
                setSelectSet(e.target.value)
                }}>
                <option value="" key="none"> Choose Set </option>
                {
                    deck?.map( (item) => (
                        <option value={item} key={item}>{item}</option>
                    ))
                }
            </select>
        )
    }
    */
    
    return(
        <div className="Collection">
            <p className="Collection-title">{user.username}'s Collection</p>
            <p>{!data ? "Loading..." : 
                <div className="Collection-card-result">
                {data?.map( (item) => (
                        <CardCollection card={item}/>
                ))}
                </div>
            }</p>
        </div>
    )
}

export default Collection
/*
<form className="Search-form">
                <div className="Search-form-choose">
                    <input type="text" placeholder="Search Card..." id="searchCard" name="searchCard" value={searchCard} onChange={(e) => setSearchCard(e.target.value)} />
                    <SelectSetDropdown/>
                </div>
                <div className="Search-button">
                    <button type="submit" className="Search-form-submit" onClick={fetchCardsCondition}>Search</button>
                </div>
            </form>
            */

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

