import styles from "./app.module.css"
import { useEffect, useState } from "react"

import tip from "./assets/tip.svg"
import logo from "./assets/logo.png"
import restart from "./assets/restart.svg"

import { Challenge, WORDS } from "./utils/words"

import { Input } from "./components/input"
import { Button } from "./components/button"
import { Letter } from "./components/letter"

type Guess = {
  value: string
  correct: boolean
}

export default function App() {
  const [score, setScore] = useState(0)
  const [letter, setLetter] = useState("")
  const [guesses, setGuesses] = useState<Guess[]>([])
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

  return (
    <div className={styles.container}>
      <main>
        <img src={logo} alt="Logo" className={styles.logo} />

        <header>
          <span className={styles.attempts}>
            <strong>{guesses.length}</strong> de {ATTEMPT_LIMIT} tentativas
          </span>

          <button
            type="button"
            className={styles.restart}
            onClick={handleRestartGame}
          >
            <img src={restart} alt="Ícone de reiniciar" />
          </button>
        </header>

        <div className={styles.tip}>
          <img src={tip} alt="Ícone de dica" className={styles.icon} />

          <div>
            <h3>Dica</h3>
            <p>{challenge?.tip}</p>
          </div>
        </div>

        <div className={styles.word}>
          {challenge?.word.split("").map((letter, index) => {
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

        <footer>
          <h5>Letras utilizadas</h5>

          <div>
            {guesses.map((guess) => (
              <Letter
                key={guess.value}
                value={guess.value}
                size="small"
                color={guess.correct ? "correct" : "wrong"}
              />
            ))}
          </div>
        </footer>
      </main>
    </div>
  )
}
