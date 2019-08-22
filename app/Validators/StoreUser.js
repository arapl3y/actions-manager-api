'use strict'

class StoreUser {
  get rules () {
    return {
      email: 'required|email|unique:users',
      username: 'required|unique:users',
      password: 'required'
    }
  }

  get messages () {
    return {
      required: '{{ field }} is required',
      string: '{{ field }} is not a valid string',
      unique: '{{ field }} is already in use'
    }
  }

  get validateAll() {
    return true
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json(errorMessages)
  }
}

module.exports = StoreUser
