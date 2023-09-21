import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"

function Landing() {
    const [data, setData] = useState(null)
    //const [isLoggedIn, setLoginStatus] = useState(false);
	const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
	const [usernameLogin, setUsernameLogin] = useState('')
    const [passwordLogin, setPasswordLogin] = useState('')
	const [error, setError] = useState('')

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
			setError(<p className="success">{res.data}</p>)
			data.role === "admin" ? window.location.assign('/admin') :  window.location.assign('/search')
		})
		.catch(err => {
			console.log(err.message)
		})
        
    }

	const loginUser = async() => {
        const postData = {
            username: usernameLogin,
            password: passwordLogin
        }

        await axios.post('/login', postData)
        .then(res => setError(<p className="success">{res.data}</p>))
		//data.role === "admin" ?  window.location.assign('/admin') :  window.location.assign('/search')
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

	const handleLoginSubmit = (e) => {
        e.preventDefault()

        console.log(usernameLogin + ' | ' + passwordLogin)

        if (!usernameLogin) {
            setError(<p className="required">name is empty. Please type a name.</p>)
        } else {
            setError('')
        }

        setError('')
        loginUser()
    }


/*
    const getAllUsers = async () => {
		const data = await axios.get('/user');
		console.log(data);
	}


    const responseGoogle = async (response) => {
		const bodyObject = {
			authId: response.tokenId
		};
		try {
			if (isEmpty(response.errors)) {
				await axios.post('/login/user', bodyObject);
				setLoginStatus(true);
			}
		}
		catch (e) {
			console.log(e);
		}
	}

    const logout = async () => {
		try {
			await axios.get('/logout/user');
			setLoginStatus(false);
		}
		catch (e) {
			console.log(e);
		}
	}

	useEffect(() => {
		async function getStatus() {
			try {
				const data = await axios.get('/user/checkLoginStatus');
				console.log(data);
				if (isEmpty(data.error)) {
					setLoginStatus(true);
				}
			}
			catch (e) {
				console.log(e);
				setLoginStatus(false);
			}
		}
		getStatus();
	}, [])

*/
    return(
        <div>
            <p>This will be the landing page yipee</p>
            <p>{!data ? "Loading..." : data}</p>
			<p> Create user</p>
			<form className="createUserForm">
                <label>Username</label>
                <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />

                <label>Password</label>
                <textarea id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></textarea>
                {error}
                <button type="submit" onClick={handleCreateSubmit}>Submit</button>
            </form>
			<p> Already have an account? Login</p>
			<form className="loginForm">
                <label>Username</label>
                <input type="text" id="usernameLogin" name="usernameLogin" value={usernameLogin} onChange={(e) => setUsernameLogin(e.target.value)} />

                <label>Password</label>
                <textarea id="passwordLogin" name="passwordLogin" value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)}></textarea>
                {error}
                <button type="submit" onClick={handleLoginSubmit}>Submit</button>
            </form>
        
        </div>
    )
}

export default Landing