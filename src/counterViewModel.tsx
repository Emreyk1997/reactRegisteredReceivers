import {observable, action} from 'mobx'
import {CounterModel} from './counterModel'


const number = new CounterModel();

export class CounterViewModel{
    // this is an observable array of the todo of our todo editor
    // it is marked as observable because also adding and removing elements
    // from the todo list should be tracked by the view and/or computed values.
    // when the viewmodel is constructed, attempt to load the todos.
    // this is an action, using the "@action" decorator tells MobX we are going to change
    // some observable inside this function. With this function we are going to add a new
    // todo into the tods list.
    // @action
    // add(){
    //     // simple vanilla js, adding a new Todo instance to the todos.
    //     const newTodo = new CounterModel()
    //     this.todos.push(newTodo)
    //     return newTodo
    // }

    @observable showNumber = 0;

    // remove and deletes the given todo
    @action
    increase(){
        console.log('Increase', number.number);
        number.number = number.number + 1;
        this.showNumber = number.number;
        return number.number;
    }

    @action
    decrease(){
        number.number = number.number - 1;
        this.showNumber = number.number;
        return number.number;
    }

    @action
    getNumber(){
        return number.number;
    }

    // load saved todos, if possible

    // save todos, if possible
}