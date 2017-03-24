const data = {
  nickname: 'Luffy',
  avatar: 'http://cdn.myanimelist.net/images/characters/12/274103.jpg',
  birthday: '1980-05-23',
  gender: 1,
  geo: {
    country: {
      code: 'CN',
      name: '中国',
    },
    province: '北京',
    city: {
      name: '北京',
    },
  },
  address: 'Haidian',
  interests: ['吃', '运动', '音乐'],
  signature: 'nice day, nice mood',
}

describe('* Profile =======================', () => {

  const { Profile } = global.models

  describe('* Save user profile', () => {
    it('Get user profile', async () => {
      const profile = await Profile.getProfile(env.userId)
      profile.should.have.property('id')
      profile.should.not.have.property('nickname')
      profile.should.not.have.property('avatar')
      profile.should.have.property('gender')
      profile.should.not.have.property('birthday')
      profile.should.not.have.property('geo')
    })

    it('Save profile', async () => {
      const { nickname, avatar, birthday, gender, geo, signature, interests, address } = data
      const id = env.userId
      const profile = await new Profile({ id, nickname, avatar, birthday, gender,
        geo, signature, interests, address }).save()
      profile.should.have.property('id')
      profile.should.have.property('nickname')
      profile.should.have.property('avatar')
      profile.should.have.property('gender')
      profile.should.have.property('birthday')
      profile.should.have.property('geo')
    })

    it('Save profile', async () => {
      const { avatar, birthday, gender, geo } = data
      const id = env.userId2
      const nickname = 'Monkey.D.Luffy'
      const profile = await new Profile({ id, nickname, avatar, birthday, gender, geo }).save()
      profile.should.have.property('id')
      profile.should.have.property('nickname')
      profile.should.have.property('avatar')
      profile.should.have.property('gender')
      profile.should.have.property('birthday')
      profile.should.have.property('geo')
    })

    it('Update profile', async () => {
      const id = env.userId
      data.avatar = 'new avatar'
      const { avatar } = data
      const profile = await new Profile({ id, avatar }).save()
      profile.should.have.property('id')
      profile.should.have.property('nickname')
      profile.should.have.property('avatar')
      profile.should.have.property('gender')
      profile.should.have.property('birthday')
      profile.should.have.property('geo')
    })

    it('Save signature', async () => {
      const id = env.userId
      data.signature = 'better day, better mood'
      const { signature } = data
      const result = await new Profile({ id, signature }).save()
      result.should.have.property('id')
      result.should.have.property('signature')
    })

    it('Save profile', async () => {
      const { avatar, birthday, gender, geo } = data
      const id = env.userId3
      const nickname = 'Zoro'
      await new Profile({ id, nickname, avatar, birthday, gender, geo }).save()
    })

    it('Save profile', async () => {
      const { avatar, birthday, gender, geo } = data
      const id = env.userId4
      const nickname = 'Sanji'
      await new Profile({ id, nickname, avatar, birthday, gender, geo }).save()
    })

    describe('* Error handling', () => {
      it('Unauthorized', async () => {
        try {
          env.errCount_expected++
          await Profile.getProfile(1000000001)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('UserUnauthorizedError')
          err.should.have.property('statusCode').and.equal(401)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          await new Profile().save()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidProfileError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Invalid profile', async () => {
        try {
          const id = env.userId
          env.errCount_expected++
          await new Profile({ id }).save()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidProfileError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Invalid gender', async () => {
        try {
          env.errCount_expected++
          const { nickname, avatar, birthday } = data
          const id = env.userId
          const gender = 5
          await new Profile({ id, nickname, avatar, birthday, gender }).save()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Invalid birthday', async () => {
        try {
          env.errCount_expected++
          const { nickname, avatar, gender } = data
          const id = env.userId
          const birthday = '3030-05-06'
          await new Profile({ id, nickname, avatar, birthday, gender }).save()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })

  describe('* Get user profile', () => {
    it('Get user profile', async () => {
      const profile = await Profile.getProfile(env.userId)
      profile.should.have.property('id')
      profile.should.have.property('nickname').and.equal(data.nickname)
      profile.should.have.property('avatar').and.equal(data.avatar)
      profile.should.have.property('gender').and.equal(data.gender)
      profile.should.have.property('birthday')
      new Date(profile.birthday).valueOf().should.equal(new Date(data.birthday).valueOf())
      profile.should.have.property('geo')
      profile.geo.should.have.property('country')
      profile.geo.country.should.have.property('code')
      profile.geo.country.should.have.property('name')
      profile.geo.should.have.property('province')
      profile.geo.should.have.property('city')
      profile.geo.city.should.have.property('id')
      profile.geo.city.should.have.property('name')
      profile.should.have.property('signature')
      profile.should.have.property('address')
      profile.should.have.property('interests')
      profile.should.have.property('followers')
      profile.should.have.property('followings')
      profile.should.have.property('name')
      profile.should.have.property('mobile')
      profile.mobile.should.have.property('region')
      profile.mobile.should.have.property('number')
      profile.should.not.have.property('follower')
      profile.should.not.have.property('following')
    })

    it('Get others user profile', async () => {
      const profile = await Profile.getProfile(env.userId, env.userId2)
      profile.should.have.property('id')
      profile.should.have.property('nickname').and.not.equal(data.nickname)
      profile.should.have.property('avatar')
      profile.should.have.property('gender')
      profile.should.not.have.property('birthday')
      profile.should.have.property('geo')
      profile.geo.should.have.property('country')
      profile.geo.should.have.property('province')
      profile.geo.should.have.property('city')
      profile.should.have.property('followers')
      profile.should.have.property('followings')
      profile.should.not.have.property('name')
      profile.should.not.have.property('phoneNumber')
      profile.should.not.have.property('email')
      profile.should.have.property('follower').and.not.ok
      profile.should.have.property('following').and.not.ok
    })

    describe('* Error handling', () => {
      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          await Profile.getProfile()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Invalid id', async () => {
        try {
          env.errCount_expected++
          await Profile.getProfile(10000)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })
})
