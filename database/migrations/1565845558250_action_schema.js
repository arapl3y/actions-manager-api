'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActionSchema extends Schema {
  up () {
    this.create('actions', (table) => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('SET NULL')
      table.boolean('complete')
      table.string('title').notNullable()
      table.datetime('date').notNullable()
      table.time('time').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('actions')
  }
}

module.exports = ActionSchema
