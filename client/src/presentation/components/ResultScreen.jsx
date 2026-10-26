export function ResultScreen({ score, total, onRestart }) {
  return (
    <main className="quiz">
      <h1>Résultat</h1>
      <p className="score">{score} / {total}</p>
      <button onClick={onRestart}>Rejouer</button>
    </main>
  )
}
