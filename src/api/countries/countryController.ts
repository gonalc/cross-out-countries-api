import express from 'express'
import GenericController from '../GenericController'
import CountryService from './countryService'
import { StatusCodes } from 'http-status-codes'

const service = new CountryService()

class CountryController extends GenericController<CountryService> {
  constructor() {
    super(service)
  }

  getCountriesData = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const data = await this.service.getCountriesData()

      return res.status(StatusCodes.OK).json({ data })
    } catch (error) {
      return next(error)
    }
  }
}

export default CountryController
