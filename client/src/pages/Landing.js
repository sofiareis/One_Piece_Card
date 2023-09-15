import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"
import GoogleLogin from 'react-google-login';
require('dotenv').config();

function Landing() {
    const [data, setData] = useState(null);
    const [isLoggedIn, setLoginStatus] = useState(false);

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


    return(
        <div>
            <p>This will be the landing page yipee</p>
            <p>{!data ? "Loading..." : data}</p>
            <body>
				<GoogleLogin
					clientId={process.env.CLIENT_ID}
					render={renderProps => (
						<button className='btn g-sigin'
							onClick={renderProps.onClick}
							disabled={renderProps.disabled}
						>
							<p>Continue with Google</p>
						</button>
					)}
					buttonText="Login"
					onSuccess={responseGoogle}
					onFailure={responseGoogle}
					cookiePolicy={'single_host_origin'}
				/>
				<button onClick={getAllUsers}>Get All Users in db</button>
				{isLoggedIn &&
					<button onClick={logout}>Logout</button>
				}
			</body>
            
        </div>
    )
}

export default Landing