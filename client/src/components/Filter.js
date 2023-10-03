import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"
import { deck, cardType, cardColor, cardRarity } from "../components/CardInfo";
import './Filter.css'

function Filter({location}) {
    const [selectCard, setSelectCard] = useState([]);
    const [FilterCard, setFilterCard] = useState('');
    const [checkType, setCheckType] = useState(cardType.reduce((o, key) => ({ ...o, [key]: false}), {}))
    const [checkColor, setCheckColor] = useState(cardColor.reduce((o, key) => ({ ...o, [key]: false}), {}))
    const [checkRarity, setCheckRarity] = useState(cardRarity.reduce((o, key) => ({ ...o, [key]: false}), {}))
    const [selectSet, setSelectSet] = useState('')

    useEffect(() => {
        let processing = true
        fetchCards(processing)
        return () => {
            processing = false
        }
    }, []);

    const fetchCards = async(processing) => {
        let api = ''
        if(location = 'search'){
            api = '/card'
        }
        if(location = 'collection'){
            api = '/collection'
        }
        if(location = 'missing'){
            api = '/missing'
        }
        if(location = 'wishlist'){
            api = '/wishlist'
        }
        await axios.get(api)
        .then(res => {
            if (processing) {
                setSelectCard(res.data.card)
            }
        })
        .catch(err => console.log(err))
    }

    const fetchCardsCondition = async(e) => {
        e.preventDefault()

        const type = [];
        for (var key in checkType){
            if(checkType[key]){
                type.push(key);
            }
        }

        const color = [];
        for (var key in checkColor){
            if(checkColor[key])
                color.push(key);
        }

        const rarity = [];
        for (var key in checkRarity){
            if(checkRarity[key]){
                rarity.push(key);
            }
        }

        const params = {
            params: {
                name: FilterCard,
                deck: selectSet,
                type: type,
                rarity: rarity,
                color: color,
            }
        }

        let api = ''
        if(location = 'search'){
            api = '/card'
        }
        if(location = 'collection'){
            api = '/collection'
        }
        if(location = 'missing'){
            api = '/missing'
        }
        if(location = 'wishlist'){
            api = '/wishlist'
        }
        //await axios.get(api)

        await axios.get('/card/condition', params)
        .then(res => {
            setSelectCard(res.data)
        })
        .catch(err => console.log(err))
    }

    const SelectSetDropdown = () => {
        return (
            <select className="Filter-form-dropdown" value={selectSet} onChange={(e) => {
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

    const handleTypeChange = ({target}) => {
        console.log(checkType)
        
        setCheckType(s => ({ ...s, [target.value]: !s[target.value] }));
    };

    const handleColorChange = ({target}) => {
        console.log(checkType)
        
        setCheckColor(s => ({ ...s, [target.value]: !s[target.value] }));
    };

    const handleRarityChange = ({target}) => {
        console.log(checkType)
        
        setCheckRarity(s => ({ ...s, [target.value]: !s[target.value] }));
    };

    return(
        <div className="Filter">
            <p className="Filter-title">Filter for cards</p>
            <div className="Filter-Filter">
                <form className="Filter-form">
                    <div className="Filter-form-choose">
                        <input type="text" placeholder="Filter Card..." id="FilterCard" name="FilterCard" value={FilterCard} onChange={(e) => setFilterCard(e.target.value)} />
                        <SelectSetDropdown/>
                    </div>
                    <div className="Filter-form-tags">
                        <div className="Filter-form-type">
                            <p>Card Type</p>
                            <div className="Filter-form-type-cards">
                                {cardType.map((value, index) => {
                                    return(
                                        <>
                                            <input type="checkbox" name="type[]" id={`type_${value}`} 
                                            value={value} checked={checkType[value]} onChange={handleTypeChange}/>
                                            <label className={`checkBtn isType_${value}`} htmlFor={`type_${value}`}>{value}</label>
                                        </>
                                    )
                                    
                                })}
                            </div>
                        </div>
                        <div className="Filter-form-color">
                            <p>Card Color</p>
                            <div className="Filter-form-type-cards">
                                {cardColor.map((value, index) => {
                                    return(
                                        <>
                                            <input type="checkbox" name="color[]" id={`color_${value}`} 
                                            value={value} checked={checkColor[value]} onChange={handleColorChange}/>
                                            <label className={`checkBtn isColor_${value}`} htmlFor={`color_${value}`}>{value}</label>
                                        </>
                                    )
                                    
                                })}
                            </div>
                        </div>
                        <div className="Filter-form-rarity">
                            <p>Card Rarity</p>
                            <div className="Filter-form-type-cards">
                                {cardRarity.map((value, index) => {
                                    return(
                                        <>
                                            <input type="checkbox" name="rarity[]" id={`rarity_${value}`} 
                                            value={value} checked={checkRarity[value]} onChange={handleRarityChange}/>
                                            <label className={`checkBtn isRarity_${value}`} htmlFor={`rarity_${value}`}>{value}</label>
                                        </>
                                    )
                                    
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="Filter-button">
                        <button type="submit" className="Filter-form-submit" onClick={fetchCardsCondition}>Filter</button>
                    </div>
                </form>
            </div>
            <div className="Search-card-result">
                {selectCard?.map( (item) => (
                    <div className="Search-card">
                        <a href="/card/001" className="card"><img className="card-img" src={require('../assets/images/OP01-001.png')} alt="OP01-001" /> </a>
                        <p className="Search-card-name">{item.name}</p>
                        <div className="Search-card-form">
                            <button type="submit" className="Search-card-button" card={item._id} onClick={addCardToCollection}>Collection</button>
                            <button type="submit" className="Search-card-button" card={item._id} onClick={addCardToWishlist}>Wishlist</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Filter

// <button onClick='' className="Filter-form-number">Sort by card number</button>

/*
{cardType.map((value, index) => {
                                    return(
                                        <>
                                            <input type="checkbox" name="type[]" id={`type_${value}`} 
                                            value={value} checked={checkType[index]} onChange={() => handleTypeChange(index, value)}/>
                                            <label className={`checkBtn isType_${value}`} for={`type_${value}`}>{value}</label>
                                        </>
                                    )
                                    
                                })}
                            */