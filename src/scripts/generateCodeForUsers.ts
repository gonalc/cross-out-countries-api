import UserService from '../api/users/userService'
import { generateCode } from '../utils/codeGenerator'
import logger from '../utils/logger'

async function generateCodeForExistingUsers() {
  const userService = new UserService()

  const users = await userService.getAll({
    attributes: ['id', 'referralCode', 'country', 'username'],
  })

  for (const userData of users) {
    const user = userData.toJSON()

    const { id, referralCode, country, username } = user

    if (!referralCode?.length) {
      const code = generateCode({ username, country })

      await userService.updateUser(id, { referralCode: code }, {})
    }
  }

  logger.info('Codes generated successfully')
}

generateCodeForExistingUsers()
