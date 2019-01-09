import { BrowserRouter, Route, Switch } from 'react-router-dom';
import React from 'react';
import HomePage from '../components/HomePage';
import Sidebar from '../components/Sidebar';
import ExercisesPage from '../components/ExercisesPage';
import AddWorkoutPage from '../components/AddWorkoutPage';
import EditWorkoutPage from '../components/EditWorkoutPage';
import CompleteWorkoutPage from '../components/CompleteWorkoutPage';
import LoginPage from '../components/LoginPage';
import SignupPage from '../components/SignupPage';
import PrivateRoute from './PrivateRoute';
import Request from '../utils/requests';
import OfflineBanner from '../components/OfflineBanner';

class AppRouter extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            loggedIn: localStorage.getItem('token') ? true : false,
            username: '',
            offline: !navigator.onLine
        }
    }


    notifyOffline = () => {
        this.setState(prevState => ({
            ...prevState,
            offline: !navigator.onLine
        }));
    }


    componentDidMount(){
        if (this.state.loggedIn){
            Request.get('current-user/')
            .then(json => {
                this.setState({username: json.username})
            });
        }
        window.addEventListener('offline',  this.notifyOffline);
        window.addEventListener('online',  this.notifyOffline);
    }


    setLoggedIn = (vals) => {
        this.setState(prevState => vals)
    }


    setLoggedOut = () => {
        localStorage.removeItem('token');
        this.setState(prevState => ({loggedIn: false, username: ''}))
    }

    render() {
        return (
            <BrowserRouter>
                <div className="app">
                    <OfflineBanner offline={this.state.offline}/>
                    {this.state.loggedIn && <Sidebar loggedIn={this.state.loggedIn} onLogout={this.setLoggedOut}/>}
                    <Switch>
                        <PrivateRoute loggedIn={this.state.loggedIn} exact={true} path="/" component={HomePage}/>
                        <PrivateRoute loggedIn={this.state.loggedIn} exact={true} path="/exercises" component={ExercisesPage}/>
                        <PrivateRoute loggedIn={this.state.loggedIn} exact={true} path="/workouts/new" component={AddWorkoutPage}/>
                        <PrivateRoute loggedIn={this.state.loggedIn} exact={true} path="/workouts/edit/:id" component={EditWorkoutPage}/>
                        <PrivateRoute loggedIn={this.state.loggedIn} exact={true} path="/workouts/:id" component={CompleteWorkoutPage}/>
                        <PrivateRoute loggedIn={this.state.loggedIn} exact={true} path="/workouts/new/:workoutId" component={CompleteWorkoutPage}/>
                        <Route path="/login" render={(props) => <LoginPage loggedIn={this.state.loggedIn} onLogin={(vals) => {this.setState(prevState => vals)}}/>}/>
                        <Route path='/signup' render={(props) => <SignupPage onLogin={(vals) => {this.setState(prevState => vals)}}/>}/>
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}

export default AppRouter;