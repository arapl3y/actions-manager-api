'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class UserController {
  async store({ request, response }) {
    try {
      const data = request.only(['username', 'email', 'password'])

      const userExists = await User.findBy('email', data.email)

      if (userExists) {
        return response.status(400).send({ message: { error: 'User already registered' } })
      }

      // Add transformer to hide password and id

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
    try {
      const { id } = params

      const { username, password, newPassword } = request.only(['username', 'password', 'newPassword'])

      const user = await User.findByOrFail('id', id)

      const passwordCheck = await Hash.verify(password, user.password)

      if (!passwordCheck) {
        return response.status(400).send({ message: { error: 'Incorrect password provided' }})
      }

      user.username = username
      user.password = newPassword

      await user.save()

      return response.ok(user)
    } catch(err) {
      return response.status(err.status)
    }
  }
}

module.exports = UserController
