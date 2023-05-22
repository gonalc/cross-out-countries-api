import { Attributes } from 'sequelize'
import GenericService, { IServiceOptions } from '../GenericService'
import InvitationModel from './invitationModel'
import LeagueUserService from '../leagueUsers/leagueUserService'
import UserService from '../users/userService'
import Boom from '@hapi/boom'
import LeagueService from '../leagues/leagueService'

const leagueUserService = new LeagueUserService()
const leagueService = new LeagueService()
const userService = new UserService()

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

  async invite(username: string, leagueId: number) {
    try {
      const user = await userService.getOneByField({
        where: { username },
      })

      const league = await leagueService.getSingle(leagueId, {})

      if (!user) {
        throw Boom.notFound('User not found')
      }

      if (!league) {
        throw Boom.notFound('League not found')
      }

      const createdInvitation = await this.create({
        leagueId,
        userId: user.id,
        leagueName: league.get('name'),
      })

      return createdInvitation
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }
}

export default InvitationService
