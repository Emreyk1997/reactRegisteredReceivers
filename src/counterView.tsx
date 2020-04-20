
import React from 'react'
import {observer} from 'mobx-react'
import {CounterViewModel} from '../src/counterViewModel';

// This is a React component.
// The property "model" of the passed props object is an instance of our TodoViewModel class.
// do you remember all those @observable and @computed?
// In order to let your React component automatically update whenever any of
// those observable property of an object in the component props update,
// you should pass your component to the "observer" function/decorator

type ViewProps = {model: CounterViewModel};
type ViewState = {};

@observer
export class CounterView extends React.Component <ViewProps, ViewState>{
    render(){
        console.log('PROPS', this.props);
        const model = this.props.model;

        // just some HTML markup based of the ViewModel data.
        return <div>
            <h1>React Counter with MVVM!</h1>
            <p>
                <button type='button' onClick={() => model.increase()}>Add</button>
                <button type='button' onClick={() => model.decrease()}>Minus</button>
            </p>
            <h1>Count: {model.showNumber}</h1>
            <h1>Count1: {model.getNumber()}</h1>


        </div>
    }
}