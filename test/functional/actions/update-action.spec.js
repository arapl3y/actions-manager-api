'use strict'
const Factory = use('Factory')
const { test, trait } = use('Test/Suite')('Update Action')

trait('Test/ApiClient')
trait('Auth/Client')

test('a user can update an action they own', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const action = await Factory.model('App/Models/Action').make()

  await user.actions().save(action)

  const data = {
    title: "This is my new title"
  }

  const response = await client
    .put(`/actions/${action.id}`)
    .loginVia(user, 'jwt')
    .send(data)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    id: action.id,
    title: data.title
  })
})

test('cannot update an action they do not own', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create()
  const otherUser = await Factory.model('App/Models/User').create()
  const action = await Factory.model('App/Models/Action').make()

  await otherUser.actions().save(action)

  const data = {
    title: 'This is my new title'
  }

  const response = await client
    .put(`/actions/${action.id}`)
    .loginVia(user, 'jwt')
    .send(data)
    .end()

  response.assertStatus(401)

  const _action = await use('App/Models/Action').find(action.id)

  assert.notEqual(_action.title, data.title)
})

// Add test for updating action that doesn't exist
