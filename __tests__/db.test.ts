import { getDialect } from '../src/dbConnection'

describe('DB Tests', () => {
  it('Should get the correct dialect', () => {
    const dialect = getDialect()

    expect(dialect).toBe('mysql')
  })
})
