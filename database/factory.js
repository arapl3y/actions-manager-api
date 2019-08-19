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

Factory.blueprint('App/Models/User', (faker, i, data) => {
  const defaultValue =  {
    username: faker.username(),
    email: faker.email(),
    password: 'password123'
  }

  return Object.assign(defaultValue, data)
})

Factory.blueprint('App/Models/Action', (faker, i, data) => {
  return {
    user_id: async () => {
      return data.id || (await Factory.model('App/Models/User').create()).id
    },
    title: faker.sentence(),
    complete: false,
    date: faker.date(),
    time: "14:22:00"
  }
})
