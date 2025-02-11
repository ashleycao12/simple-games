import React, { useEffect, useState } from "react";
import { getRandomWord } from "../apiClient";

function Hangman() {
  const clickedStyle = { backgroundColor: "#baabab" }
  const missingCharStyle = {color: "red"}
  const alphabetChars = [...'abcdefghijklmnopqrstuvwxyz']
  const alphabetObjs = alphabetChars.map(char => {
    return {char}
  })
  
  const [alphabet, setAlphabet] = useState([])
  const [givenLetters, setLetters] = useState([])
  const [progress, setProgress] = useState([])
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [answer, setAnswer] = useState([])
  
  const gameSetup = async () => {
    // make array for the alphabet buttons
    setAlphabet(alphabetObjs)
    
    //get random word from api
    const randomWordArray = await getRandomWord()
    const randomWord = randomWordArray[0]
    const letterArr = randomWord.split('')
    setLetters(letterArr)

    //make blank word
    setProgress(Array(letterArr.length).fill('_'))
  }
  
  
  const won = () => {
    if (progress.length === 0) {
      return false
    }
    return progress.every(char => char !== '_')
  }
  
  const lost = () => {
    return (wrongGuesses === 10 && !won())
  }

  const finished = () => {
    return won() || lost()
  }

  const getStrokes = () => {
    const result = []
    for (let i = 0; i < wrongGuesses; i++) {
      result.push(i+1)
    }
    return result
  }

  const handleClick = (guess, index) => {
    //gray out clicked button
    const newAlphabet = [...alphabet]
    newAlphabet[index].style = clickedStyle
    newAlphabet[index].disabled = true
    setAlphabet(newAlphabet)

    //check guess
    let rightGuess = false
    const newProgress = [...progress]
    givenLetters.forEach((givenLetter, index) => {
      if (givenLetter === guess) {
        newProgress[index] = guess
        rightGuess = true
      }
    })
    if (!rightGuess) {
      setWrongGuesses(wrongGuesses + 1)
    }

    setProgress(newProgress)
  }


  //disable all alphabet buttons on finish game
  useEffect(() => {
    if (finished()) {
      const newAlphabet = [...alphabet]
      newAlphabet.forEach(charObj => { charObj.disabled = true })
      setAlphabet(newAlphabet)
    }
  }, [progress, wrongGuesses])

  useEffect(() => {
    if (lost()) {
      const answerVar = []
      progress.forEach((char, index) => {
        answerVar.push({char: givenLetters[index]})
        if (char === '_') {
          answerVar[index].style = missingCharStyle
        }
      })
      setAnswer(answerVar)
    }
  }, [wrongGuesses])

  useEffect(() => {
    gameSetup()
  }, [])

  const restart = () => {
    setProgress([])
    setWrongGuesses(0)
    gameSetup()
  }


  return (
    <div className=" mt-24 text-center flex justify-center flex-col h-screen">
      <h1 className="text-5xl mb-10"> Hangman </h1>

      <div className=" grow flex flex-col lg:flex-row max-w-6xl mx-auto">
      {/* hangman drawing */}
        <div className=" w-96 relative basis-1/3 lg:basis-1/2 mx-auto">
          {getStrokes().map(strokeNum =>
            <img src={`/hangman/${ strokeNum }.png`} alt={"stroke " + strokeNum} className=" absolute max-w-full max-h-full" key={ strokeNum} />
          )}

          {/* render face when lost */}
          {lost() && <img src="/hangman/11.png" alt="dying face" className=" absolute max-w-full max-h-full" />}
        </div>
        
        <div className=" grow md:grow-0">  
          <div className=" flex justify-center mt-16 mb-20">
        {/* alphabet buttons */}
            <div className="inline-block max-w-5xl">
              {alphabet.map((item, index) =>
                <button className=" bg-rose-200 hover:bg-red-300 w-14 m-1" onClick={() => {handleClick(item.char, index)}} style= {item.style} disabled= {item.disabled} key={item.char} > {item.char} </button>
                )}
            </div>
          </div>
          
          {!lost() ? 
            <h2>
              {progress.map((char, index) =>
                <span className="mr-1 text-5xl" key={index}>{char}</span>)}
            </h2>
            : 
            <h2>
              {answer.map((item, index) =>
                <span className=" mr-1 text-5xl" style={item.style} key={index}>{item.char}</span>)}
            </h2>   
          }
          
          {won() && <h2 className=" text-3xl mt-10"> Congrats. You haven't hung a man </h2>}
          {lost() && <h2 className=" text-3xl mt-10"> You have hung a man </h2>}
          {finished() && <button onClick={restart} className= " mt-6 bg-red-50 hover:bg-red-100 duration-100 border border-black py-1 px-2"> Play again </button>}
        </div>
      </div>
    </div>
  )
}

export default Hangman