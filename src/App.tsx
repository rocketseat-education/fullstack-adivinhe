import styles from "./app.module.css"
import { useEffect, useState } from "react"

import { Challenge, WORDS } from "./utils/words"

import { Tip } from "./components/Tip"
import { Input } from "./components/Input"
import { Header } from "./components/Header"
import { Letter } from "./components/Letter"
import { Button } from "./components/Button"
import { Loading } from "./components/Loading"
import { GuessProps, LettersUsed } from "./components/LettersUsed"

export default function App() {
  const [score, setScore] = useState(0)
  const [letter, setLetter] = useState("")
  const [guesses, setGuesses] = useState<GuessProps[]>([])
  const [challenge, setChallenge] = useState<Challenge | null>(null)

  const ATTEMPT_LIMIT = 10

  function handleConfirm() {
    if (!challenge) {
      return
    }

    if (!letter.trim()) {
      return alert("Digite uma letra!")
    }

    const value = letter.toUpperCase()
    const exists = guesses.find((guess) => guess.value === value)

    if (exists) {
      return alert("Você já utilizou a letra " + value)
    }

    const hits = challenge.word
      .toUpperCase()
      .split("")
      .filter((char) => char === value).length

    const correct = hits > 0
    const currentScore = score + hits

    setGuesses((prevState) => [...prevState, { value, correct }])
    setScore(currentScore)

    setLetter("")
  }

  function startGame() {
    const index = Math.floor(Math.random() * WORDS.length)
    const randomWord = WORDS[index]

    setChallenge(randomWord)

    setScore(0)
    setLetter("")
    setGuesses([])
  }

  function handleRestartGame() {
    const isConfirmed = window.confirm("Você tem certeza que deseja reiniciar?")

    if (isConfirmed) {
      startGame()
    }
  }

  function endGame(message: string) {
    alert(message)
    startGame()
  }

  useEffect(() => {
    startGame()
  }, [])

  useEffect(() => {
    if (!challenge) {
      return
    }
    setTimeout(() => {
      if (score === challenge.word.length) {
        return endGame("Parabéns, você descobriu a palavra!")
      } else if (guesses.length === ATTEMPT_LIMIT) {
        return endGame("Que pena, você usou todas as tentativas!")
      }
    }, 200)
  }, [score, guesses.length])

  if (!challenge) {
    return <Loading />
  }

  return (
    <div className={styles.container}>
      <main>
        <Header
          max={ATTEMPT_LIMIT}
          current={guesses.length}
          onRestart={handleRestartGame}
        />

        <Tip tip={challenge.tip} />

        <div className={styles.word}>
          {challenge.word.split("").map((letter, index) => {
            const guess = guesses.find(
              (guess) => guess.value.toUpperCase() === letter.toUpperCase()
            )

            return (
              <Letter
                key={index}
                value={guess?.value}
                color={guess?.correct ? "correct" : "default"}
              />
            )
          })}
        </div>

        <h4>Palpite</h4>

        <div className={styles.guess}>
          <Input
            autoFocus
            maxLength={1}
            value={letter}
            placeholder="?"
            onChange={(e) => setLetter(e.target.value)}
          />

          <Button title="Confirmar" onClick={handleConfirm} />
        </div>

        <LettersUsed data={guesses} />
      </main>
    </div>
  )
}
