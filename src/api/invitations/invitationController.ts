import GenericController from '../GenericController'
import InvitationsService from './invitationService'

const service = new InvitationsService()

class InvitationController extends GenericController<InvitationsService> {
  constructor() {
    super(service)
  }
}

export default InvitationController
