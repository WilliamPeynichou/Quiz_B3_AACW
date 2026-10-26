import express from 'express'
import cors from 'cors'
import { questions } from './data/questions.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/questions', (req, res) => {
  res.json(questions.map(({ answer, ...q }, id) => ({ id, ...q })))
})

app.post('/api/answer', (req, res) => {
  const { id, choice } = req.body
  const q = questions[id]
  if (!q) return res.status(404).json({ error: 'Question introuvable' })
  res.json({ correct: choice === q.answer, answer: q.answer })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API sur http://localhost:${PORT}`))
