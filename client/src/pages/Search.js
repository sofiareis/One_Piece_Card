import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"

function Search() {
    const [data, setData] = useState(null);
    const [selectData, setSelectData] = useState([]);
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [selectValue, setSelectValue] = useState('')

    useEffect(() => {
        let processing = true
        fetchCards(processing)
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

    const fetchCards = async(processing) => {
        await axios.get('/card')
        .then(res => {
            if (processing) {
                setSelectData(res.data)
            }
        })
        .catch(err => console.log(err))
    }

    const axiosPostData = async() => {
        const postData = {
            name: name,
            email: email
        }

        await axios.post('/user', postData)
        .then(res => setError(<p className="success">{res.data}</p>))
    }

    const SelectDropdown = () => {
        return (
            <select value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
                <option value="" key="none"> -- Select One -- </option>
                {
                    selectData?.map( (item) => (
                        <option value={item.name} key={item.name}>{item.name}</option>
                    ))
                }
            </select>
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        console.log(email + ' | ' + name + ' | ' + selectValue)

        if (!name) {
            setError(<p className="required">name is empty. Please type a name.</p>)
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

                <label>Name</label>
                <textarea id="name" name="name" value={name} onChange={(e) => setName(e.target.value)}></textarea>
                
                {error}
                
                <label>Which card do you want?</label>
                <SelectDropdown />

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