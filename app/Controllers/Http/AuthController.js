'use strict'

class AuthController {
  async login({ request, auth }) {
    try {
      const { email, password } = request.all()

      return await auth.attempt(email, password)
    } catch (err) {
      response.status(err.status).send(err)
    }
  }

  async logout({ auth }) {
    try {
      return await auth.logout()
    } catch (err) {
      response.status(err.status).send(err)
    }
  }

  async getUser({ auth }) {
    try {
      return await auth.getUser()
    } catch(err) {
      response.send('You are not logged in')
    }
  }
}

module.exports = AuthController
