import React from "react";
import { useState, useEffect } from "react";
import axios from '../services/axiosConfig';
import { deck } from "../components/CardInfo";
import './Collection.css'
import CardCollection from "../components/CardCollection"

function Collection() {
    const [data, setData] = useState([]);
    const [searchCard, setSearchCard] = useState('');
    const [selectSet, setSelectSet] = useState('')

    useEffect(() => {
        fetchUserCards()
    }, []);

    const fetchUserCards = async() => {
        await axios.get('/collection')
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
        axios.put('/collection/delete', params)
            .then(res => {
                console.log(res.data)
                setData(data.filter((card) => card.card._id !== cardId));
            })
            .catch(err => console.log(err))

    }

//do we need filter? yea...
    /*
    const fetchCardsCondition = async(e) => {
        e.preventDefault()

        const params = {
            params: {
                name: searchCard,
                deck: selectSet,
            }
        }

        await axios.get('/collection/condition', params)
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
            <p className="Collection-title">Your Collection</p>
            <div>{!data ? "Loading..." : 
                <div className="Collection-card-result">
                {data?.map( (item) => (
                    <div className="Collection-card-div" key={item.card._id}>
                        <CardCollection card={item}/>
                        <button className="Collection-delete" onClick={() => handleDelete(item.card._id)}>Delete</button>
                    </div>
                ))}
                </div>
            }</div>
        </div>
    )
}

export default Collection