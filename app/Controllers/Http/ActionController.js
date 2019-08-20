'use strict'
const Action = use('App/Models/Action')
class ActionController {
  async store({ request, response, auth }) {
    try {
      const user = await auth.getUser()

      const { title, complete, date } = request.all()

      const action = await user.actions()
        .create({
          user_id: user.id,
          title,
          complete,
          date
        })

      return response.created(action)
    } catch (err) {
      return response
        .status(err.status)
        .send({ message: { error: 'Something went wrong while creating new action' } })
    }
  }

  async index({ response, auth }) {
    try {
      const user = await auth.getUser()

      const actions = await user.actions().fetch()

      return response.ok(actions)
    } catch(err) {
      return response.status(err.status)
    }
  }

  async show({ params, request, response, auth }) {
    try {
      const actionId = params.id
      const user = await auth.getUser()

      const action = await user.actions().where({ id: actionId }).fetch()

      if (action.rows.length === 0) {
        return response.status(404).send({ message: { error: 'No action found' } })
      }

      return response.ok(action)
    } catch(err) {
      if (err.name === 'ModelNotFoundException') {
        return response.status(err.status).send({ message: { error: 'No action found' } })
      }

      return response.status(err.status)
    }
  }

  async update({ response, request, params, auth }) {
    try {
      const user = await auth.getUser()
      const { title, complete } = request.only(['title', 'complete'])

      const action = await Action.findOrFail(params.id)

      if (action.user_id !== user.id) {
        return response.status(401).send('Login please')
      }

      action.merge({ title, complete })

      await action.save()

      return response.ok(action)
    } catch(err) {
      if (err.name === 'ModelNotFoundException') {
        return response.status(err.status).send({ message: { error: 'No action found' } })
      }
      return response.status(err.status)
    }

  }

  async destroy({ params, response, auth }) {
    try {
      const user = await auth.getUser()
      const { id } = params

      const action = await Action.findOrFail(params.id)

      await action.delete()

      return response.noContent()
    } catch(err) {
      if (err.name === 'ModelNotFoundException') {
        return response.status(err.status).send({ message: { error: 'No action found' } })
      }
      return response.status(err.status)
    }
  }
}

module.exports = ActionController
