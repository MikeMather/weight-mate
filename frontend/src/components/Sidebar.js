import React from 'react';
import { NavLink } from 'react-router-dom';

class Sidebar extends React.Component{
 
    constructor(props){
        super(props);
        this.state = {
            logout: props.onLogout
        }
    }

    toggleSidebar(){
        const sidebar = document.getElementsByClassName('sidebar')[0];
        if (sidebar.classList.contains('open')){
            sidebar.classList = ["sidebar"];
        }
        else {
            sidebar.classList = ["sidebar open"];
        }
    }

    render(){
        return (
            <div className="sidebar">
                <div onClick={this.toggleSidebar} className="sidebar-toggle"><i className="fa fa-bars"></i></div>
                <div className="sidebar__content">
                <p className="app-title">Weight Mate</p>
                <i className="fas fa-dumbbell"></i>
                <ul className="sidebar__menu">
                    <li onClick={this.toggleSidebar}><NavLink exact to={`/`} activeClassName="active">Home</NavLink></li>
                    <li onClick={this.toggleSidebar}><NavLink to={`/exercises`} activeClassName="active">Exercises</NavLink></li>
                    <li onClick={this.toggleSidebar}><a onClick={this.state.logout} href="#">Logout</a></li>
                </ul>
            </div>
        </div>
        )
    }
}

export default Sidebar;