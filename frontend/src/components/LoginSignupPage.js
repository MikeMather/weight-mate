import React from 'react';
import PageTitle from './PageTitle';
import Alert from './Alert';
import { Redirect, Link } from 'react-router-dom';
import Request from '../utils/requests';


class LoginSignupPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            setLoggedIn: props.onLogin,
            isLogin: props.isLogin,
            isComplete: props.loggedIn,
            username: '',
            password: '',
            alert: {
                show: false,
                type: 'error',
                message: ''
            }
        }
    }

    handleLogin = (e) => {
        e.preventDefault(); 
        Request.post('token-auth/', {
                username: this.state.username,
                password: this.state.password
          })
            .then(res => {
                localStorage.setItem('token', res.token);
                this.state.setLoggedIn({
                    loggedIn: true,
                    username: res.user.username
                });
                this.setState(prevState => ({
                    ...prevState,
                    isComplete: true
                }))
            })
            .catch(error => {
                this.setState(prevState => ({
                    ...prevState,
                    alert: {
                        show: true,
                        type: 'error',
                        message: 'Invalid credentials'
                    }
                }))
                const timeout = setTimeout(() => {
                    this.setState(prevState => ({
                        ...prevState,
                        alert: {
                            show: false,
                            type: 'error',
                            message: ''
                        }
                    }))
                }, 3000)
          });
    }

    handleSignup = (e) => {
        e.preventDefault(); 
        Request.postWithoutAuth('users/', {
                username: this.state.username,
                password: this.state.password
          }, false)
            .then(res => {
                localStorage.setItem('token', res.token);
                this.state.setLoggedIn({
                    loggedIn: true,
                    username: res.username
                });
                this.setState(prevState => ({
                    ...prevState,
                    isComplete: true
                }))
            })
            .catch(error => {
                console.log(error)
                this.setState(prevState => ({
                    ...prevState,
                    alert: {
                        show: true,
                        type: 'error',
                        message: 'Invalid credentials'
                    }
                }))
                const timeout = setTimeout(() => {
                    this.setState(prevState => ({
                        ...prevState,
                        alert: {
                            show: false,
                            type: 'error',
                            message: ''
                        }
                    }))
                }, 3000)
          });
    }


    handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevState => {
            const newState = {...prevState};
            newState[name] = value;
            return newState;
        })
    }

    render(){
        return (
                this.state.isComplete ? <Redirect
                to={{
                  pathname: "/"
                }}
              /> : <div className="page">
                        <PageTitle title={this.state.isLogin ? "Login" : "Sign Up"}
                        />
                        <div className="card card--borderless login-form">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="username">Username:</label>
                                    <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password:</label>
                                    <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
                                </div>
                                <button type="submit" className="button" onClick={this.state.isLogin ? this.handleLogin : this.handleSignup}>Submit</button>
                                {this.state.isLogin ? <Link className="signup-link" to={'/signup'}>Or sign up</Link> : undefined}
                            </form>
                        </div>
                        <Alert show={this.state.alert.show} type={this.state.alert.type} text={this.state.alert.message}/>
                    </div>
        )
    }

}

export default LoginSignupPage;