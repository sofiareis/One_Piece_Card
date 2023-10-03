import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"
import './Landing.css';

function Login() {
	const [usernameLogin, setUsernameLogin] = useState('')
    const [passwordLogin, setPasswordLogin] = useState('')
	const [error, setError] = useState('')

	const loginUser = async() => {
        const postData = {
            username: usernameLogin,
            password: passwordLogin
        }
        await axios.post('/login', postData)
        .then(res => {
            if(res.status === 201){
                localStorage.setItem("user", JSON.stringify(res.data.user))
                window.location.assign('/search')
            }
            console.log(res)
			setError(<p className="success">{res.data.message}</p>)
        }).catch(err => {
            setError(<p className="error">{err.response.data.error}</p>)
            console.log(err.response.data.message)
		})
    }

	const handleLoginSubmit = (e) => {
        e.preventDefault()

        if (!usernameLogin) {
            setError(<p className="required">Name is empty. Please type a name.</p>)
        } else {
            setError('')
        }
        setError('')
        loginUser();
    }

    return(
            <div className="Landing">
                    <p className="Landing-body-title"> Already have an account? Welcome back! Login please</p>
                    <form className="createUserForm">
                        <div className="form-option">
                            <label>Username</label>
                            <input type="text" id="usernameLogin" name="usernameLogin" value={usernameLogin} onChange={(e) => setUsernameLogin(e.target.value)} />
                        </div>
                        <div className="form-option">
                            <label>Password</label>
                            <input type="password" id="passwordLogin" name="passwordLogin" value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)}></input>
                            {error}
                            <button type="submit" onClick={handleLoginSubmit}>Login</button>
                        </div>
                    </form>
            </div>
    )
}

export default Login