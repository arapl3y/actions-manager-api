'use strict'

const Factory = use('Factory')
const { test, trait } = use('Test/Suite')('Get Users')

trait('Test/ApiClient')

test('can get a list of all users', async ({ client }) => {
  const users = await Factory.model('App/Models/User').createMany(3)

  const response = await client.get('/users').end()

  response.assertStatus(200)
  response.assertJSONSubset({
    data: [
      {
        username: users[0].username,
        email: users[0].email,
      },
      {
        username: users[1].username,
        email: users[1].email,
      },
      {
        username: users[2].username,
        email: users[2].email,
      },
    ]
  })
})
