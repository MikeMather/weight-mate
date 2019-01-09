import React from 'react';
import WorkoutItem from './WorkoutItem';
import moment from 'moment';
import uuid from 'uuid';
import Request from '../utils/requests';

class WorkoutAgenda extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            weekdays: {
                "Monday": [],
                "Tuesday": [],
                "Wednesday": [],
                "Thursday": [],
                "Friday": [],
                "Saturday": [],
                "Sunday": [],
            },
            next: {}
        }
    }

    componentDidMount(){
        let newState = {};
        if (navigator.onLine){
            newState = this.state;
            Request.get('agenda')
            .then(res => {
                Array.from(res).forEach(event => {
                    const weekday = moment().weekday(event.weekday).format('dddd');
                    newState.weekdays[weekday].push({
                        id: event.id,
                        name: event.name,
                        exerciseCount: event.exercise_count
                    })
                    if (Object.keys(newState.next).length === 0 && event.weekday >= moment().weekday()){
                        newState.next = {
                            id: undefined,
                            workoutId: event.id,
                            name: event.name,
                            exerciseCount: event.exercise_count,
                            inProgress: false,
                            isNext: true
                        }
                    }
                })
                this.state = newState;
                localStorage.setItem('agenda', JSON.stringify(this.state))
            })
            .then(ignore => {
                return Request.get('in-progress')
            })
            .then(res => {
                if (res){
                    this.setState(prevState => ({
                        ...newState,
                        next: {
                            id: res.id,
                            workoutId: res.workout.id,
                            name: res.workout.name,
                            exerciseCount: res.exercises.map(ex => 1).reduce((a,b) => a + b),
                            inProgress: true,
                            isNext: false
                        }
                    }))
                }
                else {
                    this.setState(prevState => newState);
                }
                localStorage.setItem('agenda', JSON.stringify(this.state))
                
            })
            .catch(e => {})
        }
        else {
            this.setState(prevState => JSON.parse(localStorage.getItem('agenda')))
        }
        
    }


    collapseInner(e){
        const wrapper = e.target.parentElement.children[1];
        if (wrapper.classList.contains('closed')){
            wrapper.classList = ["agenda__week__wrapper"];
        }
        else {
            wrapper.classList = ["agenda__week__wrapper closed"];
        }
    }

    render(){
        return (
            <div className="agenda">
                {Object.keys(this.state.next)[0] && <WorkoutItem
                        id={this.state.next.id}
                        workoutId={this.state.next.workoutId}
                        name={this.state.next.name}
                        exerciseCount={this.state.next.exerciseCount}
                        isNext={this.state.next.isNext}
                        inProgress={this.state.next.inProgress}
                    />
                }
                <p className="agenda__title">Your Week</p>
                {Object.keys(this.state.weekdays).map(day => (
                    <div key={uuid()} className="agenda__week">
                        <p onClick={this.collapseInner}>{day}</p>
                        <div className="agenda__week__wrapper">
                            {this.state.weekdays[day].map(workout => ( 
                                <WorkoutItem
                                    key={uuid()}
                                    id={workout.id}
                                    name={workout.name}
                                    exerciseCount={workout.exerciseCount}
                                    isNext={false}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )
    }


}

export default WorkoutAgenda;