import type { Attributes } from 'sequelize'
import GenericService, { type IServiceOptions } from '../GenericService'
import InvitationModel from './invitationModel'
import LeagueUserService from '../leagueUsers/leagueUserService'
import UserService from '../users/userService'
import Boom from '@hapi/boom'
import LeagueService from '../leagues/leagueService'
import {
  type BuildMessagePayload,
  sendMessages,
  NotificationType,
} from '../../utils/notifications'

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

      const leagueName = league.get('name')

      const createdInvitation = await this.create({
        leagueId,
        userId: user.id,
        leagueName,
      })

      const notificationMessage: BuildMessagePayload = {
        title: 'Invitación a una liga',
        text: `Te han invitado a la liga ${leagueName}`,
        token: user.get('fcmToken'),
        data: createdInvitation.toJSON(),
        type: NotificationType.INVITATION,
      }

      await sendMessages([notificationMessage])

      return createdInvitation
    } catch (error) {
      throw Boom.badRequest(String(error))
    }
  }
}

export default InvitationService
