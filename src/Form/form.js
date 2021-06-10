import React from 'react';
import './form.css';
import {abundanceLevels, mineralTypes, hardMinerals} from './preferencesLists';

export class Form extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            basic: true,
            hard: false,
            common: true,
            rare: false,
            all: true,
            volcanic: false,
            metamorphic: false,
            ore: false,
            other: false,
            roundsAfterWrong: 2,
            guesses: 1,
            show: false,
            show2: false,
            customList: <div></div>,
            allMinerals: [],
            customMinerals: [],
            unselectedMinerals: [],
            visual: true,
            text: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClick2 = this.handleClick2.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
    }
    filterChoices (list) {
        return list.filter(choice => this.state[choice] === true);
    }
    handleSubmit (event) {
        this.props.changePage('game');
        let newList = [];
        let modeType = this.filterChoices(['visual', 'text']);
        let difficultyList = this.filterChoices(['basic', 'hard']);
        let abundanceList = this.filterChoices(['common', 'rare']);
        let mineralTypeList = this.filterChoices(['all','volcanic', 'metamorphic','ore', 'other']);
        if (mineralTypeList.includes('all')) {
            for (let type in mineralTypes) {
                newList = this.mergeMineralLists(newList, mineralTypes[type]);
            };
        };
        if (mineralTypeList.includes('volcanic')) {
            newList = this.mergeMineralLists(newList, mineralTypes.volcanic);
        };
        if (mineralTypeList.includes('metamoprhic')) {
            newList = this.mergeMineralLists(newList, mineralTypes.metamorphic);
        };
        if (mineralTypeList.includes('ore')) {
            newList = this.mergeMineralLists(newList, mineralTypes.ore);
        };
        if (mineralTypeList.includes('other')) {
            newList = this.mergeMineralLists(newList, mineralTypes.other);
        }
        let temporaryList = Array.from(newList);
        newList = [];
        if (abundanceList.includes('common')) {
            newList = newList.concat(temporaryList.filter(mineral => {
                return abundanceLevels.common.includes(mineral) === true;
            }));
        }
        if (abundanceList.includes('rare')) {
            newList = newList.concat(temporaryList.filter(mineral => {
                return abundanceLevels.rare.includes(mineral) === true;
            }));
        }
        if (difficultyList.includes('hard')) {
            for (let mineral in hardMinerals) {
                if (newList.includes(mineral)) {
                    newList.splice(newList.indexOf(mineral), 1)
                    newList = newList.concat(hardMinerals[mineral])
                };
                continue
            };
        };
        let custom = Array.from(this.state.customMinerals)
        custom = custom.filter(item => {
            return newList.includes(item) === false;
        })
        newList = newList.concat(custom)
        let unselected = Array.from(this.state.unselectedMinerals);
        unselected.forEach(mineral => {
            if (newList.includes(mineral)) {
                newList.splice(newList.indexOf(mineral), 1);
            };
        })
        let inputRounds = parseInt(this.state.roundsAfterWrong);
        let inputGuesses = parseInt(this.state.guesses);
        this.props.changePreferences(newList, inputRounds, inputGuesses, modeType[0]);
        event.preventDefault();
    }
    handleChange (event) {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        let otherChoices;
        let isGoingEmpty;
        let newState;
        switch (name) {
            case 'visual':
            case 'text':
                newState = name === 'visual' ? {text: !(this.state.text)} : {visual: !(this.state.visual)};
                this.setState(newState);
                break;
            case 'basic':
            case 'hard':
                newState = name === 'basic' ? {hard: !(this.state.hard)} : {basic: !(this.state.basic)};
                this.setState(newState);
                break;
            case 'common':
            case 'rare':
                otherChoices = ['common', 'rare'];
                otherChoices.splice(otherChoices.indexOf(name), 1);
                if (value === false && this.state[otherChoices[0]] === false) {
                    this.setState({[otherChoices[0]]: true});
                };
                break;
            case 'all':
                if (value === true) {
                    this.setState({
                        volAndMeta: false,
                        ore: false,
                        other: false
                    })
                } else {
                    this.setState({
                        volAndMeta: true,
                        ore: true,
                        other: true
                    })
                }
                break;
            case 'volcanic':
            case 'metamorphic':
            case 'ore':
            case 'other':
                otherChoices = ['volcanic', 'metamorphic', 'ore', 'other']
                otherChoices.splice(otherChoices.indexOf(name), 1);
                if (value === true && this.state.all === true) {
                    this.setState({all: false});
                }
                if (value === false) {
                    isGoingEmpty = true;
                    otherChoices.forEach(choice => {
                        if (this.state[choice] === true) {
                            isGoingEmpty = false;
                        };
                    });
                    if (isGoingEmpty === true) {
                        this.setState({all: true})
                    };
                };
                break;
        }
        if (this.state.show2 === true) {
            this.setState({
                [name]: value,
                currentName: name,
                currentValue: value
            }, this.makeCustomList)
        } else {
            this.setState({[name]: value})
        }
    }
    handleChange2 (event) {
        const name = event.target.name;
        const value = event.target.checked;
        if (name === 'openOrClose') {
            this.setState({
                show2: !(this.state.show2)
            })
        } else {
            let newCustomMinerals = Array.from(this.state.customMinerals);
            let newUnselectedMinerals = Array.from(this.state.unselectedMinerals);
            if (value === true) {
                newCustomMinerals.push(name);
                if (newUnselectedMinerals.includes(name)) {
                    newUnselectedMinerals.splice(newUnselectedMinerals.indexOf(name), 1)
                    this.setState({
                        [name]: value,
                        currentName: name,
                        currentValue: value,
                        customMinerals: newCustomMinerals,
                        unselectedMinerals: newUnselectedMinerals
                    }, this.makeCustomList);
                } else {
                    this.setState({
                        [name]: value,
                        currentName: name,
                        currentValue: value,
                        customMinerals: newCustomMinerals
                    }, this.makeCustomList);
                }
            } else if (value === false && newCustomMinerals.includes(name)) {
                newCustomMinerals.splice(newCustomMinerals.indexOf(name), 1);
                newUnselectedMinerals.push(name);
                this.setState({
                    [name]: value,
                    currentName: name,
                    currentValue: value,
                    customMinerals: newCustomMinerals,
                    unselectedMinerals: newUnselectedMinerals
                }, this.makeCustomList);
            } else {
                newUnselectedMinerals.push(name);
                this.setState({
                    [name]: value,
                    unselectedMinerals: newUnselectedMinerals,
                    currentName: name,
                    currentValue: value
                }, this.makeCustomList);
            };
        }
    }
    handleClick (event) {
        event.preventDefault();
        this.setState({
            show: !(this.state.show)
        });
    }
    mergeMineralLists (list1, list2) {
        const mergedList = Array.from(list1);
        list2.forEach(mineral => {
            if (list1.includes(mineral) === false) {
                mergedList.push(mineral);
            };
        });
        return mergedList
    }
    makeCustomList () {
        let newList = [];
        let difficultyList = this.filterChoices(['basic', 'hard']);
        let abundanceList = this.filterChoices(['common', 'rare']);
        let mineralTypeList = this.filterChoices(['all', 'volcanic', 'metamorphic', 'ore', 'other']);
        if (mineralTypeList.includes('all')) {
            for (let type in mineralTypes) {
                newList = this.mergeMineralLists(newList, mineralTypes[type]);
            };
        };
        if (mineralTypeList.includes('volcanic')) {
            newList = this.mergeMineralLists(newList, mineralTypes.volcanic);
        };
        if (mineralTypeList.includes('metamorphic')) {
            newList = this.mergeMineralLists(newList, mineralTypes.metamorphic);
        };
        if (mineralTypeList.includes('ore')) {
            newList = this.mergeMineralLists(newList, mineralTypes.ore);
        };
        if (mineralTypeList.includes('other')) {
            newList = this.mergeMineralLists(newList, mineralTypes.other);
        }
        let temporaryList = Array.from(newList);
        newList = [];
        if (abundanceList.includes('common')) {
            newList = newList.concat(temporaryList.filter(mineral => {
                return abundanceLevels.common.includes(mineral) === true;
            }));
        }
        if (abundanceList.includes('rare')) {
            newList = newList.concat(temporaryList.filter(mineral => {
                return abundanceLevels.rare.includes(mineral) === true;
            }));
        }
        if (difficultyList.includes('hard')) {
            for (let mineral in hardMinerals) {
                if (newList.includes(mineral)) {
                    newList.splice(newList.indexOf(mineral), 1)
                    newList = newList.concat(hardMinerals[mineral])
                };
                continue
            };
        };
        let newCustomMinerals = Array.from(this.state.customMinerals);
        let newUnselectedMinerals = Array.from(this.state.unselectedMinerals);
        const name = this.state.currentName;
        const value = this.state.currentValue;
        switch (name) {
            case 'common':
            case 'rare':
                if (value === true) {
                    newUnselectedMinerals = newUnselectedMinerals.filter(mineral => {
                        return abundanceLevels[name].includes(mineral) === false
                    })
                } else {
                    newCustomMinerals = newCustomMinerals.filter(mineral => {
                        return abundanceLevels[name].includes(mineral) === false
                    })
                }
                break;
            case 'all':
                if (value === true) {
                    newUnselectedMinerals = [];
                } else {
                    newCustomMinerals = [];
                }
                break;
            case 'volcanic':
            case 'metamorphic':
            case 'ore':
            case 'other':
                if (value === true) {
                    newUnselectedMinerals = newUnselectedMinerals.filter(mineral => {
                        return mineralTypes[name].includes(mineral) === false
                    })
                } else {
                    newCustomMinerals = newCustomMinerals.filter(mineral => {
                        return mineralTypes[name].includes(mineral) === false
                    })
                }
                break;
        }
        newList = newList.concat(newCustomMinerals)
        let unselected = Array.from(newUnselectedMinerals);
        unselected.forEach(mineral => {
            if (newList.includes(mineral)) {
                newList.splice(newList.indexOf(mineral), 1);
            };
        })
        let allList = [];
        for (let level in abundanceLevels) {
            allList = allList.concat(abundanceLevels[level]);
        };
        if (difficultyList.includes('hard')) {
            for (let mineral in hardMinerals) {
                if (allList.includes(mineral)) {
                    allList.splice(allList.indexOf(mineral), 1)
                    allList = allList.concat(hardMinerals[mineral])
                };
                continue
            };
        };
        let mineralChecked = {};
        allList.forEach(mineral => {
            if (newList.includes(mineral)) {
                mineralChecked[mineral] = true
            } else {
                mineralChecked[mineral] = false
            }
        });
        let mergedList = Object.assign(mineralChecked, {
            allMinerals: allList,
            customMinerals: newCustomMinerals,
            unselectedMinerals: newUnselectedMinerals
        })
        this.setState(mergedList, this.makeMineralOptions)
    }
    makeMineralOptions () {
        let mineralList = [];
        mineralList = this.state.allMinerals.sort().map(mineral => {
            return  (<div className='customList'><label className='choices'>
                        <input type="checkbox" name={mineral} checked={this.state[mineral]} onChange={this.handleChange2} className='checkboxes'/>
                        {mineral}
                    </label></div>)
        })
        this.setState({
            customList: mineralList
        })
    }
    handleClick2 (event) {
        event.preventDefault();
        this.setState({
            show2: !(this.state.show2)
        }, this.makeCustomList);
    }
    render () {
        if (this.props.page === 'form') {
            let advancedShow = this.state.show === true ? { display: 'block' } : { display: 'none' };
            return (
                <div id='bigDiv'>
                    <form onSubmit={this.handleSubmit}>
                        <div className='checkForm' id='mode'>
                            <label className='category'>
                                Mode:
                                <div className='options'>
                                    <label className='choices'>
                                        <input type="checkbox" name='visual' checked={this.state.visual} onChange={this.handleChange} className='checkboxes'/>
                                        Visual (picture + basic properies)
                                    </label>
                                    <label className='choices'>
                                        <input type="checkbox" name='text' checked={this.state.text} onChange={this.handleChange} className='checkboxes'/>
                                        Text (key properties)
                                    </label>
                                </div>
                            </label>
                        </div>
                        <div className='checkForm'>
                            <label className='category'>
                                Difficulty:
                                <div className='options'>
                                    <label className='choices'>
                                        <input type="checkbox" name='basic' checked={this.state.basic} onChange={this.handleChange} className='checkboxes'/>
                                        Basic
                                    </label>
                                    <label className='choices'>
                                        <input type="checkbox" name='hard' checked={this.state.hard} onChange={this.handleChange} className='checkboxes'/>
                                        Hard
                                    </label>
                                </div>
                            </label>
                        </div>
                        <div className='checkForm'>
                            <label className='category'>
                                Abundance:
                                <div className='options'>
                                    <label className='choices'>
                                        <input type="checkbox" name='common' checked={this.state.common} onChange={this.handleChange} className='checkboxes'/>
                                        Common
                                    </label>
                                    <label className='choices'>
                                        <input type="checkbox" name='rare' checked={this.state.rare} onChange={this.handleChange} className='checkboxes'/>
                                        Rare
                                    </label>
                                </div>
                            </label>
                        </div>
                        <div className='checkForm'>
                            <label className='category'>
                                Mineral types:
                                <div className='options'>
                                    <label className='choices'>
                                        <input type="checkbox" name='all' checked={this.state.all} onChange={this.handleChange} className='checkboxes'/>
                                        All
                                    </label>
                                    <label className='choices'>
                                        <input type="checkbox" name='volcanic' checked={this.state.volcanic} onChange={this.handleChange} className='checkboxes'/>
                                        Volcanic
                                    </label>
                                    <label className='choices'>
                                        <input type="checkbox" name='metamorphic' checked={this.state.metamorphic} onChange={this.handleChange} className='checkboxes'/>
                                        Metamorphic
                                    </label>
                                    <label className='choices'>
                                        <input type="checkbox" name='ore' checked={this.state.ore} onChange={this.handleChange} className='checkboxes'/>
                                        Ore
                                    </label>
                                    <label className='choices'>
                                        <input type="checkbox" name='other' checked={this.state.other} onChange={this.handleChange} className='checkboxes'/>
                                        Other
                                    </label>
                                </div>
                            </label>
                        </div>
                        <div className='checkForm'>
                            <p className='category' id='advanced'>Advanced Options</p>
                            <button className='formButton' id='show' onClick={this.handleClick}>{this.state.show === false ? 'Show' : 'Hide'}</button>
                            <div style={advancedShow} className='advancedInput'>
                                <label className='numberInput'>
                                    Number of rounds after a wrong answer: 
                                    <input 
                                        type='number'
                                        name='roundsAfterWrong'
                                        value={this.state.roundsAfterWrong}
                                        onChange={this.handleChange}
                                        min='0'
                                        step='1'
                                        required/>
                                </label>
                                <label className='numberInput'>
                                    Number of guesses: 
                                    <input 
                                        type='number'
                                        name='guesses'
                                        value={this.state.guesses}
                                        onChange={this.handleChange}
                                        min='0'
                                        step='1'
                                        required/>
                                </label>
                                <p id='customHeadline'>Custom selection:</p>
                                <button onClick={this.handleClick2} name='openOrClose' className='formButton' id='openOrClose'>{this.state.show2 === true ? 'Close' : 'Open'}</button>
                                <div>
                                    {this.state.show2 === true ? this.state.customList : null}
                                </div>
                            </div>
                        </div>
                        <input type='submit' value='Go!' id='go' className='formButton'/>
                    </form>
                </div>
            );
        } else {
            return (<div></div>);
        }
    }
}