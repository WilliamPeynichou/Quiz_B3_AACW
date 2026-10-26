import { useQuiz } from '../../application/hooks/useQuiz'
import { QuestionCard } from '../components/QuestionCard'
import { ResultScreen } from '../components/ResultScreen'

export function QuizPage() {
  const quiz = useQuiz()

  if (quiz.loading) return <p className="quiz">Chargement…</p>
  if (quiz.error) return <p className="quiz">Erreur : {quiz.error}</p>
  if (quiz.finished) {
    return <ResultScreen score={quiz.score} total={quiz.questions.length} onRestart={quiz.restart} />
  }

  return (
    <main className="quiz">
      <p className="progress">Question {quiz.index + 1} / {quiz.questions.length}</p>
      <QuestionCard
        question={quiz.question}
        selected={quiz.selected}
        correctAnswer={quiz.correctAnswer}
        onChoose={quiz.choose}
      />
      {quiz.correctAnswer !== null && (
        <button className="next" onClick={quiz.next}>
          {quiz.isLast ? 'Voir le résultat' : 'Suivant'}
        </button>
      )}
    </main>
  )
}
