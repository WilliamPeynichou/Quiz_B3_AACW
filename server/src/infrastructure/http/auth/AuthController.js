export class AuthController {
  constructor({ registerUser }) {
    this.registerUser = registerUser
  }

  register = async (req, res) => {
    const { username, email, password } = req.body ?? {}
    const result = await this.registerUser.execute({ username, email, password })
    res.status(201).json(result)
  }
}
