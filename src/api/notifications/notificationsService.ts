import { FindOptions, Op } from 'sequelize'
import {
  BuildMessagePayload,
  type BaseMessage,
  sendMessages,
  NotificationType,
} from '../../utils/notifications'
import UserService from '../users/userService'
import type { UserAttributes } from '../users/userTypes'

const userService = new UserService()

class NotificationsService {
  async send(
    message: Omit<BaseMessage, 'type'>,
    recipientIds?: UserAttributes['id'][]
  ) {
    const options: FindOptions<UserAttributes> = {
      attributes: ['id', 'fcmToken'],
    }

    if (recipientIds?.length) {
      options.where = {
        id: {
          [Op.in]: recipientIds,
        },
      }
    }

    const recipients = await userService.getAll(options)

    const messages: BuildMessagePayload[] = recipients.map((recipient) => {
      const data: BuildMessagePayload = {
        ...message,
        type: NotificationType.GENERIC,
        token: recipient.get('fcmToken'),
      }

      return data
    })

    await sendMessages(messages)

    return { message: 'Notifications sent' }
  }
}

export default NotificationsService
