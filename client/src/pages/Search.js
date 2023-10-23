import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"
import { deck, cardType, cardColor, cardRarity } from "../components/CardInfo";
import './Search.css'
import Card from "../components/Card";

function Search() {
    const [selectCard, setSelectCard] = useState([]);
    const [searchCard, setSearchCard] = useState('');
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
        await axios.get('/card')
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
                name: searchCard,
                deck: selectSet,
                type: type,
                rarity: rarity,
                color: color,
            }
        }

        await axios.get('/card/condition', params)
        .then(res => {
            setSelectCard(res.data)
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
        <div className="Search">
            <p className="Search-title">Search for cards</p>
            <div className="Search-search">
                <form className="Search-form">
                    <div className="Search-form-choose">
                        <input type="text" placeholder="Search Card..." id="searchCard" name="searchCard" value={searchCard} onChange={(e) => setSearchCard(e.target.value)} />
                        <SelectSetDropdown/>
                    </div>
                    <div className="Search-form-tags">
                        <div className="Search-form-type">
                            <p>Card Type</p>
                            <div className="Search-form-type-cards">
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
                        <div className="Search-form-color">
                            <p>Card Color</p>
                            <div className="Search-form-type-cards">
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
                        <div className="Search-form-rarity">
                            <p>Card Rarity</p>
                            <div className="Search-form-type-cards">
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
                    <div className="Search-button">
                        <button type="submit" className="Search-form-submit" onClick={fetchCardsCondition}>Search</button>
                    </div>
                </form>
            </div>
            <div className="Search-card-result">
                {selectCard?.map( (item) => (
                    <Card card={item} />
                ))}
            </div>
        </div>
    )
}

export default Search
