import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"
import { getCurrentUser } from "../services/auth.service";

function Collection() {
    const [data, setData] = useState([]);
    const user = getCurrentUser();
    useEffect(() => {
        let processing = true
        //getcurrent(processing)
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
    

    /*
    const getcurrent = async(processing) => {
        await axios.get('/currentUser')
        .then(res => {
            if (processing) {
                setUser(res.data)
            }
        })
        .catch(err => console.log(err))
    }
    */

    return(
        <div>
            <p>This will be the collection page yipe</p>
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

export default Collection


