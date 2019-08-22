'use strict'

const Factory = use('Factory')
const { test, trait } = use('Test/Suite')('Update User')

trait('Auth/Client')
trait('Test/ApiClient')

test('a user can update their information if authenticated', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({ id: 1020 })

  const data = {
    username: "new_username",
    password: "password123",
    newPassword: "asdfasdf"
  }

  const response = await client
    .put(`users/${user.id}`)
    .loginVia(user, 'jwt')
    .send(data)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    username: data.username
  })
})

test('a user cannot update their information unless logged in', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({ id: 10000 })

  const data = {
    username: user.username
  }

  const response = await client
    .put(`users/${user.id}`)
    .send(data)
    .end()

  response.assertStatus(401)
})


