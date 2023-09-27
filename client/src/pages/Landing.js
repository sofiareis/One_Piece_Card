import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"
import './Landing.css';

function Landing() {
    const [data, setData] = useState(null)
	const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
	const [usernameLogin, setUsernameLogin] = useState('')
    const [passwordLogin, setPasswordLogin] = useState('')
	const [error, setError] = useState('')
    const [form, setForm] = useState(null)

    useEffect(() => {
        let processing = true
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
                res.data.user === "admin" ? window.location.assign('/search') :  window.location.assign('/collection')
            }
			setError(<p className="success">{res.data.message}</p>)
		})
		.catch(err => {
			setError(<p className="error">{err.response.data.error}</p>)
            console.log(err.response.data.message)
            //setData("loaded")
		})
        
    }

	const loginUser = async() => {
        const postData = {
            username: usernameLogin,
            password: passwordLogin
        }
        await axios.post('/login', postData)
        .then(res => {
            if(res.status === 201){
                localStorage.setItem("user", JSON.stringify(res.data.user))
                console.log(res.data.user)
                res.data.user.role === "admin" ? window.location.assign('/search') :  window.location.assign('/collection')
            }
            console.log(res)
			setError(<p className="success">{res.data.message}</p>)
        }).catch(err => {
            setError(<p className="error">{err.response.data.error}</p>)
            console.log(err.response.data.message)
           // setData("loaded")
		})
    }

	const handleCreateSubmit = (e) => {
        e.preventDefault()
        //setData(null);
        console.log(username + ' | ' + password)
        if (!username) {
            setError(<p className="required">name is empty. Please type a name.</p>)
        } else {
            setError('')
        }

        setError('')
        createUser()
    }

	const handleLoginSubmit = (e) => {
        e.preventDefault()
        //setData(null);
        console.log(usernameLogin + ' | ' + passwordLogin)
        if (!usernameLogin) {
            setError(<p className="required">name is empty. Please type a name.</p>)
        } else {
            setError('')
        }
        setError('')
        loginUser();
        
        /*
        loginUser(usernameLogin, passwordLogin)
        .then(role => {    
                //role === "admin" ? window.location.assign('/search') :  window.location.assign('/collection')
        }).catch(err=>{
            setData("loaded")
            //setError(<p className="error">{err}</p>)
        })
        */
    }

    const handleSignin = (e) => {
        setForm('signin')
    }
    const handleCreate = (e) => {
        setForm('create')
    }

    return(
        <div>
            <div>{!data ? "Loading..." : 
            <div className="Landing">
                <header className="Landing-header">
                    <p className="Landing-title">One piece cards and figures tracker!</p>
                    <p className="Landing-subtitle">Because just like me you might need something to help you track it</p>
                    <div className="Landing-options">
                    <button className="Landing-button" type="submit" onClick={handleSignin}>Sign in</button>
                    <button className="Landing-button" type="submit" onClick={handleCreate}>Create Account</button>
                </div> 
                </header>
                <div>{form == 'create' ? 
                <div className="Landing-form">
                    <p className="Landing-body-title"> New here? Create an user</p>
                    <form className="createUserForm">
                        <div className="form-option">
                            <label>Username</label>
                            <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="form-option">
                            <label>Password</label>
                            <textarea id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></textarea>
                            {error}
                        </div>
                        <button type="submit" onClick={handleCreateSubmit}>Create User</button>
                    </form>
                </div>
                : 
                <div className="Landing-login">
                    <p className="Landing-body-title"> Already have an account? Welcome back! Login please</p>
                    <form className="createUserForm">
                    <div className="form-option">
                        <label>Username</label>
                        <input type="text" id="usernameLogin" name="usernameLogin" value={usernameLogin} onChange={(e) => setUsernameLogin(e.target.value)} />
                    </div>
                    <div className="form-option">
                        <label>Password</label>
                        <textarea id="passwordLogin" name="passwordLogin" value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)}></textarea>
                        {error}
                        <button type="submit" onClick={handleLoginSubmit}>Login</button>
                    </div>
                    </form>
                </div>
                }</div>
                <div className="Landing-about">
                    <p>WOw track cards yipee</p>
                </div>
                
            </div>}
            </div>
        
        </div>
    )
}

export default Landing