import Boom from '@hapi/boom'
import axios from 'axios'
import LogControl from './logControl'

type GeocodePayload = {
  country: string
  city?: string
}

type Coordinates = {
  latitude: number
  longitude: number
}

export interface RestCountriesAPIResponseItem {
  cca2: string
  latlng: [number, number]
  population: number
}

const GEOCODE_URL = 'https://api.opencagedata.com/geocode/v1/json'
const getGeonameUrl = (countryName: string) =>
  `http://api.geonames.org/searchJSON?q=${countryName}&maxRows=1&username=${process.env.GEONAME_USERNAME}`
const REST_COUNTRIES_API_URL = 'https://restcountries.com/v3.1/all'

export async function geocode(payload: GeocodePayload): Promise<Coordinates> {
  try {
    const response = await axios.get(GEOCODE_URL, {
      params: {
        key: process.env.OPEN_CAGE_API,
        q: Object.values(payload).join(','),
        countrycode: payload.country,
        pretty: 1,
      },
    })

    const { results } = response.data

    if (results.length) {
      const { lat, lng } = results[0].geometry

      return { latitude: lat, longitude: lng }
    } else {
      throw Boom.notFound(`Location not found for: ${payload.country}`)
    }
  } catch (error) {
    throw Boom.badRequest(String(error))
  }
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function calculateDistance(
  point1: Coordinates,
  point2: Coordinates
): number {
  const EARTH_RADIUS = 6371

  const deltaLatitude = toRadians(point2.latitude - point1.latitude)
  const deltaLongitude = toRadians(point2.longitude - point1.longitude)

  const a =
    Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
    Math.cos(toRadians(point1.latitude)) *
      Math.cos(toRadians(point2.latitude)) *
      Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude * 2)

  const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distance = EARTH_RADIUS * centralAngle

  if (isNaN(distance)) {
    const errorText = `Distance could haven't been calculated between these two points:

${JSON.stringify(point1, null, 2)}
    
${JSON.stringify(point2, null, 2)}`

    LogControl.createLog(
      errorText,
      'distance-error-calculation.txt',
      'distance'
    )
  }

  return distance
}

export async function getCountryData(data: GeocodePayload) {
  try {
    const url = getGeonameUrl(data.country)

    const response = await axios.get(url)

    return response.data
  } catch (error) {
    throw Boom.badRequest(String(error))
  }
}

export async function getRestCountriesData(): Promise<
  RestCountriesAPIResponseItem[]
> {
  const res = await axios.get(REST_COUNTRIES_API_URL)

  return res.data
}
