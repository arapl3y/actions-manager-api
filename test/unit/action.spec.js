'use strict'

const Factory = use('Factory')
const { test, trait } = use('Test/Suite')('Action')

trait('Auth/Client')
trait('Test/ApiClient')


test('can create an action if authenticated', async({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const data = {
    "title": "Meditate for 30 minutes",
    "complete": false,
    "date": "2019-08-16",
    "time": "10:30:00"
  }

  const response = await client
    .post('actions/new')
    .loginVia(user, 'jwt')
    .send(data)
    .end()

  console.log(response.error);

  response.assertStatus(201)
  response.assertJSONSubset({
    user_id: user.id,
    title: data.title,
    completed: data.completed,
    date: data.date,
    time: data.time
  })
})


test('cannot create an action if not authenticated', async({ client }) => {
  const data = {
    "title": "Meditate for 30 mins",
    "complete": false,
    "date": "2019-17-10",
    "time": "14:22:00"
  }

  const response = await client
    .post('/actions/new')
    .send(data)
    .end()

  response.assertStatus(401)
})

test('cannot create an action without a title', async({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const { completed } = await Factory.model('App/Models/Action').make()

  const data = {
    "complete": completed
  }

  const response = await client
    .post('/actions/new')
    .loginVia(user, 'jwt')
    .send(data)
    .end()

  response.assertStatus(400)
  response.assertJSONSubset([
    {
      message: 'title is required',
      field: 'title',
      validation: 'required'
    }
  ])
})
