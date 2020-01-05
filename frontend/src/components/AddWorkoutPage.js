import React from 'react';
import PageTitle from './PageTitle'
import ExerciseItem from './ExerciseItem';
import TabPanel from './TabPanel';
import uuid from 'uuid';
import Alert from './Alert';
import Request from '../utils/requests';

class AddWorkoutPage extends React.Component{
 
    constructor(props){
        super(props);
        this.state = {
            workout: 
                {
                    id: this.props.workoutId ? this.props.workoutId.id : undefined,
                    name: "",
                    weekdays: [],
                    exercises: []
                },
            existingExercises: [],
            error: undefined,
            editing: props.editing,
            editingExercise: {
                id: undefined,
                name: '',
                weight: 0,
                sets: 0,
                reps: 0
            },
            alert: {
                show: false,
                type: 'error',
                message: ''
            }
        }
    }
 

    componentDidMount() {
        if (this.state.editing){
            //Get the workout if we're editing it
            Request.get('workout/' + this.state.workout.id)
            .then(res => {
                this.setState(prevState => ({
                    ...prevState,
                    workout: {
                        ...prevState.workout,
                        name: res.name,
                        weekdays: res.weekdays.map(w => w.weekday),
                        exercises: res.exercises
                    }
                }))
            })
        }
        
        //Get existing exercises
        Request.get('exercise')
        .then(res => {
            this.setState(prevState => ({
                ...prevState,
                existingExercises: res
            }))
        })
    }


    deleteExercise(e){
        e.preventDefault();
        e.target.parentElement.className += " item--deleted";
        let targetId = e.target.getAttribute('data-ref');
        if (!targetId){
            targetId = e.target.parentElement.getAttribute('data-ref');
        }
        //Timeout to allow for the delete animation
        const timeout = setTimeout(() => {
            this.setState((prevState) => {
                const exercises = prevState.workout.exercises.filter((e) => {
                    return e.id != targetId;
                });
                return {
                    ...prevState,
                    workout: {
                        ...prevState.workout,
                        exercises: exercises[0] ? exercises : [],
                    }
                }
            })}, 600);
    }

    addExistingExercise(e){
        e.preventDefault();
        const elements = e.target.parentElement.children;
        const selected = elements[1].value;
        const added = this.state.existingExercises.find(e => e.name === selected);
        const sets = parseInt(elements[2].children[1].value);
        const reps = parseInt(elements[2].children[3].value);
        
        if (!sets || !reps){
            this.setState(prevState => ({
                ...prevState,
                error: "Please enter a valid input"
            }))
            return
        }

        elements[2].children[3].value = "";
        elements[2].children[1].value = "";
    
        this.setState(prevState => {
            const exercises = prevState.workout.exercises;
            if (!exercises.find(e => e.name === added.name)){
                exercises.push({
                        name: added.name, 
                        id: added.id,
                        weight: added.weight,
                        sets,
                        reps
                    });
            }
            else {
                return {
                    ...prevState,
                    error: "That exercise already exists"
                }
            }
            return {
                ...prevState,
                workout: {
                    ...prevState.workout,
                    exercises
                },
                error: undefined
            }
        })
    }

    addNewExercise(e){
        e.preventDefault();
        const elements = e.target.parentElement.children;
        const newExercise = this.state.editingExercise;

        if (newExercise.name == '' || !newExercise.weight || !newExercise.sets || !newExercise.reps){
            this.setState(prevState => ({
                ...prevState,
                error: "Please enter a valid value"
            }))
            return
        }
        elements[1].value = "";
        elements[3].value = "";
        elements[4].children[1].value = "";
        elements[4].children[3].value = "";
        if (this.state.editingExercise.id){
            this.setState(prevState => {
                const exercises = prevState.workout.exercises;
                exercises.push(newExercise);
                return {
                    ...prevState,
                    workout: {
                        ...prevState.workout,
                        exercises
                    },
                    error: undefined,
                    editingExercise: {
                        name: '',
                        id: undefined,
                        weight: 0,
                        sets: 0,
                        reps: 0
                    }
                }
            })
        }
        else {
            this.setState(prevState => {
                const exercises = prevState.workout.exercises;
                const index = exercises.map(ex => ex.id).indexOf(prevState.editExercise.id);
                exercises[index] = prevState.editingExercise;
                return {
                    ...prevState,
                    workout: {
                        ...prevState.workout,
                        exercises
                    },
                    error: undefined,
                    editingExercise: {
                        name: '',
                        id: undefined,
                        weight: 0,
                        sets: 0,
                        reps: 0
                    }
                }
            })
        }
        
    }


    clearEditingExercise = (e) => {
        this.setState(prevState => ({
            ...prevState,
            editingExercise: {
                id: undefined,
                name: '',
                weight: 0,
                sets: 0,
                reps: 0
            }
        }));
    }

    isSelected = (day) => {
        return this.state.workout.weekdays.includes(day) ? "multi-select__item selected" : "multi-select__item"
    }

    selectWeekday = (e) => {
        e.persist();
        this.setState(prevState => {
            let weekdays = prevState.workout.weekdays;
            const targetId = parseInt(e.target.getAttribute('data-id'));
            if (weekdays.includes(targetId)){
                weekdays = weekdays.filter(d => d != targetId);
            }
            else {
                weekdays.push(targetId);
            }
            return {
                ...prevState,
                workout: {
                    ...prevState.workout,
                    weekdays
                }
            }
        })
    }


    handleSubmit = (e) => {
        e.preventDefault();
        Request.post(`workout/${this.state.editing ? 'update' : 'create'}`, this.state.workout)
        .then(res => {
            this.setState(prevState => ({
                ...prevState,
                alert: {
                    show: true,
                    type: 'success',
                    message: this.state.editing ? 'Your changes have been saved' : 'New workout created'
                }
            }))
            const timeout = setTimeout(() => {
                this.props.history.push('/')
            }, 1000)
        })
        .catch(res => {
            this.setState(prevState => ({
                ...prevState,
                alert: {
                    show: true,
                    type: 'error',
                    message: 'There was a problem creating a workout'
                }
            }))
        })
    }


    handleNameChange = (e) => {
        const name = e.target.value;
        this.setState(prevState => ({
            ...prevState,
            workout: {
                ...prevState.workout,
                name
            }
        }))
    }


    handleExerciseClick = (index) => {
        if (!this.state.editingExercise.id){
            this.setState(prevState => {
                const editExercise = prevState.workout.exercises[index];
                return {
                    ...prevState,
                    editingExercise: editExercise
                };
            })
        }
    }

    render(){
        return (
            <div className="page">
                <PageTitle title={this.state.editing ? "Edit workout" : "New Workout"}
                />
                <div className="card card--borderless form">
                    <form>
                        <label htmlFor="name">Name:</label>
                        <input type="text" name="name" value={this.state.workout.name} onChange={this.handleNameChange}/>
                        <label htmlFor="weekday">Weekday:</label>
                        <div className="multi-select">
                            <p data-id="1" onClick={this.selectWeekday} className={this.isSelected(1)}>Monday</p>
                            <p data-id="2" onClick={this.selectWeekday} className={this.isSelected(2)}>Tuesday</p>
                            <p data-id="3" onClick={this.selectWeekday} className={this.isSelected(3)}>Wednesday</p>
                            <p data-id="4" onClick={this.selectWeekday} className={this.isSelected(4)}>Thursday</p>
                            <p data-id="5" onClick={this.selectWeekday} className={this.isSelected(5)}>Friday</p>
                            <p data-id="6" onClick={this.selectWeekday} className={this.isSelected(6)}>Saturday</p>
                            <p data-id="0" onClick={this.selectWeekday} className={this.isSelected(0)}>Sunday</p>
                        </div>
                        <div className="exercise-list">
                            {this.state.workout.exercises.map((exercise, index) => {
                                return (
                                    <div key={index} className="exercise-list__item" onClick={(e) => this.handleExerciseClick(index)}>
                                        <ExerciseItem
                                            name={exercise.name}
                                            weight={exercise.weight}
                                            sets={exercise.sets}
                                            reps={exercise.reps}
                                            compact={true}
                                        >
                                            <button data-ref={exercise.id} onClick={(e) => this.deleteExercise(e)} className="button button-delete">
                                                <i className="fa fa-plus"></i>
                                            </button>
                                        </ExerciseItem>
                                    </div>
                                )
                            })}
                        </div>
                        <p className="form__section__title card__name">Add Exercises</p>
                        <TabPanel activeTab={this.state.editingExercise.id ? 1 : 0} tabs={[{text: "Add existing", ref: "one"}, {text: "Add new", ref: "two"}]}>
                            <div id="one" className="new-exercise-form">
                                <label htmlFor="existing-exercises">Choose from existing:</label>
                                <select name="existing-exercises">
                                    {this.state.existingExercises.length ? this.state.existingExercises.map((exercise, index) => {
                                        return (
                                            <option key={uuid()}>{exercise.name}</option>
                                        )
                                    }) : undefined}
                                </select>
                                <div className="reps-sets-input">
                                    <label>Sets: </label>
                                    <input type="text" className="number-input"></input>
                                    <label>Reps: </label>
                                    <input type="text" className="number-input"></input>
                                </div>
                                <button onClick={this.addExistingExercise.bind(this)} className="button button-alt">Add</button>
                            </div>
                            <div id="two" className="new-exercise-form">
                                <label htmlFor="exercise-name">Name:</label>
                                <input 
                                    name="exercise-name" 
                                    type="text"
                                    value={this.state.editingExercise.name}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        this.setState(prevState => ({
                                            ...prevState,
                                            editingExercise: {
                                                ...prevState.editingExercise,
                                                name: val
                                            }
                                        }))
                                    }}
                                />
                                <label placeholder="lbs" htmlFor="exercise-weight">Starting weight:</label>
                                <input 
                                    className="number-input" 
                                    name="exercise-weight"
                                    value={this.state.editingExercise.weight}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        this.setState(prevState => ({
                                            ...prevState,
                                            editingExercise: {
                                                ...prevState.editingExercise,
                                                weight: val
                                            }
                                        }))
                                    }}
                                />
                                <div className="reps-sets-input">
                                    <label>Sets: </label>
                                    <input 
                                        type="text" 
                                        className="number-input" 
                                        value={this.state.editingExercise.sets}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            this.setState(prevState => ({
                                                ...prevState,
                                                editingExercise: {
                                                    ...prevState.editingExercise,
                                                    sets: val
                                                }
                                            }))
                                        }}
                                    />
                                    <label>Reps: </label>
                                    <input 
                                        type="text" 
                                        className="number-input" 
                                        value={this.state.editingExercise.reps}
                                        onChange={(e) => {
                                            this.setState(prevState => ({
                                                ...prevState,
                                                editingExercise: {
                                                    ...prevState.editingExercise,
                                                    reps: e.target.value
                                                }
                                            }))
                                        }}
                                    />
                                </div>
                                <i onClick={this.addNewExercise.bind(this)} className="fa fa-check button-alt"></i>
                                <i onClick={this.clearEditingExercise.bind(this)} className="fa fa-times button-alt button-delete"></i>
                            </div>
                        </TabPanel>
                        {this.state.error && <p>{this.state.error}</p>}
                        <button type="submit" className="button form__submit" onClick={this.handleSubmit}>Submit</button>
                    </form>
                </div>
                <Alert show={this.state.alert.show} type={this.state.alert.type} text={this.state.alert.message}/>
            </div>
        )
    }
}

export default AddWorkoutPage;