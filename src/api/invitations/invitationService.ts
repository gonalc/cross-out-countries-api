import GenericService, { IServiceOptions } from '../GenericService'
import InvitationModel from './invitationModel'

const options: IServiceOptions<InvitationModel> = {
  searchFields: [],
}

class InvitationService extends GenericService<InvitationModel> {
  constructor() {
    super(InvitationModel, options)
  }
}

export default InvitationService
