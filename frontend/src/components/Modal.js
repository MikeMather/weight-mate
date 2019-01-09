import React from 'react';


class Modal extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            cancel: props.cancel
        }
    }

    componentDidMount = () => {

        document.getElementById("modal-fade").addEventListener('click', (e) => {
            this.state.cancel();
        });
    }

    render(){
        return (
            <div className="modal-wrapper">
                <div id="modal-fade"></div>
                <div className="modal">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Modal;