import { CreationAttributes } from 'sequelize'
import {
  RestCountriesAPIResponseItem,
  getRestCountriesData,
} from '../../utils/geocoding'
import GenericService, { IServiceOptions } from '../GenericService'
import CountryModel from './countryModel'

const options: IServiceOptions<CountryModel> = {
  searchFields: [],
}

class CountryService extends GenericService<CountryModel> {
  constructor() {
    super(CountryModel, options)
  }

  async getCountriesData() {
    const data = await getRestCountriesData()

    const countriesToCreate = data.map((country) =>
      this.parseCountryFromRestAPI(country)
    )

    const createdCountries = await this.createMany(countriesToCreate)

    return createdCountries
  }

  private parseCountryFromRestAPI(
    restCountry: RestCountriesAPIResponseItem
  ): CreationAttributes<CountryModel> {
    const { cca2, latlng, population } = restCountry

    const [latitude, longitude] = latlng

    return {
      code: cca2,
      population,
      latitude,
      longitude,
    }
  }
}

export default CountryService
