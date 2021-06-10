import React from 'react';
import './pop-up.css';

export class Popup extends React.Component {
    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleClick2 = this.handleClick2.bind(this);
    }
    handleClick () {
        this.props.changePopup();
    }
    handleClick2 () {
        this.props.changePopup();
        this.props.changePage('aftergame');
        this.props.resetGuessNumber();
    }
    render () {
        return (
            <div className='popup'>
                <p>Your guess was not correct. Keep trying!</p>
                <button onClick={this.handleClick}>Try Again</button>
                <button onClick={this.handleClick2} id='giveup'>Reveal</button>
            </div>
        );
    }
}