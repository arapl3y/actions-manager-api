'use strict'

const Factory = use('Factory')
const { test, trait } = use('Test/Suite')('Get Actions')

trait('Auth/Client')
trait('Test/ApiClient')

test('can get an action by id', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const action = await Factory.model('App/Models/Action').create()

  user.actions().save(action)

  const response = await client
    .get(`actions/${action.id}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset([
    {
      title: action.title,
      id: action.id
    }
  ])
})

test('status 404 if id does not exist', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const actions = await Factory.model('App/Models/Action').create()

  const response = await client
    .get(`/actions/999`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(404)
})
