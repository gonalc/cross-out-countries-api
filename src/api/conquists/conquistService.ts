import GenericService, { IServiceOptions } from '../GenericService'
import ConquistModel from './conquistModel'

const options: IServiceOptions<ConquistModel> = {
  searchFields: ['country', 'place', 'province'],
}

class ConquistService extends GenericService<ConquistModel> {
  constructor() {
    super(ConquistModel, options)
  }
}

export default ConquistService
