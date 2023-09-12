import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"

function Search() {
    const [data, setData] = useState(null);
    const [selectData, setSelectData] = useState([]);
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [selectValue, setSelectValue] = useState('')

    useEffect(() => {
        let processing = true
        axiosFetchData(processing)
        axiosFetchApi(processing)
        return () => {
            processing = false
        }
    }, []);

    const axiosFetchApi = async(processing) => {
        await axios.get('/api')
        .then(res => {
            if (processing) {
                setData(res.data.message)
            }
        })
        .catch(err => console.log(err))
    }

    const axiosFetchData = async(processing) => {
        await axios.get('/users')
        .then(res => {
            if (processing) {
                setSelectData(res.data)
            }
        })
        .catch(err => console.log(err))
    }

    const axiosPostData = async() => {
        const postData = {
            email: email,
            website: selectValue,
            message: message
        }

        await axios.post('http://localhost:3001/contact', postData)
        .then(res => setError(<p className="success">{res.data}</p>))
    }

    const SelectDropdown = () => {
        return (
            <select value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
                <option value="" key="none"> -- Select One -- </option>
                {
                    selectData?.map( (item) => (
                        <option value={item.website} key={item.website}>{item.website}</option>
                    ))
                }
            </select>
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        console.log(email + ' | ' + message + ' | ' + selectValue)

        if (!message) {
            setError(<p className="required">Message is empty. Please type a message.</p>)
        } else {
            setError('')

        }

        setError('')
        axiosPostData()
    }

    return(
        <div>
            <p>This will be the search page yipee</p>
            <p>{!data ? "Loading..." : data}</p>

            <form className="contactForm">
                <label>Email</label>
                <input type="text" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <label>How Did You Hear About Us?</label>
                <SelectDropdown />

                <label>Message</label>
                <textarea id="message" name="message" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                
                {error}

                <button type="submit" onClick={handleSubmit}>Submit</button>
            </form>

            <ul className="search-card">
                <li>
                    <a href="/card/001" className="card"><img className="card-img" src={require('../assets/images/OP01-001.png')} alt="OP01-001" /> </a>
                </li>
            </ul>
        </div>
    )
}

export default Search