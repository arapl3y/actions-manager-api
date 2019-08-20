'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActionSchema extends Schema {
  up () {
    this.table('actions', (table) => {
      table.dropColumn('time')
    })
  }

  down () {
    this.table('actions', (table) => {
      // reverse alternations
    })
  }
}

module.exports = ActionSchema
