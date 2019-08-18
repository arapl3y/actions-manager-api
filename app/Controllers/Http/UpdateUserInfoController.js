'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class UpdateUserInfoController {
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

module.exports = UpdateUserInfoController
