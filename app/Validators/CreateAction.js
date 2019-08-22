'use strict'

class CreateAction {
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
      string: '{{ field }} is not a valid string',
      boolean: '{{ field }} is not a valid boolean',
      date: '{{ field }} is not a valid date',
    }
  }

  get validateAll() {
    return true
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json(errorMessages)
  }
}

module.exports = CreateAction
