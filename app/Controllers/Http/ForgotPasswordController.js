'use strict'

const User = use('App/Models/User')
const Mail = use('Mail')
const moment = require('moment')
const crypto = require('crypto')

class ForgotPasswordController {
  async store({ request }) {
    try {
      const { email } = request.only(['email'])

      const user = await User.findByOrFail('email', email)

      const token = await crypto.randomBytes(10).toString('hex')

      user.token_created_at = new Date()

      user.token = token

      await user.save()

      await Mail.send('emails.recover', { user, token }, ( message ) => {
        message
          .from('alex@mentallyfriendly.com')
          .to(email)
      })

      return user
    } catch(err) {
      console.log(err);
    }
  }

  async update({ request, response, params }) {
    try {
      const tokenProvided = params.token
      const emailRequesting = params.email

      const { newPassword } = request.only(['newPassword'])

      const user = await User.findByOrFail('email', emailRequesting)

      const sameToken = tokenProvided === user.token

      if (!sameToken) {
        return response.status(401).send({ message: { error: 'Old token provided or token already in use' } })
      }

      const tokenExpired = moment().subtract(2, 'days').isAfter(user.token_created_at)

      if (tokenExpired) {
        return response.status(401).send({ message: { error: 'Token expired' } })
      }

      user.password = newPassword

      console.log(user.password);

      user.token = null
      user.token_created_at = null

      await user.save()
    } catch(err) {
      console.log(err);
    }
  }
}

module.exports = ForgotPasswordController
