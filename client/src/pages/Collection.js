import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"

function Collection() {
    const [data, setData] = useState([]);

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
                setData(res.data)
            }
        })
        .catch(err => console.log(err))
    }

    return(
        <div>
            <p>This will be the collection page yipe</p>
            <p>{!data ? "Loading..." : 
                <ul>
                    {data?.map( (item) => (
                        <li>{item.name} {item.deck}</li>
                    ))}
                </ul>
            }</p>
        </div>
    )
}

export default Collection


