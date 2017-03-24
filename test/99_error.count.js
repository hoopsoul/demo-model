describe('* Error =======================', () => {

  it('Count expected error', async () => {
    env.errCount_actual.should.be.equal(env.errCount_expected)
  })
})
