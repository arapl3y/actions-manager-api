'use strict'

class ActionController {
  async store({ request, response, auth }) {
    try {
      const user = await auth.getUser()

      const { title, complete, date, time } = request.all()

      const newAction = await user.actions()
        .create({
          user_id: user.id,
          title,
          complete,
          date,
          time
        })

      return response.created(newAction)
    } catch (err) {
      return response
        .status(err.status)
        .send({ message: { error: 'Something went wrong while creating new action' } })
    }
  }

  async index({ response, auth }) {
    try {
      const user = await auth.getUser()

      const actions = await user.actions().where({ user_id: user.id }).fetch()

      return actions
    } catch(err) {
      return response.status(err.status)
    }
  }

  async show({ request, response, auth }) {
    try {
      const { date } = request.only(['date'])
      const user = await auth.getUser()

      const action = await user.actions().where({ user_id: user.id, date }).fetch()

      if (action.rows.length === 0) {
        return response.status(404).send({ message: { error: 'No action found' } })
      }

      return action
    } catch(err) {
      if (err.name === 'ModelNotFoundException') {
        return response.status(err.status).send({ message: { error: 'No action found' } })
      }

      return response.status(err.status)
    }
  }

  async destroy({ params, response, auth }) {
    try {
      const actionID = params.id
      const user = await auth.getUser()

      return await user.actions().where({ id: actionID, user_id: user.id }).delete()
    } catch(err) {
      return response.status(err.status)
    }
  }
}

module.exports = ActionController
