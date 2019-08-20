'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { message: 'Welcome to the Actions Manager API' }
})

// Unprotected auth
Route.post('login', 'AuthController.login')

// Unprotected users
Route.get('users', 'UserController.index')
Route.post('users/new', 'UserController.store')
Route.post('users/forgotPassword', 'ForgotPasswordController.store')
Route.put('users/forgotPassword/:token/:email', 'ForgotPasswordController.update')

// Protected routes
Route.group(() => {
  // Auth
  Route.get('users/me', 'AuthController.getUser')

  // Users
  Route.put('users/:id', 'UserController.update')

  // Actions
  Route.get('actions/list', 'ActionController.index')
  Route.get('actions/:id', 'ActionController.show')
  Route.put('actions/:id', 'ActionController.update').validator('UpdateAction')
  Route.post('actions/new', 'ActionController.store').validator('Action')
  Route.delete('actions/:id/delete', 'ActionController.destroy')
}).middleware(['auth'])



