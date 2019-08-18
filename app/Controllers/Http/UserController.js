'use strict'

const User = use('App/Models/User')

class UserController {
  async login({ request, auth }) {
    const { email, password } = request.all()

    return await auth.attempt(email, password)
  }

  show({ auth, params }) {
    if (auth.user.id !== Number(params.id)) {
      return 'You cannot see someone else\'s profile'
    }

    return auth.user
  }

  async store({ request, response }) {
    try {
      const data = request.only(['username', 'email', 'password'])

      const userExists = await User.findBy('email', data.email)

      if (userExists) {
        return response.status(400).send({ message: { error: 'User already registered' } })
      }

      const user = await User.create(data)

      return user
    } catch (err) {
      return response.status(err.status).send(err)
    }
  }
}

module.exports = UserController
