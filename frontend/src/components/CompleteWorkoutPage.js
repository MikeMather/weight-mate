import React from 'react';
import PageTitle from './PageTitle'
import SetList from './SetList';
import FloatingButton from './FloatingButton';
import uuid from 'uuid';
import Alert from './Alert';
import Request from '../utils/requests';
import SetTimer from '../components/SetTimer';
import Modal from '../components/Modal';

class CompleteWorkoutPage extends React.Component{
 
    constructor(props){
        super(props);
        this.state = {
            id: props.match.params ? props.match.params.id : 0,
            workoutId: props.match.params ? props.match.params.workoutId : 0,
            isComplete: false,
            name: "",
            exercises: [],
            timer: false,
            editModal: {
                exercise: undefined,
                show: false,
                value: undefined
            },
            alert: {
                show: false,
                type: 'success',
                message: 'Nice job!'
            }
        }
    }


    updateState = (res) => {
        this.setState(prevState => {
            const exercises = res.exercises;
            exercises.forEach(ex => {
                for (let i = ex.sets.length+1; i < ex.exercise.sets; i++){
                    ex.sets.push({
                        id: undefined,
                        reps: ex.exercise.reps,
                        incomplete: true
                    })
                }
            })
            return {
                ...prevState,
                name: res.workout.name,
                exercises: exercises
            }
        })
    }


    showAlert = (message1='', message2='', duration=2000, type='success') => {
        this.setState(prevState => ({
                ...prevState,
                alert: {
                    show: true,
                    type,
                    message: message1 || 'Nice job!'
                }
            }));
        const timeout = setTimeout(()=>{
            this.setState(prevState => ({
                ...prevState,
                alert: {
                    show: false,
                    type,
                    message: message2 || message1
                }
            }));
        }, duration);
    }

    syncOfflineData = () => {
        this.showAlert('Syncing...', 'Done');
        this.state.exercises.forEach(ex => {
            ex.sets.forEach(set => {
                if (set.id){
                    if (set.incomplete){
                        Request.delete("workout-session/sets/" + set.id);
                    }
                    else {
                        Request.post("workout-session/sets/" + set.id, {
                            reps: set.reps
                        });
                    }
                }
                else {
                    if (!set.incomplete){
                        Request.post("workout-session/sets/new", {
                            reps: set.reps,
                            exerciseId: ex.id
                        });
                    }
                }
            });
        });
        if (this.state.isComplete){
            this.completeWorkout();
        }
    }


    componentDidMount = () => {
        window.addEventListener('online',  this.syncOfflineData);
        this.syncOfflineData();
        if (navigator.onLine){
            if (this.state.id > 1){
                //Get the existing session
                Request.get('workout-session/' + this.state.id)
                .then(res => {
                    this.updateState(res);
                })
                .then(ignore => {
                    localStorage.setItem('activeWorkout', JSON.stringify(this.state))
                })
            }
            //Create a new one
            else {
                Request.post('workout-session', {
                    workoutId: this.state.workoutId
                })
                .then(res => {
                    this.updateState(res);
                    
                })
                .then(ignore => {
                    localStorage.setItem('activeWorkout', JSON.stringify(this.state))
                })
            }
        }
        else {
            this.setState(prevState => JSON.parse(localStorage.getItem('activeWorkout')));
        }
    }



    updateSet = (exerciseIndex, setIndex, sets) => {
        if (!this.state.isComplete){
            this.setState(prevState => {
                const exercises = prevState.exercises;
                exercises[exerciseIndex].sets[setIndex] = sets;
    
                if (navigator.onLine){
                    if (sets.id){
                        if (sets.incomplete){
                            Request.delete("workout-session/sets/" + sets.id);
                        }
                        else {
                            Request.post("workout-session/sets/" + sets.id, {
                                reps: sets.reps
                            });
                        }
                    }
                    else {
                        Request.post("workout-session/sets/new", {
                            reps: sets.reps,
                            exerciseId: exercises[exerciseIndex].id
                        });
                    }
                }
    
                return {
                    ...prevState,
                    exercises,
                    timer: !sets.incomplete
                }
            });
            localStorage.setItem('activeWorkout', JSON.stringify(this.state));
        }
        else {
            this.showAlert("You can't update a workout once you've submitted it", "", 2000, "error");
        }
    }


    completeWorkout = () => {
        this.setState(prevState => {
            const newState = {
                ...prevState,
                isComplete: true
            }
            localStorage.setItem('activeWorkout', JSON.stringify(newState));
            return newState;
        })
        if (navigator.onLine){
            Request.post('workout-session/' + this.state.id, {
                completed: true
            })
            .then(res => {
                this.props.history.push(`/`);
            });
        }
        else {
            this.showAlert('Nice job! Your workout will be submitted when you go back online', '', 3000);
            
        }
    }


    hideModal = (sync=false) => {
        if (sync){
            const exercise = this.state.exercises.filter(ex => {
                return ex.exercise.name === this.state.editModal.exercise;
            });
            const exerciseId = exercise[0].exercise.id;
            console.log(this.state.editModal.value);
            Request.post('exercise/' + exerciseId, {
                weight: exercise[0].exercise.weight
            });
        }
        
        this.setState(prevState => ({
            ...prevState,
            timer: false,
            editModal: {
                show: false,
                exercise: undefined,
                value: undefined,
            }
        }));
    }


    updateWeight = (e) => {
        const weight = e.target.value;
        let exerciseId = undefined;
        this.setState(prevState => {
            const newState = prevState;
            newState.exercises.forEach(ex => {
                if (ex.exercise.name === newState.editModal.exercise){
                    ex.exercise.weight = weight;
                    exerciseId = ex.exercise.id;
                }
            });
            return {
                ...newState,
            }
        })
    }

    showEditModal = (e) => {
        const exercise = e.target.parentElement.children[0].innerText;
        const value = parseInt(e.target.innerText);
        this.setState(prevState => ({
            ...prevState,
            editModal: {
                exercise,
                show: true,
                value
            }
        }));
    }

    render(){
        return (
            <div className="page" id="complete-workout">
                <PageTitle title={this.state.name}
                />
                <div className="todo-exercise-list">
                    {this.state.exercises.map((ex, index) => {
                        return ( <SetList weightChange={this.showEditModal} index={index} onComplete={this.showAlert} key={uuid()} exercise={ex} update={this.updateSet}/>)
                    })}
                </div>
                <FloatingButton text={"FINISH"} onClick={this.completeWorkout}/>
                <Alert show={this.state.alert.show} type={this.state.alert.type} text={this.state.alert.message}/>
                {this.state.timer && <SetTimer cancel={this.hideModal}/>}
                {this.state.editModal.show && 
                    <Modal cancel={() => {this.hideModal()}}>
                        <input onChange={this.updateWeight} defaultValue={this.state.editModal.value} onfocus="this.select();"/>
                        <a className="button button-alt" 
                            onClick={() => {this.hideModal(true)}}
                        ><i className="fa fa-check"></i></a>
                    </Modal>}
            </div>
        )
    }
}

export default CompleteWorkoutPage;