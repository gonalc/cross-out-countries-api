import { calculateDistance, type Coordinates } from '../src/utils/geocoding'

const americanSamoa: Coordinates = {
  latitude: -14.3333,
  longitude: -170,
}

const cambodia: Coordinates = {
  latitude: 13,
  longitude: 105,
}

const china: Coordinates = {
  latitude: 35,
  longitude: 105,
}

const bangladesh: Coordinates = {
  latitude: 24,
  longitude: 90,
}

const russia: Coordinates = {
  latitude: 60,
  longitude: 100,
}

const italy: Coordinates = {
  latitude: 42.8333,
  longitude: 12.8333,
}

const spain: Coordinates = {
  latitude: 40,
  longitude: -4,
}

describe('Distance calculator tests', () => {
  it('Should get the distance between Spain and all other countries', () => {
    const targetCountries: Coordinates[] = [
      americanSamoa,
      cambodia,
      china,
      bangladesh,
      russia,
      italy,
    ]

    targetCountries.forEach((country) => {
      const distance = calculateDistance(spain, country)

      expect(distance).not.toBeNaN()
    })
  })

  it('Should get longer distance between Spain and other countries than between Spain and Italy', () => {
    const italyDistance = calculateDistance(spain, italy)

    const targetCountries: Coordinates[] = [
      americanSamoa,
      cambodia,
      china,
      bangladesh,
      russia,
    ]

    targetCountries.forEach((country) => {
      const distance = calculateDistance(spain, country)

      expect(distance).not.toBeNaN()
      expect(distance).toBeGreaterThan(italyDistance)
    })
  })
})
