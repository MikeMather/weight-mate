import React from 'react';
import PageTitle from './PageTitle'
import ExerciseItem from './ExerciseItem';
import uuid from 'uuid';
import Request from '../utils/requests';

class ExercisesPage extends React.Component{
 
    constructor(props){
        super(props);
        this.state = {
            exercises: []
        }
    }
 
    componentDidMount(){
        Request.get('exercise')
        .then(res => {
            this.setState({
                exercises: res
            })
        })
    }

    render(){
        return (
            <div className="page">
                <PageTitle title="Exercises"
                            subtitle="Your exercise list"
                />
                {this.state.exercises.map((item)=>{
                    return (
                        <ExerciseItem
                            key={uuid()}
                            name={item.name}
                            weight={item.weight}
                            workouts={item.workout_count}
                        />
                    )
                })}
            </div>
        )
    }
}

export default ExercisesPage;