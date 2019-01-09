import React from 'react';
import PageTitle from './PageTitle'
import WorkoutAgenda from './WorkoutAgenda';
import FloatingButton from './FloatingButton';


class HomePage extends React.Component{
 
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="page">
                <PageTitle title="Home"
                            subtitle="Your upcoming workouts"
                />
                <WorkoutAgenda/>
                {navigator.onLine && <FloatingButton text={"NEW"} to={'/workouts/new'}/>}
            </div>
        )
    }
}

export default HomePage;