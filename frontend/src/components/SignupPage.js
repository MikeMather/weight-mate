import React from 'react';
import LoginSignupPage from './LoginSignupPage';


const SignupPage = (props) => (
    <LoginSignupPage isLogin={false} onLogin={props.onLogin}/>
)

export default SignupPage;