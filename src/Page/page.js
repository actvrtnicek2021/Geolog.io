import React from 'react';
import {Start} from '../Start/start';
import {Form} from '../Form/form';
import {Game} from '../Game/game';
import {Aftergame} from '../Aftergame/aftergame';
import {Popup} from '../Game/pop-up/pop-up';
import {mineralList} from '../Game/mineralList';

let randomMineral = '';
export let updatedMinList = [];

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
export class Page extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            page: 'start',
            answer: '',
            chosenMineral: '',
            wrong: {},
            updatedList: [],
            currentList: [],
            showPopup: false,
            guessNumber: 0,
            roundsAfterWrong: 2,
            guesses: 2,
            firstWrong: ' ',
            select: ' ',
            compareWith: null,
            activated: false,
            mode: null,
            clues: [],
            chosenClues: [],
            resetShownClues: false,
            game: 'uncover',
            randomArray: [],
            testLimit: 1,
            picturesLog: {},
            chosenPicture: ''
        };
        this.changePage = this.changePage.bind(this);
        this.changeAnswer = this.changeAnswer.bind(this);
        this.changeMineral = this.changeMineral.bind(this);
        this.updateWrongAnswers = this.updateWrongAnswers.bind(this);
        this.changePreferences = this.changePreferences.bind(this);
        this.changePopup = this.changePopup.bind(this);
        this.resetGuessNumber = this.resetGuessNumber.bind(this);
        this.annulateMinList = this.annulateMinList.bind(this);
        this.updateSelect = this.updateSelect.bind(this);
        this.removeClues = this.removeClues.bind(this);
        this.changeResetShownClues = this.changeResetShownClues.bind(this);
    }
    changePage (newPage) {
        if (newPage === 'Aftergame') {
            this.setState({
                page: newPage,
                resetShownClues: true
            });
        } else {
            this.setState({
                page: newPage
            });
        };
    }
    changeAnswer (newAnswer) {
        this.setState({answer: newAnswer});
    }
    updateWrongAnswers (wrongPicture) {
        let wrongAnswer = {};
        wrongAnswer[wrongPicture] = this.state.roundsAfterWrong;
        let updatedList = Object.assign(this.state.wrong, wrongAnswer)
        this.setState({wrong: updatedList})
    }
    annulateMinList () {
        updatedMinList = [];
        this.setState({wrong: {}})
    }
    changeMineral () {
        if (updatedMinList.length === 0) {
            updatedMinList = Array.from(this.state.updatedList);
        };
        let newPictureLog = this.state.picturesLog;
        let wrongList = this.state.wrong;
        let foundWrong = false;
        let randomPicture;
        if (Object.values(wrongList).includes(0)) {
            randomPicture = getKeyByValue(wrongList, 0);
            let randomMineral = getKeyByValue(wrongList, 0);
            delete wrongList[randomMineral];
            randomMineral = randomMineral.split("").filter(character => isNaN(character) === true).toString();
            randomMineral = randomMineral.replace(/,/g, '')
            foundWrong = true;
        } else {
            let randomNumber = Math.floor(Math.random() * updatedMinList.length);
            randomMineral = updatedMinList[randomNumber];
        };
        const findAvailable = (mineral) => {
            let maximumAchieved = false;
            let counter = 0;
            const tryRequire = (path) => {
                try {
                return require(`../../public/Images/${path}`);
                } catch (err) {
                return null;
                }
            };
            while (maximumAchieved === false) {
                counter++
                let imagePath = `${mineral}${counter}.jpg`;
                let checking = tryRequire(imagePath)
                if (checking === null) {
                    maximumAchieved = true;
                };
            };
            counter--
            let availableList = [];
            let i = 0;
            while (i < counter) {
                i++
                availableList.push(i)
            };
            return availableList;
        };
        if (randomMineral in this.state.picturesLog === false) {
            newPictureLog[randomMineral] = findAvailable(randomMineral);
            while (newPictureLog[randomMineral].length === 0) {
                updatedMinList.splice(updatedMinList.indexOf(randomMineral), 1);
                randomMineral = updatedMinList[Math.floor(Math.random() * updatedMinList.length)];
                if (randomMineral in this.state.picturesLog === false) {
                    newPictureLog[randomMineral] = findAvailable(randomMineral); 
                };
                if (newPictureLog[randomMineral].length !== 0) {
                    break;
                };
            };
        };
        let availableMinList = newPictureLog[randomMineral];
        if (availableMinList.length !== 0 && foundWrong === false) {
            randomPicture = availableMinList[Math.floor(Math.random() * availableMinList.length)];
            availableMinList.splice(availableMinList.indexOf(randomPicture), 1);
            newPictureLog[randomMineral] = availableMinList;
            if (newPictureLog[randomMineral].length === 0) {
                updatedMinList.splice(updatedMinList.indexOf(randomMineral), 1);
            };
        };
        if (updatedMinList.length === 0 && Object.keys(wrongList).length > 0) {
            let wrongMineral = Object.keys(wrongList)[0].split("").filter(character => isNaN(character) === true).toString();
            wrongMineral = wrongMineral.replace(/,/g, '')
            updatedMinList.push(wrongMineral);
            let wrongPicture = Object.keys(wrongList)[0].split("").filter(character => isNaN(character) === false).toString();
            wrongPicture = wrongPicture.replace(/,/g, '');
            newPictureLog[wrongMineral] = [wrongPicture];
            delete wrongList[Object.keys(wrongList)[0]];
        };
        for (let mineral in wrongList) {
            wrongList[mineral] = wrongList[mineral] - 1
        };
        let mineralID;
        if (randomMineral.includes(' ')) {
            mineralID = randomMineral.replace(' ', '_')
        } else {
            mineralID = `${randomMineral}`
        };
        let newArray = []
        if (this.state.game === 'array') {
            let preferredMinerals = Array.from(this.state.updatedList);
            if (preferredMinerals.includes(randomMineral)) {
                preferredMinerals.splice(preferredMinerals.indexOf(randomMineral), 1)
            };
            let i;
            for (i = 0; i < 3; i++) {
                let newArrayElement = preferredMinerals[Math.floor(Math.random() * preferredMinerals.length)];
                preferredMinerals.splice(preferredMinerals.indexOf(newArrayElement), 1);
                newArray.push(newArrayElement);
                if (preferredMinerals.length === 0) {
                    i = 3
                };
            };
        };
        let cluesList;
        try {
            cluesList = Array.from(mineralList[mineralID].clues);
        } catch (err) {
            cluesList = ['Not available at the moment. Please, continue.']
        };
        let randomClue = cluesList[Math.floor(Math.random() * cluesList.length)]
        cluesList.splice(cluesList.indexOf(randomClue), 1);
        let newChosenPicture = `${randomMineral}${randomPicture}`
        this.setState({
            chosenMineral: randomMineral,
            wrong: wrongList,
            clues: cluesList,
            chosenClues: randomClue,
            randomArray: newArray,
            picturesLog: newPictureLog,
            chosenPicture: newChosenPicture
        });
    }
    changePreferences (newList, inputRounds, inputGuesses, modeType) {
        this.setState({
            updatedList: newList,
            roundsAfterWrong: inputRounds,
            guesses: inputGuesses,
            mode: modeType
        }, this.changeMineral);
    }
    changePopup () { 
        let newGuessNumber = this.state.showPopup === false ? this.state.guessNumber + 1 : this.state.guessNumber;
        this.setState({
            showPopup: !(this.state.showPopup),
            guessNumber: newGuessNumber
        })
    }
    resetGuessNumber () {
        let newGame = this.state.game === 'uncover' ? 'array' : 'uncover';
        this.setState({
            guessNumber: 0,
            resetShownClues: true,
            game: newGame
        });
    }
    updateSelect (mineral, comparingMineral, trueOrFalse) {
        this.setState({ 
            select: mineral,
            compareWith: comparingMineral,
            activated: trueOrFalse
        });
    }
    removeClues (newClue) {
        if (newClue === 'There are no more clues available.') {
            this.setState({
                clues: 'zero'
            });
        } else {
            this.setState({
                clues: this.state.clues.filter(clue => clue !== newClue)
            });
        }
    }
    changeResetShownClues () {
        this.setState({
            resetShownClues: false
        });
    }
    render () {
        return (
            <div>
                <Start 
                    page={this.state.page}
                    changePage={this.changePage}/>
                <Form 
                    page={this.state.page}
                    changePage={this.changePage}
                    changePreferences={this.changePreferences}
                    changeMineral={this.changeMineral}/>
                <Game 
                    page={this.state.page}
                    chosenMineral={this.state.chosenMineral}
                    changePage={this.changePage}
                    changeAnswer={this.changeAnswer}
                    updateWrongAnswers={this.updateWrongAnswers}
                    answer={this.state.answer}
                    changeMineral={this.changeMineral}
                    changePopup={this.changePopup}
                    guessNumber={this.state.guessNumber}
                    resetGuessNumber={this.resetGuessNumber}
                    updatedList={this.state.updatedList}
                    roundsAfterWrong ={this.state.roundsAfterWrong}
                    guesses={this.state.guesses}
                    updateSelect={this.updateSelect}
                    mode={this.state.mode}
                    clues={this.state.clues}
                    chosenClue={this.state.chosenClues}
                    removeClues={this.removeClues}
                    resetShownClues={this.state.resetShownClues}
                    changeResetShownClues={this.changeResetShownClues}
                    gameType={this.state.game}
                    randomArray={this.state.randomArray}
                    testLimit={this.state.testLimit}
                    chosenPicture={this.state.chosenPicture}/>
                <Aftergame
                    chosenMineral={this.state.chosenMineral}
                    minListLength ={updatedMinList.length}
                    page={this.state.page}
                    changePage={this.changePage}
                    changeMineral={this.changeMineral}
                    answer={this.state.answer}
                    annulateMinList = {this.annulateMinList}
                    wrong={this.state.wrong}
                    firstWrong={this.state.firstWrong}
                    select={this.state.select}
                    updateSelect={this.updateSelect}
                    compareWith={this.state.compareWith}
                    activated={this.state.activated}
                    gameType={this.state.game}/>
                { this.state.showPopup === true ? 
                    <Popup 
                        changePopup={this.changePopup}
                        changePage={this.changePage}
                        resetGuessNumber={this.resetGuessNumber}/>
                 : null }
            </div>
        );
    }
}
