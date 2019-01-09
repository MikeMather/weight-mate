import React from 'react';

const PageTitle = (props) => (
    <div className="page-title">
        <h1 className="page-title__main">{props.title}</h1>
        <p className="page-title__sub">{props.subtitle}</p>
    </div>
);

export default PageTitle;