import React from 'react';
import AddWorkoutPage from './AddWorkoutPage';

const EditWorkoutPage = (props) => (
    <AddWorkoutPage history={props.history} workoutId={props.match.params} editing={true}/>
)

export default EditWorkoutPage;