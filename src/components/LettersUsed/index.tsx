import styles from "./styles.module.css"

import { Letter } from "../Letter"

export type GuessProps = {
  value: string
  correct: boolean
}

type Props = {
  data: GuessProps[]
}

export function LettersUsed({ data }: Props) {
  return (
    <div className={styles.container}>
      <h5>Letras utilizadas</h5>

      <div>
        {data.map(({ value, correct }) => (
          <Letter
            key={value}
            value={value}
            size="small"
            color={correct ? "correct" : "wrong"}
          />
        ))}
      </div>
    </div>
  )
}
