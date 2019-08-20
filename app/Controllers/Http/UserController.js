'use strict'

const User = use('App/Models/User')

class UserController {
  async store({ request, response }) {
    try {
      const data = request.only(['username', 'email', 'password'])

      const userExists = await User.findBy('email', data.email)

      if (userExists) {
        return response.status(400).send({ message: { error: 'User already registered' } })
      }

      return await User.create(data)
    } catch (err) {
      return response.status(err.status).send(err)
    }
  }

  async index({ request, response }) {
    try {
      const { limit = 20, page = 1 } = request.all()

      const users = await User
        .query()
        .orderBy('id', 'desc')
        .paginate(page, limit)

      return response.ok(users)
    } catch (err) {
      return response.status(err.status).send(err)
    }
  }

  async update({ request, response, params }) {
    const id = params.id

    const { username, password, newPassword } = request.only(['username', 'password', 'newPassword'])

    const user = await User.findByOrFail('id', id)

    const passwordCheck = await Hash.verify(password, user.password)

    if (!passwordCheck) {
      return response.status(400).send({ message: { error: 'Incorrect password provided' }})
    }

    user.username = username
    user.password = newPassword

    await user.save()

    return user
  }
}

module.exports = UserController
