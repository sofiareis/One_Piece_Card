import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"
import './Landing.css';

function SignUp() {
    const [data, setData] = useState(null)
	const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
	const [error, setError] = useState('')
    
	const createUser = async() => {
        const postData = {
            username: username,
            password: password
        }

        await axios.post('/user', postData)
        .then(res => {
            if(res.status === 201){
                localStorage.setItem("user",  JSON.stringify(res.data.user))
                console.log(res.data.user)
                window.location.assign('/collection')
            }
			setError(<p className="success">{res.data.message}</p>)
		})
		.catch(err => {
			setError(<p className="error">{err.response.data.error}</p>)
            console.log(err.response.data.message)
		})
        
    }
	
	const handleCreateSubmit = (e) => {
        e.preventDefault()
        console.log(username + ' | ' + password)
        if (!username) {
            setError(<p className="required">name is empty. Please type a name.</p>)
        } else {
            setError('')
        }

        setError('')
        createUser()
    }

    return(
            <div className="Landing">
                <p className="Landing-body-title"> New here? Create an user</p>
                <form className="createUserForm">
                    <div className="form-option">
                        <label>Username</label>
                        <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="form-option">
                        <label>Password</label>
                        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        {error}
                    </div>
                    <button type="submit" onClick={handleCreateSubmit}>Create User</button>
                </form>
            </div>  
    )
}

export default SignUp