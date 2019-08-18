'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

Factory.blueprint('App/Models/User', (faker) => {
  return {
    username: faker.username(),
    email: faker.email(),
    password: 'password123'
  }
})

Factory.blueprint('App/Models/Action', (faker) => {
  return {
    title: faker.sentence(),
    complete: false,
    date: "2016-18-20",
    time: "14:22:00"
  }
})
