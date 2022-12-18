import GenericController from '../GenericController'
import ConquistService from './conquistService'

const service = new ConquistService()

class ConquistController extends GenericController<ConquistService> {
  constructor() {
    super(service)
  }
}

export default ConquistController
