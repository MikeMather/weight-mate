import React from 'react';
import { Link } from 'react-router-dom';

const FloatingButton = (props) => {
    return (
        props.to ? 
            <Link className="button floating-button" 
        to={props.to}
        >{props.text}</Link> : 
            <button className="button floating-button" 
        onClick={props.onClick}
        >{props.text}</button>
    )
}

export default FloatingButton;