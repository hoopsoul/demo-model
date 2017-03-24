import fs from 'fs'
import path from 'path'

describe('* Test data =======================', () => {
  it('Create fake test data', async () => {
    const dataPath = path.join(__dirname, 'data')
    const files = fs.readdirSync(dataPath)
    files.sort()
    const queryArr = []
    for (const f of files) {
      queryArr.push(fs.readFileSync(path.join(dataPath, f)))
    }
    const query = queryArr.join(';')
    /* eslint-disable no-undef */
    await db.query(query)
  })
})
