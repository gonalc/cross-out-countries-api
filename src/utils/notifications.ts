import { Expo, ExpoPushTicket, type ExpoPushMessage } from 'expo-server-sdk'
import logger from './logger'

export enum NotificationType {
  INVITATION = 'invitation',
  CONQUIST = 'conquist',
}

export type BuildMessagePayload = {
  token: string
  data?: object
  text?: string
  title: string
  type: NotificationType
}

const expo = new Expo()

function buildMessage({
  text = '',
  title,
  data,
  type,
  token,
}: BuildMessagePayload) {
  if (!Expo.isExpoPushToken(token)) {
    logger.error(`This token is not valid: ${token}`)
    return null
  }

  const message: ExpoPushMessage = {
    to: token,
    sound: 'default',
    body: text,
    title,
    data: {
      payload: data,
      type,
    },
  }

  return message
}

export async function sendMessages(data: BuildMessagePayload[]) {
  const messages = data.map(buildMessage).filter(Boolean) as ExpoPushMessage[]

  const chunks = expo.chunkPushNotifications(messages)

  const tickets: ExpoPushTicket[] = []

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk)
      tickets.push(...ticketChunk)

      logger.debug('Notification sent correctly')
      logger.debug(JSON.stringify(ticketChunk, null, 1))
    } catch (error) {
      logger.error('There was an error with the notifications:')
      logger.error(JSON.stringify(error, null, 1))
    }
  }
}
