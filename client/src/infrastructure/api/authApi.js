import { http } from './httpClient'

const post = (path, body) => http(path, { method: 'POST', body: JSON.stringify(body) })

export const authApi = {
  register: (data) => post('/auth/register', data), // { username, email, password }
  login: (data) => post('/auth/login', data), // { email, password }
  me: () => http('/auth/me'),
}
