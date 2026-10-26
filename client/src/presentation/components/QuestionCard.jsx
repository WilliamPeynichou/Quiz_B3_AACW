export function QuestionCard({ question, selected, correctAnswer, onChoose }) {
  return (
    <>
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
              <button className={cls} onClick={() => onChoose(i)}>{opt}</button>
            </li>
          )
        })}
      </ul>
    </>
  )
}
