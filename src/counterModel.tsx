
import {observable, computed} from 'mobx'

// ignore the two lines below, they just creates unique IDs for the todo
var _nextId = 0
function nextId(){ _nextId++; return _nextId }

// this is our domain model class
export class CounterModel{
    @observable number : number = 0 //Action ile değiştirilebilir.
}
