import styles from "./styles.module.css"

type Props = {
  value?: string
  size?: "default" | "small"
  color?: "default" | "correct" | "wrong"
}

export function Letter({ value, size = "default", color = "default" }: Props) {
  return (
    <div
      className={`
        ${styles.container}
        ${size === "small" && styles.small}
        ${color === "correct" && styles.correct}
        ${color === "wrong" && styles.wrong}
        `}
    >
      <span>{value}</span>
    </div>
  )
}
