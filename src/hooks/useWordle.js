import { useState } from "react";

const useWordle = (solution) => {

    const [turn, setTurn] = useState(0);
    const [currentGuess, setCurrentGuess] = useState('');
    const [guesses, setGuesses] = useState([...Array(6)]);
    const [history, setHistory] = useState([]);
    const [isCorrect, setIsCorrect] = useState(false);

    // format a guess into an array of letter objects 
    const formatGuess = () => {
        let solutionArrray = [...solution]
        let formattedGuess = [...currentGuess].map((l) => {
            return { key: l, color: 'grey' }
        })

        // find any green letters
        formattedGuess.forEach((l, i) => {
            if(solutionArrray[i] === l.key) {
                formattedGuess[i].color = 'green'
                solutionArrray[i] = null
            }
        })

        // find any yellow letters
        formattedGuess.forEach((l, i) => {
            if (solutionArrray.includes(l.key) && l.color !== 'green') {
                formattedGuess[i].color = 'yellow'
                solutionArrray[solutionArrray.indexOf(l.key)] = null
            }
        })

        return formattedGuess
    }

    // add a new guess to the guess state, update isCorrect state, add one to turn state
    const addNewGuess = (formattedGuess) => {
        if (currentGuess === solution) {
            setIsCorrect(true);
        }

        setGuesses((prevGuesses) => {
            let newGuesses = [...prevGuesses]
            newGuesses[turn] = formattedGuess
            return newGuesses
        })

        setHistory((prevHistory) => {
            return [...prevHistory, currentGuess]
        })

        setTurn((prevTurn) => {
            return prevTurn + 1
        })

        setCurrentGuess('')
    }

    // handles keyup event & track current guess; if user presses enter, add the new guess
    const handleKeyup = ({ key }) => {

        if (key === 'Enter') {
            if (turn > 5) {
                console.log('you used all your guesses');
                return
            }

            if (history.includes(currentGuess)) {
                console.log('you already guessed this word');
                return
            }

            if (currentGuess.length !== 5) {
                console.log('guess a five letter word');
                return
            }

           const formatted = formatGuess();
           addNewGuess(formatted)
        }

        if (key === 'Backspace') {
            setCurrentGuess((prev) => {
                return prev.slice(0, -1);
            })
            return
        }

        if (/^[A-Za-z]$/.test(key)) {
            if (currentGuess.length < 5) {
                setCurrentGuess((prev) => {
                    return prev + key
                })
            }
        }
    }

    return { turn, currentGuess, guesses, isCorrect, handleKeyup }

}

export default useWordle