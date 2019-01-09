import React from 'react';
import Modal from './Modal';

class SetTimer extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            countdown: undefined,
            cancel: () => {
                    clearInterval(this.state.countdown);
                    props.cancel()
                }
        }
    }

    componentDidMount = () => {

        let interval = 60;
        const audio = new Audio('/beep.wav');
        this.state.countdown = setInterval(() => {
            document.getElementById("countdown-time").innerText = --interval;
            document.getElementById("countdown-progress").style.width = (100-Math.round((interval/60)*100, 0)) + "%";
            if (interval === 0){
                this.state.cancel()
            }
            if(interval <= 3){
                audio.play();
            }
          },1000);
    }

    render(){
        return (
            <Modal cancel={this.state.cancel}>
                <div className="countdown-wrapper">
                    <p id="countdown-time">100</p>
                    <span onClick={this.state.cancel}>&times;</span>
                    <span id="countdown-progress"></span>
                </div>
            </Modal>
        )
    }
}

export default SetTimer;