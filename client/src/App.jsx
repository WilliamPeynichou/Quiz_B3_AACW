import { useEffect, useState } from 'react'
import './App.css'

export default function App() {
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correctAnswer, setCorrectAnswer] = useState(null)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    fetch('/api/questions').then((r) => r.json()).then(setQuestions)
  }, [])

  if (!questions.length) return <p>Chargement…</p>
  const question = questions[index]

  const choose = async (i) => {
    if (selected !== null) return
    setSelected(i)
    const res = await fetch('/api/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: question.id, choice: i }),
    })
    const data = await res.json()
    setCorrectAnswer(data.answer)
    if (data.correct) setScore((s) => s + 1)
  }

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1)
      setSelected(null)
      setCorrectAnswer(null)
    } else {
      setFinished(true)
    }
  }

  const restart = () => {
    setIndex(0)
    setScore(0)
    setSelected(null)
    setCorrectAnswer(null)
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
          if (correctAnswer !== null) {
            if (i === correctAnswer) cls = 'correct'
            else if (i === selected) cls = 'wrong'
          }
          return (
            <li key={opt}>
              <button className={cls} onClick={() => choose(i)}>{opt}</button>
            </li>
          )
        })}
      </ul>
      {correctAnswer !== null && (
        <button className="next" onClick={next}>
          {index + 1 < questions.length ? 'Suivant' : 'Voir le résultat'}
        </button>
      )}
    </main>
  )
}
