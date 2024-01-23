
// Calorie Tracker Part (green)
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
    }

    // Public Methods / API's (public API's to use outside of the class)
    addMeal(meal) {
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        this._render(); // To render / update the values (total calories) - DOM
    }

    addMWorkout(workout) {
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        this._render(); // To render / update the values (total calories) - DOM
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
        const remainingCalories = this._calorieLimit - this._totalCalories;
        caloriesRemainingEl.innerHTML = remainingCalories;
    }

    _render() { // To render / update the values (total calories) - DOM
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
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

const tracker = new CalorieTracker; // To create a new tracker

const breakfast = new Meal('Breakfast', 400);   // To create a new meal
tracker.addMeal(breakfast); // To add the meal to the tracker
const lunch = new Meal('Lunch', 350);   // To create a new meal
tracker.addMeal(lunch); // To add the meal to the tracker
console.log(tracker._meals);    // Object { id: "faf12c67bf24c8", name: "Breakfast", calories: 400 }

const run = new Workout('Morning run', 320);   // To create a new workout
tracker.addMWorkout(run); // To add the workout to the tracker
console.log(tracker._workouts); // Object { id: "e67188e5bccf6", name: "Morning run", calories: 300 }
console.log(tracker._totalCalories);    // 100