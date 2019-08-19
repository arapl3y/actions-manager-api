'use strict'

const Factory = use('Factory')
const { test, trait } = use('Test/Suite')('Get Actions')

trait('Auth/Client')
trait('Test/ApiClient')

test('cannot get actions associated with other users', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({ id: 20 })
  await Factory.model('App/Models/Action').createMany(3, { id: 3 })

  const response = await client.get('/actions/list').loginVia(user, 'jwt').end()

  response.assertStatus(200)
  response.assertJSONSubset([])
})

test('can get own actions if authenticated', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create()
  const otherUser = await Factory.model('App/Models/User').create()

  const ownActions = await Factory.model('App/Models/Action').makeMany(2)
  const otherActions = await Factory.model('App/Models/Action').makeMany(2)

  await user.actions().saveMany(ownActions)
  await otherUser.actions().saveMany(otherActions)

  const response = await client.get('/actions/list').loginVia(user, 'jwt').end()

  response.assertStatus(200)

  assert.equal(response.body.length, 2)

  response.assertJSONSubset([
    { title: ownActions[0].title },
    { title: ownActions[1].title }
  ])
})
