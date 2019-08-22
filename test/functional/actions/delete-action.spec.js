'use strict'

const Factory = use('Factory')
const { test, trait } = use('Test/Suite')('Delete Action')

trait('Auth/Client')
trait('Test/ApiClient')

test('a user can delete an action they own', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const action = await Factory.model('App/Models/Action').make()

  await user.actions().save(action)

  const response = await client
    .delete(`/actions/${action.id}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(204)
})

// Add test for deleting action that doesn't exist
