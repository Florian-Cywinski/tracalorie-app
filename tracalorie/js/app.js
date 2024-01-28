// Tracalorie App

// Calorie Tracker Part (project_diagram.png - green)
class CalorieTracker {
    constructor() { // The constructor runs immediately when the class is instanciated
        this._calorieLimit = Storage.getCalorieLimit(2000);  // To call the static method getCalorieLimit with a default value of 2000 (directly on the class Storage) // _ because we want to juse the property just in this class
        this._totalCalories = Storage.getTotalCalories(0);   // To call the static method getTotalCalories
        this._meals = Storage.getMeals();   // To get the meals array from local storage
        this._workouts = Storage.getWorkouts();   // To get the workout array from local storage
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
        this._totalCalories += meal.calories;   // Updates the totalCalories on memory
        Storage.updateTotalCalories(this._totalCalories);   // Updates the totalCalories on local storage
        Storage.saveMeal(meal); // To save the new meal to local storage
        this._displayNewMeal(meal);
        this._render(); // To render / update the values (total calories) - DOM
    }

    addWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;    // Updates the totalCalories on memory
        Storage.updateTotalCalories(this._totalCalories);   // Updates the totalCalories on local storage
        Storage.saveWorkout(workout); // To save the new meal to local storage
        this._displayNewWorkout(workout);
        this._render(); // To render / update the values (total calories) - DOM
    }

    removeMeal(id) {
        const index = this._meals.findIndex((meal) => meal.id === id);  // Loops through the meals array - each element is an meal object which has an id key-value pair - findIndex() gives -1 if it doesn't match
        if (index !== -1) { // For the case that a meal with the correct ID was found
            const meal = this._meals[index];    // To separat the resprective meal from the _meals array
            this._totalCalories -= meal.calories;   // To subtract the calories of the meal which will be deleted
            Storage.updateTotalCalories(this._totalCalories);   // Updates the totalCalories on local storage
            this._meals.splice(index, 1);   // To delete the respective meal from the _meals array
            this._render(); // To render / update the values
        }
    }

    removeWorkout(id) {
        const index = this._workouts.findIndex((workout) => workout.id === id);  // Loops through the workouts array - each element is an workout object which has an id key-value pair - findIndex() gives -1 if it doesn't match
        if (index !== -1) { // For the case that a workout with the correct ID was found
            const workout = this._workouts[index];    // To separat the resprective workout from the _workouts array
            this._totalCalories += workout.calories;   // To subtract the calories of the workout which will be deleted
            Storage.updateTotalCalories(this._totalCalories);   // Updates the totalCalories on local storage
            this._workouts.splice(index, 1);   // To delete the respective workout from the _workouts array
            this._render(); // To render / update the values
        }
    }

    reset() {
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];
        this._render();
    }

    setLimit(calorieLimit) {
        this._calorieLimit = calorieLimit;  // To set the limit
        Storage.setCalorieLimit(calorieLimit);  // To set the limit to local storage
        this._displayCaloriesLimit();   // To display the limit
        this._render(); // To render / update the DOM
    }

    loadItems() {
        this._meals.forEach(meal => this._displayNewMeal(meal));
        this._workouts.forEach(workout => this._displayNewWorkout(workout));
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


// -----------------------------------------------------------------------------------------------------------
// Meal and Workout Part (project_diagram.png - lilac)
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


// -----------------------------------------------------------------------------------------------------------
// Storage Part (project_diagram.png - rose) - Initializer
class Storage { 
    static getCalorieLimit(defaultLimit = 2300) {   // All methods are static because we don't need multiple instances (local storage) 
        let calorieLimit;
        if (localStorage.getItem('calorieLimit') === null) {    // To check whether there is already an item called calorieLimit in local storage
            calorieLimit = defaultLimit;
        } else {
            calorieLimit = +localStorage.getItem('calorieLimit');
        }
        return calorieLimit;
    }

    static setCalorieLimit(calorieLimit) {
        localStorage.setItem('calorieLimit', calorieLimit);
    }

    static getTotalCalories(defaultCalories = 0) { 
        let totalCalories;
        if (localStorage.getItem('totalCalories') === null) {    // To check whether there is already an item called totalCalories in local storage
            totalCalories = defaultCalories;
        } else {
            totalCalories = +localStorage.getItem('totalCalories');
        }
        return totalCalories;
    }

    static updateTotalCalories(calories) {
        localStorage.setItem('totalCalories', calories);
    }

    static getMeals() { 
        let meals;
        if (localStorage.getItem('meals') === null) {    // To check whether there is already an item called meals in local storage
            meals = []; // This will be stored as stringified array
        } else {
            meals = JSON.parse(localStorage.getItem('meals'));  // JSON.parse because meals is stored as stringified array
        }
        return meals;
    }

    static saveMeal(meal) {
        const meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meal', JSON.stringify(meals));    // JSON.stringify to stringify the meals array
    }

    static getWorkouts() { 
        let workouts;
        if (localStorage.getItem('workouts') === null) {    // To check whether there is already an item called workouts in local storage
            workouts = []; // This will be stored as stringified array
        } else {
            workouts = JSON.parse(localStorage.getItem('workouts'));  // JSON.parse because workouts is stored as stringified array
        }
        return workouts;
    }

    static saveWorkout(workout) {
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workout', JSON.stringify(workouts));    // JSON.stringify to stringify the workouts array
    }
}


// -----------------------------------------------------------------------------------------------------------
// App Part (project_diagram.png - yellow) - Initializer
class App {
    constructor() {
        this._tracker = new CalorieTracker(); // To create a new tracker
        this._loadEventListeners();
        this._tracker.loadItems();  // To call the loadItems method from the CalorieTracker part which loads all items from local storage
    }

    _loadEventListeners() {
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));  // To add a new meal to the tracker via form // without .bind(this) .this would just refer to <form id="meal-form"> but it should refer to App {_tracker: CalorieTracker} (to the _newItem(type, e) method) - 'meal' after this is just a parameter we typed in to be able to distinguish between meal and workout
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));    // To add a new workout to the tracker via form // without .bind(this) .this would just refer to <form id="meal-form"> but it should refer to App {_tracker: CalorieTracker} - 'workout' after this is just a parameter we typed in to be able to distinguish between meal and workout
        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'));   // To delete a meal item // without .bind(this) .this would just refer to the clicked icon but it should refer to App {_tracker: CalorieTracker} - 'meal' after this is just a parameter we typed in to be able to distinguish between meal and workout
        document.getElementById('filter-meals').addEventListener('keyup', this._filterItems.bind(this, 'meal'));   // To filter meals // without .bind(this) .this would just refer to the filter field but it should refer to App {_tracker: CalorieTracker} - 'meal' after this is just a parameter we typed in to be able to distinguish between meal and workout
        document.getElementById('filter-workouts').addEventListener('keyup', this._filterItems.bind(this, 'workout'));   // To delete a meal item // without .bind(this) .this would just refer to the filter field but it should refer to App {_tracker: CalorieTracker} - 'meal' after this is just a parameter we typed in to be able to distinguish between meal and workout
        document.getElementById('reset').addEventListener('click', this._reset.bind(this));   // To reset the day // without .bind(this) .this would just refer to the reset button but it should refer to App {_tracker: CalorieTracker}
        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));   // To be able to set a limit // without .bind(this) .this would just refer to the set limit button but it should refer to App {_tracker: CalorieTracker}
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

    _filterItems(type, e) {
        const text = e.target.value.toLowerCase();
        // console.log(text);   // Just for testing
        document.querySelectorAll(`#${type}-items .card`).forEach(item => {  // ${type}-items .card to get either the div with the id of meal-items or workout-items and then we select all cards (with the class of card) in #meal-items / #workout-items 
            const name = item.firstElementChild.firstElementChild.textContent;  // item is a card of meal-items / workout-items - then we go down in the hierarchy until we reach <h4 class="mx-1">${workout.name}</h4> where we get the name

            if (name.toLowerCase().indexOf(text) !== -1) {  // if there is an item whose name matches the text entered
                item.style.display = 'block';   // To show the matched item / card in the DOM
            } else {
                item.style.display = 'none';    // To not show the unmatched item / card in the DOM
            }
        });
    }

    _reset() {
        this._tracker.reset()   // To call the reset function of the tracker which resets all tracked values

        // To delete everything from the DOM
        document.getElementById('meal-items').innerHTML = '';   // To delete all items
        document.getElementById('workout-items').innerHTML = '';     // To delete all items
        document.getElementById('filter-meals').value = ''; // To clear the filter input field
        document.getElementById('filter-workouts').value = '';  // To clear the filter input field
    }

    _setLimit(e) {
        e.preventDefault();

        const limit = document.getElementById('limit');

        if (limit.value === '') {
            alert('Please add a limit')
            return
        }

        this._tracker.setLimit(+limit.value);   // To call the method with the argument of +limit.value (+ to chnage the string into a value)
        limit.value = '';   // To clear the limit form

        // To close the bootstrap modal (the window which pops up)
        const modalEl = document.getElementById('limit-modal'); // To get the element
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();   // To collapse the modal after we typed in a value

    }
}

const app = new App();  // Initializer