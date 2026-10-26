import { http } from './httpClient'

export const quizApi = {
  getQuestions: () => http('/questions'),
  checkAnswer: (id, choice) =>
    http('/answer', { method: 'POST', body: JSON.stringify({ id, choice }) }),
}
