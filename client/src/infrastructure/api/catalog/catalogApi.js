import { http } from '../httpClient'

export const catalogApi = {
  getCategories: () => http('/catalog/categories'), // [{ id, name }]
  getQuestions: (categoryId, difficulty) => {
    const params = new URLSearchParams({ category: categoryId, difficulty })
    return http(`/catalog/questions?${params}`) // [{ id, question, options }]
  },
}
