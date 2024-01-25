
// Calorie Tracker Part (project_diagram.png - green)
class CalorieTracker {
    constructor() { // The constructor runs immediately when the class is instanciated
        this._calorieLimit = 2200  // _ because we want to juse the property just in this class
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        this._displayCaloriesLimit();   // To display the calorie limit
        this._displayCaloriesTotal();   // To display the total calories
        this._displayCaloriesConsumed();   // To display all consumed calories
        this._displayCaloriesBurned();   // To display all burned calories
        this._displayCaloriesRemaining();   // To display the remaining calories
        this._displayCaloriesProgress();    // To display the calorie progress
    }

    // Public Methods / API's (public API's to use outside of the class)
    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._displayNewMeal(meal);
        this._render(); // To render / update the values (total calories) - DOM
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        this._displayNewWorkout(workout);
        this._render(); // To render / update the values (total calories) - DOM
    }

    removeMeal(id) {
        const index = this._meals.findIndex((meal) => meal.id === id);  // Loops through the meals array - each element is an meal object which has an id key-value pair - findIndex() gives -1 if it doesn't match
        if (index !== -1) { // For the case that a meal with the correct ID was found
            const meal = this._meals[index];    // To separat the resprective meal from the _meals array
            this._totalCalories -= meal.calories;   // To subtract the calories of the meal which will be deleted
            this._meals.splice(index, 1);   // To delete the respective meal from the _meals array
            this._render(); // To render / update the values
        }
    }

    removeWorkout(id) {
        const index = this._workouts.findIndex((workout) => workout.id === id);  // Loops through the workouts array - each element is an workout object which has an id key-value pair - findIndex() gives -1 if it doesn't match
        if (index !== -1) { // For the case that a workout with the correct ID was found
            const workout = this._workouts[index];    // To separat the resprective workout from the _workouts array
            this._totalCalories += workout.calories;   // To subtract the calories of the workout which will be deleted
            this._workouts.splice(index, 1);   // To delete the respective workout from the _workouts array
            this._render(); // To render / update the values
        }
    }

    // Private Methods _
    _displayCaloriesTotal() {
        const totalCaloriesEl = document.getElementById('calories-total');
        totalCaloriesEl.innerHTML = this._totalCalories;
    }

    _displayCaloriesLimit() {
        const calorieLimitEl = document.getElementById('calories-limit');
        calorieLimitEl.innerHTML = this._calorieLimit;
    }

    _displayCaloriesConsumed() {
        const caloriesConsumedEl = document.getElementById('calories-consumed');
        const consumedCalories = this._meals.reduce(    // To loop through the array meals which has all Meal objects
            (total, meal) => total + meal.calories, // To add all calories together
            0   // To initialize that total starts at 0
        );  
        caloriesConsumedEl.innerHTML = consumedCalories;
    }

    _displayCaloriesBurned() {
        const caloriesBurnedEl = document.getElementById('calories-burned');
        const burnedCalories = this._workouts.reduce(    // To loop through the array meals which has all Meal objects
            (total, workout) => total + workout.calories, // To add all calories together
            0   // To initialize that total starts at 0
        );  
        caloriesBurnedEl.innerHTML = burnedCalories;
    }

    _displayCaloriesRemaining() {
        const caloriesRemainingEl = document.getElementById('calories-remaining');
        const caloriesProgressEl = document.getElementById('calorie-progress');
        const remainingCalories = this._calorieLimit - this._totalCalories;
        caloriesRemainingEl.innerHTML = remainingCalories;

        if (remainingCalories <= 0) {    // To toggle the class between bg-light (if the remainig calories are > 0) and else bg-danger
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light');
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger');
            caloriesProgressEl.classList.remove('bg-success');
            caloriesProgressEl.classList.add('bg-danger');
        } else {
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light');
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger');
            caloriesProgressEl.classList.add('bg-success');
            caloriesProgressEl.classList.remove('bg-danger');
        }
    }

    _displayCaloriesProgress() {
        const caloriesProgressEl = document.getElementById('calorie-progress');
        const percentageOfCalorieProgress = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(percentageOfCalorieProgress, 100);   // .min takes the lower value of percentageOfCalorieProgress and 100 - for the case percentageOfCalorieProgress is geater than 100
        caloriesProgressEl.style.width = `${width}%`;
    }

    _displayNewMeal(meal) { // To display new added meal items
        const mealsEl = document.getElementById('meal-items');  // The div where all meal items goes in
        const mealEl = document.createElement('div');   // To create an element for the new added meal
        mealEl.classList.add('card', 'my-2');  // To add the needed classes to the new created div
        mealEl.setAttribute('data-id', meal.id);    // To create an attribute with the name data-id with the value meal.id to be able to chose the respective div later
        mealEl.innerHTML = `              
        <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${meal.name}</h4>
          <div
            class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
          >
          ${meal.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        </div>`;    // This is the hardcoded code block from the HTML file

        mealsEl.appendChild(mealEl);    // To finally append the new createt meal item to the meal-items div
    }

    _displayNewWorkout(workout) { // To display new added meal items
        const workoutsEl = document.getElementById('workout-items');  // The div where all workout items goes in
        const workoutEl = document.createElement('div');   // To create an element for the new added workout
        workoutEl.classList.add('card', 'my-2');  // To add the needed classes to the new created div
        workoutEl.setAttribute('data-id', workout.id);    // To create an attribute with the name data-id with the value workout.id to be able to chose the respective div later
        workoutEl.innerHTML = `              
        <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
          <h4 class="mx-1">${workout.name}</h4>
          <div
            class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
          >
          ${workout.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        </div>`;    // This is the hardcoded code block from the HTML file

        workoutsEl.appendChild(workoutEl);    // To finally append the new createt meal item to the meal-items div
    }

    _render() { // To render / update the values (total calories...) - DOM
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
}

class Meal {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2)   // To generate a 14-digit hexadecimal number as an ID
        this.name = name;
        this.calories = calories;
    }
}

class Workout {
    constructor(name, calories) {
        this.id = Math.random().toString(16).slice(2)   // To generate a 14-digit hexadecimal number as an ID
        this.name = name;
        this.calories = calories;
    }
}

// For testing purposes only

// const tracker = new CalorieTracker; // To create a new tracker

// const breakfast = new Meal('Breakfast', 400);   // To create a new meal
// tracker.addMeal(breakfast); // To add the meal to the tracker
// const lunch = new Meal('Lunch', 850);   // To create a new meal
// tracker.addMeal(lunch); // To add the meal to the tracker
// console.log(tracker._meals);    // Object { id: "faf12c67bf24c8", name: "Breakfast", calories: 400 }

// const run = new Workout('Morning run', 320);   // To create a new workout
// tracker.addMWorkout(run); // To add the workout to the tracker
// console.log(tracker._workouts); // Object { id: "e67188e5bccf6", name: "Morning run", calories: 300 }
// console.log(tracker._totalCalories);    // 100


// Calorie App Part (project_diagram.png - yellow)
class App {
    constructor() {
        this._tracker = new CalorieTracker(); // To create a new tracker

        // Event listener
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));  // To add a new meal to the tracker via form // without .bind(this) .this would just refer to <form id="meal-form"> but it should refer to App {_tracker: CalorieTracker} - 'meal' after this is just a parameter we typed in to be able to distinguish between meal and workout
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));    // To add a new workout to the tracker via form // without .bind(this) .this would just refer to <form id="meal-form"> but it should refer to App {_tracker: CalorieTracker} - 'workout' after this is just a parameter we typed in to be able to distinguish between meal and workout
        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));   // To delete a meal item // without .bind(this) .this would just refer to the clicked icon but it should refer to App {_tracker: CalorieTracker} - 'meal' after this is just a parameter we typed in to be able to distinguish between meal and workout
        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'));   // To delete a meal item // without .bind(this) .this would just refer to the clicked icon but it should refer to App {_tracker: CalorieTracker} - 'meal' after this is just a parameter we typed in to be able to distinguish between meal and workout
    }

    _newItem(type, e) {   // To call the private method newItem (type is the argument = meal or workout)
        e.preventDefault(); // To prevent the submission
        // console.log(this);
        const nameField = document.getElementById(`${type}-name`);    // To get the meal / workout name field from the input form + Add Meal / Workout
        const caloriesField = document.getElementById(`${type}-calories`);    // To get the meal / workout calories field from the input form + Add Meal / Workout

        // Validate inputs
        if (nameField.value === '' || caloriesField.value === '') {
            alert('Please fill in all fields');
            return;
        }

        // To add the typed in meal to the tracker
        if (type === 'meal') {
            const meal = new Meal(nameField.value, +caloriesField.value);   // To create a new meal - the plus sign changes the string-type caloriesValue to the number-type
            this._tracker.addMeal(meal); // To add the meal to the tracker
        } else {
            const workout = new Workout(nameField.value, +caloriesField.value);   // To create a new workout - the plus sign changes the string-type caloriesValue to the number-type
            this._tracker.addWorkout(workout); // To add the workout to the tracker
        }

        // To clear the form after submitting a new meal
        nameField.value = '';
        caloriesField.value = '';

        // To collapse the form after submission
        const collapseMeaOrWorkoutlDiv = document.getElementById(`collapse-${type}`);   // The div where the meal / workout form is in
        const bsCollapse = new bootstrap.Collapse(collapseMeaOrWorkoutlDiv, {    // We have access to it because of the boostrap JS file
            toggle: true
        })
    }; 

    // To remove items by clicking the delete (x) icon of the respective item
    _removeItem(type, e) {
        if (e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')) { // if the clicked target is either the delete button or its icon 
            if (confirm('Are you sure?')) { // if we confirm to delete in the popped up window
                // console.log('delete');  // Just to check whether it works up to this point
                const id = e.target.closest('.card').getAttribute('data-id')   // .closest() is a method to get the closest whatever - in this case the closest '.card' to get the respective ID
                // console.log(id);    // Just to check whether it works - dea768b5cee138

                // To remove the item from the tracker - that all stats are updated
                type === 'meal' ? this._tracker.removeMeal(id) : this._tracker.removeWorkout(id);

                // To remove the item from the DOM
                e.target.closest('.card').remove()
            }
        }
    }
}

const app = new App();