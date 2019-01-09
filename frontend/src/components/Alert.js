import React from 'react';


const Alert = (props) => (
    <div className={`alert alert--${props.type} ${props.show ? '': 'alert-hidden'}`}>
        <p>{props.text}</p>
    </div>
)

export default Alert;