import { Attributes } from 'sequelize'
import GenericService, { IServiceOptions } from '../GenericService'
import InvitationModel from './invitationModel'
import LeagueUserService from '../leagueUsers/leagueUserService'

const leagueUserService = new LeagueUserService()

const options: IServiceOptions<InvitationModel> = {
  searchFields: [],
}

class InvitationService extends GenericService<InvitationModel> {
  constructor() {
    super(InvitationModel, options)
  }

  async accept(invitationId: number, invitation: Attributes<InvitationModel>) {
    const { leagueId, userId } = invitation

    const createdLeagueUser = await leagueUserService.create({
      leagueId,
      userId,
    })

    await this.destroy(invitationId)

    return createdLeagueUser
  }
}

export default InvitationService
