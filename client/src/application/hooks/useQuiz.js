import { useEffect, useState } from 'react'
import { quizApi } from '../../infrastructure/api/quizApi'

export function useQuiz() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correctAnswer, setCorrectAnswer] = useState(null)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    quizApi
      .getQuestions()
      .then(setQuestions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const question = questions[index]
  const isLast = index + 1 >= questions.length

  const choose = async (choice) => {
    if (selected !== null) return
    setSelected(choice)
    try {
      const data = await quizApi.checkAnswer(question.id, choice)
      setCorrectAnswer(data.answer)
      if (data.correct) setScore((s) => s + 1)
    } catch (e) {
      setError(e.message)
    }
  }

  const next = () => {
    if (isLast) return setFinished(true)
    setIndex((i) => i + 1)
    setSelected(null)
    setCorrectAnswer(null)
  }

  const restart = () => {
    setIndex(0)
    setScore(0)
    setSelected(null)
    setCorrectAnswer(null)
    setFinished(false)
  }

  return {
    questions, question, index, score, selected, correctAnswer,
    finished, loading, error, isLast, choose, next, restart,
  }
}
