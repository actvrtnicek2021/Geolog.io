import React from 'react';
import './start.css';

export class Start extends React.Component {
    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this)
    }
    handleClick () {
        this.props.changePage('form');
    }
    render () {
        if (this.props.page === 'start') {
            return (
                <div className='start'>
                    <h1>Mineral Detective</h1>
                    <button onClick={this.handleClick}>Start</button>
                </div>
            );
        } else {
            return (<div></div>);
        }
    }
}