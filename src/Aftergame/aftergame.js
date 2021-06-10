import React from 'react';
import './aftergame.css';
import {mineralTypes, hardMinerals} from '../Form/preferencesLists';

export const wrongList = {};

export class Aftergame extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            column: null,
            row: null
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleClick2 = this.handleClick2.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    handleClick () {
        this.props.changePage('game');
        this.props.changeMineral();
        this.resetSelect();
    }
    handleClick2 () {
        this.props.annulateMinList();
        this.props.changePage('form');
        this.resetSelect();
    }
    resetSelect () {
        this.props.updateSelect(' ', null, false);
    }
    handleChange (event) {
        let selectValue = event.target.value;
        if (selectValue === ' ') {
            this.props.updateSelect(' ', null, false);
        } else {
            let mineralID;
            if (selectValue.includes(' ')) {
                mineralID = selectValue.replace(' ', '_')
            } else {
                mineralID = `${selectValue}`
            };
            let newCompareWith = (
                <div>
                    <p>{this.capitaliseFirst(selectValue)}</p>
                    <img 
                        src={`${process.env.PUBLIC_URL}/Images/${mineralID}1.jpg`} 
                        width='350'/>
                </div>
            );
            this.props.updateSelect(selectValue, newCompareWith, true);
        }
    }
    capitaliseFirst (name) {
        let mineral = name.charAt(0).toUpperCase() + name.slice(1);
        return mineral
    }
    render () {
        if (this.props.page === 'aftergame') {
            let answerValidation;
            if (this.props.answer === this.props.chosenMineral) {
                answerValidation = 'correct';
            } else {
                answerValidation = 'wrong';
            };
            let allMinerals = [];
            for (let type in mineralTypes) {
                allMinerals = allMinerals.concat(mineralTypes[type]);
            };
            for (let mineral in hardMinerals) {
                allMinerals.splice(allMinerals.indexOf(mineral), 1)
                allMinerals = allMinerals.concat(hardMinerals[mineral])
                continue
            };
            let options = allMinerals.sort().map(mineral => {
                return <option value={`${mineral}`}>{mineral}</option>
            });
            let mineralID;
            if (this.props.chosenMineral.includes(' ')) {
                mineralID = this.props.chosenMineral.replace(' ', '_')
            } else {
                mineralID = `${this.props.chosenMineral}`
            };
            return (
                <div className='aftergame'>
                    {this.props.minListLength === 0 ? 
                        <p>You identified all the available minerals in the quizz.</p>
                        : null }
                    <p>{answerValidation === 'correct' ? 'Congratulations, you were right!' : 'Unfortunately, your guess was incorrect.'} {this.props.gameType !== 'uncover' ? `The mineral was ${this.props.chosenMineral}.`: null}</p>
                    {this.props.gameType !== 'array' ?
                    <div>
                        <p>{`${this.props.chosenMineral.charAt(0).toUpperCase() + this.props.chosenMineral.slice(1)} was`}</p>
                        <img 
                            src={`${process.env.PUBLIC_URL}/Images/${this.props.chosenMineral}1.jpg`}
                            height='150'/>
                    </div> : null}
                    {this.props.minListLength === 0 ? 
                        <button onClick={this.handleClick} id='startAgain'>Start again</button>
                        : <button onClick={this.handleClick} id='continue'>Continue</button> }
                    <button onClick={this.handleClick2}>Change Preferences</button>
                    <label className='select'>
                        Compare with:
                        <select id='guess' className='guess' required onChange={this.handleChange} value={this.props.select}>
                            <option value=' '> </option>
                            {options}
                        </select>
                    </label>
                    <div className={this.props.activated === true ? 'row' : 'inactive'}>
                        <div className={this.props.activated === true ? 'column' : 'inactive'}>
                            <p>{this.capitaliseFirst(this.props.chosenMineral)}</p>
                            <img 
                                src={`${process.env.PUBLIC_URL}/Images/${mineralID}1.jpg`} 
                                width='350'/>
                        </div>
                        <div className={this.props.activated === true ? 'column' : 'inactive'}>
                            {this.props.compareWith}
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div></div>
        }
    }
}