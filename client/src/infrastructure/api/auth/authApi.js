import { http } from '../httpClient'

export const authApi = {
  register: (fields) => http('/auth/register', {
    method: 'POST',
    body: JSON.stringify(fields),
  }),
  login: (fields) => http('/auth/login', {
    method: 'POST',
    body: JSON.stringify(fields),
  }),
  me: () => http('/auth/me'),
}
