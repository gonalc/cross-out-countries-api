import '../env'
import '../db'

import ConquistService from '../api/conquists/conquistService'
import UserService from '../api/users/userService'
import logger from '../utils/logger'

const conquistService = new ConquistService()
const userService = new UserService()

async function recalculateUsersScore() {
  const users = await userService.getAll({
    include: 'conquists',
    attributes: ['id', 'name'],
  })

  for (const user of users) {
    const { conquists, id } = user

    if (conquists?.length) {
      const score = conquists.reduce((total, conquist) => {
        const { score: conquistScore } = conquist

        if (conquistScore) {
          return conquistScore + total
        }

        return total
      }, 0)

      await userService.update(id, { score }, {})
    }
  }
}

async function recalculateScores() {
  try {
    const conquists = await conquistService.getAll({})

    for (const conquist of conquists) {
      const score = await conquistService.scoreCalculator(conquist)

      await conquistService.update(conquist.id, { score }, {})
    }

    await recalculateUsersScore()

    logger.info('Score recalculated successfully')
    process.exit(0)
  } catch (error) {
    process.exit(1)
  }
}

recalculateScores()
