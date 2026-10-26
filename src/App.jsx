import { useState } from 'react'
import { questions } from './questions'
import './App.css'

export default function App() {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [finished, setFinished] = useState(false)

  const question = questions[index]

  const choose = (i) => {
    if (selected !== null) return
    setSelected(i)
    if (i === question.answer) setScore((s) => s + 1)
  }

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1)
      setSelected(null)
    } else {
      setFinished(true)
    }
  }

  const restart = () => {
    setIndex(0)
    setScore(0)
    setSelected(null)
    setFinished(false)
  }

  if (finished) {
    return (
      <main className="quiz">
        <h1>Résultat</h1>
        <p className="score">{score} / {questions.length}</p>
        <button onClick={restart}>Rejouer</button>
      </main>
    )
  }

  return (
    <main className="quiz">
      <p className="progress">Question {index + 1} / {questions.length}</p>
      <h2>{question.question}</h2>
      <ul>
        {question.options.map((opt, i) => {
          let cls = ''
          if (selected !== null) {
            if (i === question.answer) cls = 'correct'
            else if (i === selected) cls = 'wrong'
          }
          return (
            <li key={opt}>
              <button className={cls} onClick={() => choose(i)}>{opt}</button>
            </li>
          )
        })}
      </ul>
      {selected !== null && (
        <button className="next" onClick={next}>
          {index + 1 < questions.length ? 'Suivant' : 'Voir le résultat'}
        </button>
      )}
    </main>
  )
}
