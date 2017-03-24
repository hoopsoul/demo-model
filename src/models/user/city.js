import errors from '../../errors'

const ERRORS = {
  SaveCityFailed: 400,
}

errors.register(ERRORS)

export class City {
  static async getCityCode(geo) {
    if (!geo) return null
    const { country, province, city } = geo
    const query = `
      SELECT id
      FROM "user".city
      WHERE
        country_code ILIKE $1
        AND country ILIKE $2
        AND province ILIKE $3
        AND city ILIKE $4
      ;`
    /* eslint-disable no-undef */
    const params = [country.code, country.name, province, city.name]
    const result = await db.query(query, params)
    if (result.rowCount > 0) {
      /* eslint-disable no-param-reassign */
      geo.city.id = result.rows[0].id
      return geo
    }
    const queryNew = `
      INSERT INTO "user".city (country_code, country, province, city)
      SELECT $1::varchar, $2::varchar, $3::varchar, $4::varchar
      WHERE NOT EXISTS (
        SELECT id
        FROM "user".city
        WHERE
          country_code ILIKE $1
          AND country ILIKE $2
          AND province ILIKE $3
          AND city ILIKE $4
      ) RETURNING id
      ;`
    const resultNew = await db.query(queryNew, params)
    if (resultNew.rowCount <= 0) throw new errors.SaveCityFailedError()
    geo.city.id = resultNew.rows[0].id
    return geo
  }
}
