import React from 'react';
import './game.css';
import {mineralList} from '../Game/mineralList';
import PinchZoomPan from "react-responsive-pinch-zoom-pan";

export class Game extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            shownClues: [],
            shownProps: [],
            shownPropTypes: [],
            image1: {
                checked: false,
                mineral: ' '
                },
            image2: {
                checked: false,
                mineral: ' '
                },
            image3: {
                checked: false,
                mineral: ' '
                },
            image4: {
                checked: false,
                mineral: ' '
                },
            buttonHard: true,
            buttonStreak: true,
            buttonAcid: true,
            testUse: 0,
            displayedPictures: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClick2 = this.handleClick2.bind(this);
    }
    handleSubmit (event) {
        event.preventDefault();
        if (this.props.gameType === 'uncover') {
            if (this.props.answer !== this.props.chosenMineral) {
                if (this.props.guessNumber === 0) {
                    let newCompareWith = (
                        <div>
                            <p>{this.capitaliseFirst(this.props.answer)}</p>
                            <img 
                                src={`${process.env.PUBLIC_URL}/Images/${this.props.answer}1.jpg`} 
                                width='350'/>
                        </div>
                    );
                    this.props.updateWrongAnswers(this.props.chosenPicture);
                    this.props.updateSelect(this.props.answer, newCompareWith, true);
                };
                if (this.props.guessNumber === this.props.guesses) {
                    this.props.changePage('aftergame');
                    this.props.resetGuessNumber();
                    this.setState({
                        buttonHard: true,
                        buttonStreak: true,
                        buttonAcid: true,
                        testUse: 0
                    });
                } else {
                    this.props.changePopup();
                };
            } else {
                this.setState({
                    shownClues: [],
                    buttonHard: true,
                    buttonStreak: true,
                    buttonAcid: true,
                    testUse: 0
                });
                this.props.changePage('aftergame');
                this.props.resetGuessNumber();
            };
        } else {
            let i = false;
            let No = 0;
            let chosenImage;
            let imageName = 'unknown';
            while (i === false && No < 4) {
                No++
                imageName = `image${No}`
                if (this.state[imageName].checked === true) {
                    i = true
                    chosenImage = imageName;
                };
            };
            if (this.state[chosenImage].mineral !== this.props.chosenMineral) {
                if (this.props.guessNumber === 0) {
                    let newCompareWith = (
                        <div>
                            <p>{this.capitaliseFirst(this.state[chosenImage].mineral)}</p>
                            <img 
                                src={`${process.env.PUBLIC_URL}/Images/${this.props.answer}1.jpg`} 
                                width='350'/>
                        </div>
                    );
                    this.props.updateWrongAnswers(this.props.chosenPicture);
                    this.props.updateSelect(this.state[chosenImage].mineral, newCompareWith, true);
                };
                if (this.props.guessNumber === this.props.guesses) {
                    this.props.changePage('aftergame');
                    this.props.resetGuessNumber();
                    this.props.changeAnswer(this.state[chosenImage].mineral);
                    let newImageSet = {};
                    newImageSet.checked = false;
                    newImageSet.mineral = ' ';
                    let newImage1Set = {};
                    newImage1Set.checked = true;
                    newImage1Set.mineral = ' ';
                    this.setState({
                        displayedPictures: [],
                        image1: newImage1Set,
                        image2: newImageSet,
                        image3: newImageSet,
                        image4: newImageSet
                    });
                } else {
                    this.props.changePopup();
                };
            } else {
                this.props.changeAnswer(this.state[chosenImage].mineral);
                let newImageSet = {};
                newImageSet.checked = false;
                newImageSet.mineral = ' ';
                let newImage1Set = {};
                newImage1Set.checked = true;
                newImage1Set.mineral = ' ';
                this.setState({
                    shownClues: [],
                    displayedPictures: [],
                    image1: newImage1Set,
                    image2: newImageSet,
                    image3: newImageSet,
                    image4: newImageSet
                });
                this.props.changePage('aftergame');
                this.props.resetGuessNumber();
            };
        };
        
    }
    handleChange (event) {
        let submitted = event.target.value;
        this.props.changeAnswer(submitted);
    }
    handleChange2 (event) {
        let name = event.target.name;
        let imageChecked = event.target.checked;
        let imageArray = ['image1', 'image2', 'image3', 'image4'];
        imageArray.splice(imageArray.indexOf(name), 1);
        if (imageChecked === true) {
            let [imageX, imageY, imageZ] = imageArray;
            let variableSet = ['X', 'Y', 'Z', 'imageTrue'];
            let newVariableSet = [];
            let index;
            variableSet.forEach(variable => {
                newVariableSet.push({});
                index = variableSet.indexOf(variable);
                if (index === 3) {
                    newVariableSet[index].checked = true
                    newVariableSet[index].mineral = event.target.value;
                } else {
                    newVariableSet[index].checked = false
                    newVariableSet[index].mineral = this.state[imageArray[index]].mineral
                };
            })
            this.props.changeAnswer(newVariableSet[3].mineral)
            this.setState({
                [name]: newVariableSet[3],
                [imageX]: newVariableSet[0],
                [imageY]: newVariableSet[1],
                [imageZ]: newVariableSet[2]
             });
        } else {
            let imageNumber = parseInt(name[-1]);
            this.setState({ [`image${imageNumber + 1}`]: true });
        };
    }
    capitaliseFirst (name) {
        let mineral = name.charAt(0).toUpperCase() + name.slice(1);
        return mineral
    }
    handleClick () {
        let newClue;
         if (this.props.clues === 'zero') {
            newClue = null;
         } else if (this.props.clues.length >= 1) {
            do {
                newClue = this.props.clues[Math.floor(Math.random() * this.props.clues.length)];
            } while ( this.state.shownClues.includes(newClue) === true || this.props.chosenClue === newClue);
        } else {
            newClue = 'There are no more clues available.';
        };
        let newList = Array.from(this.state.shownClues);
        if (newClue) {
            newList.push(newClue);
            this.setState({
                shownClues: newList
            });
            this.props.removeClues(newClue);
        }
    }
    handleClick2 (event) {
        let property = event.target.name;
        let testUseVar = this.state.testUse + 1;
        if (testUseVar === this.props.testLimit) {
            this.setState({
                buttonHard: property === 'hardness' ? true : false,
                buttonStreak: property === 'streak' ? true : false,
                buttonAcid: property === 'reactionWithAcid' ? true : false,
                testUse: testUseVar
            });
        };
        let prop;
        if (this.state.shownPropTypes.includes(property) === false && testUseVar <= this.props.testLimit) {
            try {
               if (mineralList[this.props.chosenMineral].properties !== undefined) {
                    if (property in mineralList[this.props.chosenMineral].properties) {
                        prop = mineralList[this.props.chosenMineral].properties[property];
                    } else {
                        prop = 'not yet defined property'
                    };
                } else {
                    prop = 'not yet defined property'
                };
            } catch (err) {
                prop = 'not yet defined property'
            }
            let newShownProps = Array.from(this.state.shownProps);
            newShownProps.push(prop);
            let newShownPropTypes = Array.from(this.state.shownPropTypes);
            newShownPropTypes.push(property);
            this.setState((state, props) => ({
                shownProps: newShownProps,
                shownPropTypes: newShownPropTypes,
                testUse: testUseVar
            }));
        } else if (testUseVar === this.props.testLimit + 1) {
            let newShownProps = Array.from(this.state.shownProps);
            newShownProps.push(`Note: you can only choose ${this.props.testLimit} property to test.`);
            this.setState((state, props) => ({
                shownProps: newShownProps,
                testUse: testUseVar
            }));
        }
    }
    render () {
        if (this.props.page === 'game') {
            if (this.props.gameType === 'uncover') {
                if (this.props.resetShownClues === true) {
                    this.setState({
                        shownClues: [],
                        shownProps: [],
                        shownPropTypes: [],
                        buttonHard: true,
                        buttonStreak: true,
                        buttonAcid: true,
                        testUse: 0
                    }, this.props.changeResetShownClues());
                };
                let optionsList = this.props.updatedList.sort().map(mineral => {
                    return <option value={`${mineral}`} className='select'>{mineral}</option>
                });
                let clues_list = Array.from(this.state.shownClues)
                clues_list.unshift(this.props.chosenClue)
                let displayedClues = clues_list.map(clue => {
                    return <p>{clue}</p>
                });
                let props_list = Array.from(this.state.shownProps)
                let displayedProps = props_list.map(prop => {
                    return <p>{prop}</p>
                });
                return (
                    <div className='game'>
                        {this.props.mode === 'visual'? (
                            <div>
                                <h1>Uncover the mystery mineral</h1>
                                <main className='imageContainer'>
                                    <PinchZoomPan maxScale='1.5'>
                                        <img 
                                            src={`${process.env.PUBLIC_URL}/Images/${this.props.chosenPicture}.jpg`}
                                            id='image'/>
                                    </PinchZoomPan>
                                </main>
                                <div>
                                    <button name='hardness' className={this.state.buttonHard === true ? 'guess' : 'guessFaded'} onClick={this.handleClick2}>Hardness</button>
                                    <button name='streak' className={this.state.buttonStreak === true ? 'guess' : 'guessFaded'} onClick={this.handleClick2}>Streak</button>
                                    <button name='reactionWithAcid' className={this.state.buttonAcid === true ? 'guess' : 'guessFaded'} onClick={this.handleClick2}>Acid test</button>
                                </div>
                                {displayedProps}
                                <form onSubmit={this.handleSubmit}>
                                    <select className='guess' id='guess' required onChange={this.handleChange}>
                                        <option value=' '>Choose the mineral:</option>
                                        {optionsList}
                                    </select>
                                    <input type='submit' value='Check' id='check' className='check' checked/>
                                </form>
                            </div>
                            ) : (
                            <div>
                                <h1>Uncover the mystery mineral</h1>
                                {displayedClues}
                                <button className='guess' onClick={this.handleClick}>Add a clue</button>
                                <form onSubmit={this.handleSubmit}>
                                    <select className='guess' required onChange={this.handleChange}>
                                        <option value=' '>Choose the mineral:</option>
                                        {optionsList}
                                    </select>
                                    <input type='submit' value='Check' className='check'/>
                                </form>
                            </div>
                            )
                            }
                    </div>
                );
            } else if (this.props.gameType === 'array') {
                if (this.props.resetShownClues === true) {
                    let newImageSet = {};
                    newImageSet.checked = false;
                    newImageSet.mineral = ' ';
                    let newImage1Set = {};
                    newImage1Set.checked = true;
                    newImage1Set.mineral = ' ';
                    this.setState({
                        shownClues: [],
                        image1: newImage1Set,
                        image2: newImageSet,
                        image3: newImageSet,
                        image4: newImageSet,
                        displayedPictures: []
                    }, this.props.changeResetShownClues());
                };
                if (this.state.displayedPictures.length === 0) {
                    let displayedImages = Array.from(this.props.randomArray);
                    displayedImages = displayedImages.map(item => item + '1');
                    displayedImages.splice(Math.floor(Math.random() * displayedImages.length), 0, this.props.chosenPicture);
                    this.setState({ displayedPictures: displayedImages });
                };
                let currentImages = Array.from(this.state.displayedPictures);
                let i = 0;
                let if_checker = false
                let image_array = currentImages.map(mineral => {
                    i++
                    let mineralName = mineral.split("").filter(character => isNaN(character) === true).toString();
                    mineralName = mineralName.replace(/,/g, '');
                    if (this.state.image1.mineral === ' ' && i === 1) {
                        let newImage1Set = {};
                        newImage1Set.checked = true;
                        newImage1Set.mineral = mineralName;
                        if_checker = true
                        this.setState({
                            image1: newImage1Set
                        });
                    };
                    return (<label className='imageArray'>
                                <input type="radio" name={`image${i}`} value={`${mineralName}`} checked={this.state[`image${i}`].checked} onChange={this.handleChange2}/>
                                <img 
                                    src={`${process.env.PUBLIC_URL}/Images/${mineral}.jpg`}
                                    height='150'/>
                            </label>)
                });
                return (
                    <div>
                        <h1>Which picture is {this.props.chosenMineral}?</h1>
                        {/* Adapted from https://stackoverflow.com/questions/17541614/use-images-instead-of-radio-buttons/17541916 */}
                        <form onSubmit={this.handleSubmit}>
                            {image_array}
                            <input type='submit' value='Check' className='check' id='arrayCheck'/>
                        </form>
                    </div>
                )
            };  
        } else {
        return <div></div>
        }
    }
}