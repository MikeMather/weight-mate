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

    editWorkout = (e) => {
        e.stopPropagation();
        if (navigator.onLine){
            this.props.history.push(`/workouts/edit/${this.state.workoutId}`)
        }
    }

    newWorkout = (e) => {
        if(this.state.inProgress){
            this.props.history.push(`/workouts/${this.state.id}`)
        }
        else {
            this.props.history.push(`/workouts/new/${this.state.workoutId}`)
        }
    }

    render(){
        let className = 'card';
        className = className.concat(this.state.inProgress ? " in-progress " : '')
        className = className.concat(this.state.isNext ? " next-workout" : '')
        
        return (
            <div onClick={this.newWorkout} className={className}>
                <p className="card__name">{this.state.name}</p>
                    <p className="card__detail">{this.state.inProgress ? "In progress" : this.state.exerciseCount + " exercises"}</p>
                <p className="card__detail">{this.state.lastCompleted}</p>
                {(!this.state.isNext && !this.state.inProgress) && <i onClick={this.editWorkout} className="edit-workout fas fa-edit"></i>}
            </div>
        )
    }


}

export default withRouter(WorkoutItem);