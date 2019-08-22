'use strict'

const Factory = use('Factory')
const { test, trait } = use('Test/Suite')('Create Action')

trait('Auth/Client')
trait('Test/ApiClient')

test('can create an action if authenticated', async({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const { title } = await Factory.model('App/Models/Action').make()

  const data = {
    title,
    complete: false,
    date: "2019-08-16"
  }

  const response = await client
    .post('actions')
    .loginVia(user, 'jwt')
    .send(data)
    .end()

  response.assertStatus(201)
  response.assertJSONSubset({
    user_id: user.id,
    title: data.title,
    complete: data.complete,
    date: data.date
  })
})


test('cannot create an action if not authenticated', async({ client }) => {
  const data = {
    title: "Meditate for 30 mins",
    complete: false,
    date: "2019-17-10"
  }

  const response = await client
    .post('/actions')
    .send(data)
    .end()

  response.assertStatus(401)
})

test('cannot create an action without a title', async({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const { complete } = await Factory.model('App/Models/Action').make()

  const data = {
    complete
  }

  const response = await client
    .post('actions')
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

test('cannot create an action if title is not a string', async({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const data = {
    title: 123
  }

  const response = await client
    .post('actions')
    .loginVia(user, 'jwt')
    .send(data)
    .end()

  response.assertStatus(400)
  response.assertJSONSubset([
    {
      message: 'title is not a valid string',
      field: 'title',
      validation: 'string'
    }
  ])
})

test('cannot create an action if complete is not a boolean', async({ client }) => {
  const user = await Factory.model('App/Models/User').create()

  const data = {
    complete: 123
  }

  const response = await client
    .post('actions')
    .loginVia(user, 'jwt')
    .send(data)
    .end()

  response.assertStatus(400)
  response.assertJSONSubset([
    {
      message: 'complete is not a valid boolean',
      field: 'complete',
      validation: 'boolean'
    }
  ])
})

