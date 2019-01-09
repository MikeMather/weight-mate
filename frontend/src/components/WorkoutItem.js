import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

class WorkoutItem extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            id: props.id || 1,
            workoutId: props.workoutId,
            name: props.name || "Unnamed",
            exercisesCompleted: props.exercisesCompleted || 0,
            exerciseCount: props.exerciseCount || 0,
            lastCompleted: props.lastCompleted ? moment(props.lastCompleted).fromNow() : '',
            inProgress: props.inProgress || false,
            isNext: props.isNext || false
        }
    }

    goToWorkout = (e) => {
        if (this.state.isNext){
            this.props.history.push(`/workouts/new/${this.state.workoutId}`)
        }
        else if(this.state.inProgress){
            this.props.history.push(`/workouts/${this.state.id}`)
        }
        else {
            if (navigator.onLine){
                this.props.history.push(`/workouts/edit/${this.state.id}`)
            }
        }
    }

    render(){
        let className = 'card';
        className = className.concat(this.state.inProgress ? " in-progress " : '')
        className = className.concat(this.state.isNext ? " next-workout" : '')
        
        return (
            <div onClick={this.goToWorkout} className={className}>
                <p className="card__name">{this.state.name}</p>
                    <p className="card__detail">{this.state.inProgress ? "In progress" : this.state.exerciseCount + " exercises"}</p>
                <p className="card__detail">{this.state.lastCompleted}</p>
            </div>
        )
    }


}

export default withRouter(WorkoutItem);