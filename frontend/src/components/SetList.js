import React from 'react';
import ExerciseItem from './ExerciseItem';
import uuid from 'uuid';

class SetList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            index: props.index,
            name: props.exercise.exercise.name,
            weight: props.exercise.exercise.weight,
            reps: props.exercise.exercise.reps,
            sets: props.exercise.sets,
            onComplete: props.onComplete,
            updateWorkout: props.update
        };
    }

    
    completeSet = e => {
        const index = parseInt(e.target.parentElement.parentElement.getAttribute('data-index'));
        if (!isNaN(index)){
            this.setState(prevState => {
                const sets = prevState.sets;
                sets[index].incomplete = !sets[index].incomplete;
                prevState.updateWorkout(prevState.index, index, sets[index]);
                if (sets.map(x => !x.incomplete).reduce((x, y) => x && y)){
                    prevState.onComplete();
                }
                return {
                    ...prevState,
                    sets
                }
            })
        }
    }

    updateReps = (e) => {
        const index = e.target.parentElement.getAttribute('data-index');
        const val = e.target.value;
        this.setState(prevState => {
            const newState = prevState;
            newState.sets[index].reps = parseInt(val);
            return {
                ...newState
            };
        });
    }


    render(){
        return (
            <ExerciseItem
                name={this.state.name}
                weight={this.state.weight}
                onWeightClick={this.props.weightChange}
                sets={this.state.sets.length}
                reps={this.state.reps}
                compact={true}
                wrap={true}
                >
                <div className="set-list">
                    {this.state.sets.map((set, index) => {
                        return (
                            <div key={uuid()} data-index={index} className="set-list__set">
                                <input type="number" autofocus className="number" defaultValue={set.reps} onfocus="this.select();" onChange={this.updateReps}/>
                                <a onClick={this.completeSet} className={`button button-alt ${!set.incomplete ? 'completed' : ''}`}><i className="fa fa-check"></i></a>
                            </div>
                        )
                    })}
                </div>
            </ExerciseItem>
        )
    }



}

export default SetList;