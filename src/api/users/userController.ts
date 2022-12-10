import GenericController from '../GenericController'
import UserService from './userService'

const service = new UserService()

class UserController extends GenericController<UserService> {
  constructor() {
    super(service)
  }
}

export default UserController
