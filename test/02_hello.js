describe('* Hello =======================', () => {

  const { Hello } = global.models

  describe('* Hello', () => {
    it('world', async () => {
      const hi = 'world'
      const result = await Hello.say(hi)
      result.should.be.equal(hi)
    })
  })
})
