import React from 'react';
import LoginSignupPage from './LoginSignupPage';


const LoginPage = (props) => (
    <LoginSignupPage loggedIn={props.loggedIn} isLogin={true} onLogin={props.onLogin}/>
)

export default LoginPage;