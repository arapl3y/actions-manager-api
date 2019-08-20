'use strict'

class Action {
  get rules () {
    return {
      title: 'required|string',
      complete: 'boolean',
      date: 'date'
    }
  }

  get messages() {
    return {
      required: '{{ field }} is required',
      string: '{{ field }} is not a valid string'
    }
  }

  get validateAll() {
    return true
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json(errorMessages)
  }
}

module.exports = Action
