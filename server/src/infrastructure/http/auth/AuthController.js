export class AuthController {
  constructor({ registerUser, loginUser, getCurrentUser }) {
    this.registerUser = registerUser
    this.loginUser = loginUser
    this.getCurrentUser = getCurrentUser
  }

  register = async (req, res) => {
    const { username, email, password } = req.body ?? {}
    const result = await this.registerUser.execute({ username, email, password })
    res.status(201).json(result)
  }

  login = async (req, res) => {
    const { email, password } = req.body ?? {}
    res.json(await this.loginUser.execute({ email, password }))
  }

  me = async (req, res) => {
    const [scheme, token] = (req.headers.authorization ?? '').split(' ')
    res.json(await this.getCurrentUser.execute(scheme === 'Bearer' ? token : null))
  }
}
