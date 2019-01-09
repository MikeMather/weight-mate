import React from 'react';
import uuid from 'uuid';

class TabPanel extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            tabs: props.tabs,
        }
    }

    show(e){
        Array.from(e.target.parentElement.children).forEach(link => {
            link.classList = [""];
        });
        e.target.classList = ["active"]
        const tab = document.getElementById(e.target.getAttribute('data-ref'));
        Array.from(tab.parentElement.parentElement.children).forEach((el)=> {
            el.style.display = "none";
        });
        tab.parentElement.style.display = "block";
    }


    render(){
        return (
            <div className="tab-panel">
                <div className="tab-panel__nav">
                    {this.state.tabs.map((tab, i) => (
                        <a key={uuid()} className={i==0 ? "active" : ''} onClick={this.show} data-ref={`${tab.ref}`}>{tab.text}</a>
                    ))}
                </div>
                <div className="panel-content">
                    {this.props.children.map(child => (
                            <div key={uuid()} className="panel-content__tab">
                                {child}
                            </div>
                        ))}
                </div>
            </div>
        )
    }


}

export default TabPanel;