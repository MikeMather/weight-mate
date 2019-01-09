import React from 'react';

class ExerciseItem extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            name: props.name || "Unnamed",
            weight: props.weight || 0,
            workouts: props.workouts || undefined,
            sets: props.sets || undefined,
            reps: props.reps || 0,
            compact: props.compact ? 'card--compact' : '',
            wrap: props.wrap ? 'card--wrap' : ''
        }
    }

    getClassName(){
        let className = "card exercise-item ";
        className += this.state.compact + ' ' + this.state.wrap;
        return className;
    }

    render(){
        return (
            <div className={this.getClassName()}>
                <p className="card__name">{this.state.name}</p>
                    <p className="card__detail" onClick={this.props.onWeightClick}>{this.state.weight}lbs</p>
                {this.state.workouts && <p className="card__detail">Used in {this.state.workouts} workout(s)</p>}
                {this.state.sets && <p className="card__detail">{this.state.sets} x {this.state.reps}</p>}
                {this.props.children}
            </div>
        )
    }


}

export default ExerciseItem;