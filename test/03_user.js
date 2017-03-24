const data = {
  name: 'username',
  regionCode: '+86',
  phoneNumber: '13800138000',
  email: 'user@demo.com',
  verifyCode: 123456,
  password: '1qaz!QAZ',
}

describe('* User =======================', () => {

  const { User, Profile } = global.models

  describe('* New user by phone', () => {
    it('Send phone number verify code', async () => {
      const { verifyCode } = data
      const phoneNumber = data.regionCode + data.phoneNumber
      await User.sendVerifyCode(phoneNumber, verifyCode)
    })

    it('Verify phone number and return temporary userId', async () => {
      const { regionCode, phoneNumber, verifyCode } = data
      const user = {
        mobile: {
          region: regionCode,
          number: phoneNumber,
        },
      }
      const result = await new User(user).verify(verifyCode)
      result.should.have.property('id')
      env.userId = result.id
      result.should.have.property('mobile')
      result.mobile.should.have.property('region')
      result.mobile.should.have.property('number')
      result.should.not.have.property('name')
      result.should.not.have.property('email')
      result.should.not.have.property('password')
    })

    it('Send phone number verify code', async () => {
      const phoneNumber = '+8613800137999'
      const { verifyCode } = data
      await User.sendVerifyCode(phoneNumber, verifyCode)
    })

    it('Verify phone number and return temporary userId', async () => {
      const phoneNumber = '13800137999'
      const { regionCode, verifyCode } = data
      const user = {
        mobile: {
          region: regionCode,
          number: phoneNumber,
        },
      }
      const result = await new User(user).verify(verifyCode)
      result.should.have.property('id')
      env.userId3 = result.id
    })

    it('Send phone number verify code', async () => {
      const phoneNumber = '+8613800137990'
      const { verifyCode } = data
      await User.sendVerifyCode(phoneNumber, verifyCode)
    })

    it('Verify phone number and return temporary userId', async () => {
      const phoneNumber = '13800137990'
      const { regionCode, verifyCode } = data
      const user = {
        mobile: {
          region: regionCode,
          number: phoneNumber,
        },
      }
      const result = await new User(user).verify(verifyCode)
      result.should.have.property('id')
      env.userId4 = result.id
    })

    describe('* Error handling', () => {
      it('Verify phone number with right verify code but code expired after verified', async () => {
        try {
          env.errCount_expected++
          const { regionCode, phoneNumber, verifyCode } = data
          const user = {
            mobile: {
              region: regionCode,
              number: phoneNumber,
            },
          }
          await new User(user).verify(verifyCode)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidVerifyCodeError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Resend phone number in 30 seconds', async () => {
        try {
          env.errCount_expected++
          const phoneNumber = data.regionCode + data.phoneNumber
          const verifyCode = 123321
          await User.sendVerifyCode(phoneNumber, verifyCode)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('SendVerifyCodeTooOftenError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Invalid verify code', async () => {
        try {
          env.errCount_expected++
          const { regionCode, phoneNumber } = data
          const verifyCode = '654321'
          const user = {
            mobile: {
              region: regionCode,
              number: phoneNumber,
            },
          }
          await new User(user).verify(verifyCode)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidVerifyCodeError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          await User.sendVerifyCode()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          const { regionCode, phoneNumber } = data
          const user = {
            mobile: {
              region: regionCode,
              number: phoneNumber,
            },
          }
          await new User(user).verify()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })

  describe('* New user by email', () => {
    it('Send verify email', async () => {
      const { email, verifyCode } = data
      await User.sendVerifyEmail(email, verifyCode)
    })

    it('Verify email', async () => {
      const { email, verifyCode } = data
      const result = await new User({ email }).verify(verifyCode)
      result.should.have.property('id')
      env.userId2 = result.id
      result.should.have.property('email')
      result.should.not.have.property('name')
      result.should.not.have.property('phoneNumber')
      result.should.not.have.property('password')
    })

    describe('* Error handling', () => {
      it('Verify email with right verify code but code expired after verified', async () => {
        try {
          env.errCount_expected++
          const { email, verifyCode } = data
          await new User({ email }).verify(verifyCode)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidVerifyCodeError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Resend verify email in 30 seconds', async () => {
        try {
          env.errCount_expected++
          const { email } = data
          const verifyCode = 112233
          await User.sendVerifyEmail(email, verifyCode)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('SendVerifyCodeTooOftenError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Email invalid', async () => {
        try {
          env.errCount_expected++
          const email = 'invalid email'
          const { verifyCode } = data
          await new User({ email }).verify(verifyCode)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Verify code invalid', async () => {
        try {
          env.errCount_expected++
          const { email } = data
          const verifyCode = 776655
          await new User({ email }).verify(verifyCode)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidVerifyCodeError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          await User.sendVerifyEmail()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          const { email } = data
          await new User({ email }).verify()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })

  describe('* Save password', () => {
    it('Save password', async () => {
      const id = env.userId
      const { password } = data
      const result = await new User({ id }).savePassword(password)
      result.should.have.property('id')
      result.should.not.have.property('name')
      result.should.not.have.property('phoneNumber')
      result.should.not.have.property('email')
      result.should.not.have.property('password')
    })

    it('Save password for user 2', async () => {
      const id = env.userId2
      const { password } = data
      const result = await new User({ id }).savePassword(password)
      result.should.have.property('id')
    })

    it('Save password for user 3', async () => {
      const id = env.userId3
      const { password } = data
      const result = await new User({ id }).savePassword(password)
      result.should.have.property('id')
    })

    it('Save password for user 4', async () => {
      const id = env.userId4
      const { password } = data
      const result = await new User({ id }).savePassword(password)
      result.should.have.property('id')
    })

    describe('* Error handling', () => {
      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          const id = env.userId4
          await new User({ id }).savePassword()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Account verified, create new user by same phone number', async () => {
        try {
          env.errCount_expected++
          const { verifyCode } = data
          const phoneNumber = data.regionCode + data.phoneNumber
          await User.sendVerifyCode(phoneNumber, verifyCode)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('PhoneNumberDuplicatedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Account verified, create new user but email duplicated', async () => {
        try {
          env.errCount_expected++
          const { email, verifyCode } = data
          await User.sendVerifyEmail(email, verifyCode)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('EmailDuplicatedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })

  describe('* Save user name', () => {
    it('Save user name', async () => {
      const id = env.userId
      const { name } = data
      await new Profile({ id, name }).save()
    })

    describe('* Error handling', () => {
      it('User name could only set once', async () => {
        try {
          env.errCount_expected++
          const id = env.userId
          const { name } = data
          await new Profile({ id, name }).save()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('UserNameSetTwiceError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('User name duplicated', async () => {
        try {
          env.errCount_expected++
          const id = env.userId2
          const { name } = data
          await new Profile({ id, name }).save()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('UserNameDuplicatedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })

  describe('* Phone number Login', () => {
    it('Login by phone number', async () => {
      const { regionCode, phoneNumber, password } = data
      const user = {
        mobile: {
          region: regionCode,
          number: phoneNumber,
        },
      }
      const result = await new User(user).login(password)
      result.should.have.property('id')
      result.should.have.property('mobile')
      result.mobile.should.have.property('region')
      result.mobile.should.have.property('number')
      result.should.not.have.property('name')
      result.should.not.have.property('email')
      result.should.not.have.property('password')
      result.should.not.have.property('nickname')
    })

    describe('* Error handling', () => {
      it('Invalid identification', async () => {
        try {
          env.errCount_expected++
          const { regionCode, phoneNumber } = data
          const password = 'wrong'
          const user = {
            mobile: {
              region: regionCode,
              number: phoneNumber,
            },
          }
          await new User(user).login(password)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidIdentificationError')
          err.should.have.property('statusCode').and.equal(401)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          const { regionCode, phoneNumber } = data
          const user = {
            mobile: {
              region: regionCode,
              number: phoneNumber,
            },
          }
          await new User(user).login()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })

  describe('* Email Login', () => {
    it('Login by email', async () => {
      const { email, password } = data
      const result = await new User({ email }).login(password)
      result.should.have.property('id')
      result.should.have.property('email')
      result.should.not.have.property('name')
      result.should.not.have.property('phoneNumber')
      result.should.not.have.property('password')
    })

    describe('* Error handling', () => {
      it('Invalid identification', async () => {
        try {
          env.errCount_expected++
          const { email } = data
          const password = 'wrong'
          await new User({ email }).login(password)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidIdentificationError')
          err.should.have.property('statusCode').and.equal(401)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          const { email } = data
          await new User({ email }).login()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })

  describe('* Username Login', () => {
    it('Login by username', async () => {
      const { name, password } = data
      const result = await new User({ name }).login(password)
      result.should.have.property('id')
      result.should.have.property('name')
      result.should.not.have.property('phoneNumber')
      result.should.not.have.property('email')
      result.should.not.have.property('password')
    })

    describe('* Error handling', () => {
      it('Invalid identification', async () => {
        try {
          env.errCount_expected++
          const { name } = data
          const password = 'wrong'
          await new User({ name }).login(password)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidIdentificationError')
          err.should.have.property('statusCode').and.equal(401)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          const { name } = data
          await new User({ name }).login()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })

  describe('* Change password', () => {
    it('Change password by phone user', async () => {
      const id = env.userId
      const oldPassword = data.password
      const password = '2wsx@WSX'
      const result = await new User({ id }).changePassword(password, oldPassword)
      result.should.have.property('id')
      result.should.not.have.property('userName')
      result.should.not.have.property('name')
      result.should.not.have.property('phoneNumber')
      result.should.not.have.property('email')
      result.should.not.have.property('password')
    })

    it('Login by phone number and new password', async () => {
      const { regionCode, phoneNumber } = data
      const password = '2wsx@WSX'
      const user = {
        mobile: {
          region: regionCode,
          number: phoneNumber,
        },
      }
      const result = await new User(user).login(password)
      result.should.have.property('id')
    })

    it('Change password by email user', async () => {
      const id = env.userId2
      const oldPassword = data.password
      const password = '3edc#EDC'
      data.password = password
      const result = await new User({ id }).changePassword(password, oldPassword)
      result.should.have.property('id')
      result.should.not.have.property('userName')
      result.should.not.have.property('name')
      result.should.not.have.property('phoneNumber')
      result.should.not.have.property('email')
      result.should.not.have.property('password')
    })

    it('Login by email and new password', async () => {
      const { email } = data
      const password = '3edc#EDC'
      const result = await new User({ email }).login(password)
      result.should.have.property('id')
    })

    describe('* Error handling', () => {
      it('Invalid identification', async () => {
        try {
          env.errCount_expected++
          const id = env.userId
          const oldPassword = 'wrong'
          const password = 'new password'
          await new User({ id }).changePassword(password, oldPassword)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidIdentificationError')
          err.should.have.property('statusCode').and.equal(401)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          const id = env.userId
          await new User({ id }).changePassword()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })

  describe('* Get user', () => {
    it('Get user by id', async () => {
      const result = await User.getUser(env.userId)
      result.should.have.property('id')
      result.should.have.property('name')
      result.should.have.property('mobile')
      result.mobile.should.have.property('region')
      result.mobile.should.have.property('number')
      result.should.not.have.property('email')
      result.should.not.have.property('password')
    })

    it('Get user by id 2', async () => {
      const result = await User.getUser(env.userId2)
      result.should.have.property('id')
      result.should.not.have.property('name')
      result.should.not.have.property('phoneNumber')
      result.should.have.property('email')
      result.should.not.have.property('password')
    })
    describe('* Error handling', () => {
      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          await User.getUser()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('User not found', async () => {
        try {
          env.errCount_expected++
          await User.getUser(99999999999)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('UserNotFoundError')
          err.should.have.property('statusCode').and.equal(404)
        }
      })
    })
  })

  describe('* Forgot password', () => {
    it('Send phone number forgot password verify code', async () => {
      const { verifyCode } = data
      const user = {
        mobile: {
          region: data.regionCode,
          number: data.phoneNumber,
        },
      }
      await new User(user).sendVerifyCode(verifyCode)
    })

    it('Verify phone number forgot password and return userId', async () => {
      const { verifyCode } = data
      const mobile = {
        region: data.regionCode,
        number: data.phoneNumber,
      }
      const result = await new User({ mobile }).verifyCode(verifyCode)
      result.should.have.property('id').and.equal(env.userId)
      result.should.have.property('token')
      env.userToken1 = result.token
    })

    it('Reset password', async () => {
      const id = env.userId
      const password = '4rfv$RFV'
      const result = await new User({ id }).resetPassword(password, env.userToken1)
      result.should.have.property('id').and.equal(env.userId)
      result.should.not.have.property('phoneNumber')
      result.should.not.have.property('name')
      result.should.not.have.property('email')
      result.should.not.have.property('password')
    })

    it('Login by phone number and new password', async () => {
      const { name } = data
      const password = '4rfv$RFV'
      const result = await new User({ name }).login(password)
      result.should.have.property('id')
    })

    it('Send email forgot password verify code', async () => {
      const { email, verifyCode } = data
      await new User({ email }).sendVerifyCode(verifyCode)
    })

    it('Verify email forgot password and return userId', async () => {
      const { email, verifyCode } = data
      const result = await new User({ email }).verifyCode(verifyCode)
      result.should.have.property('id').and.equal(env.userId2)
      result.should.have.property('token')
      env.userToken2 = result.token
    })

    it('Reset password', async () => {
      const id = env.userId2.toString()
      const password = '5tgb%TGB'
      const result = await new User({ id }).resetPassword(password, env.userToken2)
      result.should.have.property('id').and.equal(env.userId2)
      result.should.not.have.property('name')
      result.should.not.have.property('email')
      result.should.not.have.property('password')
    })

    it('Login by email and new password', async () => {
      const { email } = data
      const password = '5tgb%TGB'
      const result = await new User({ email }).login(password)
      result.should.have.property('id')
    })

    describe('* Error handling', () => {
      it('User identity required', async () => {
        try {
          env.errCount_expected++
          await new User().sendVerifyCode('123456')
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('UserIdentityRequiredError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Verify phone number with right verify code but code expired after verified', async () => {
        try {
          env.errCount_expected++
          const { verifyCode } = data
          const mobile = {
            region: data.regionCode,
            number: data.phoneNumber,
          }
          await new User({ mobile }).verifyCode(verifyCode)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidVerifyCodeError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Verify email with right verify code but code expired after verified', async () => {
        try {
          env.errCount_expected++
          const { email, verifyCode } = data
          await new User({ email }).verifyCode(verifyCode)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidVerifyCodeError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Resend phone number in 30 seconds', async () => {
        try {
          env.errCount_expected++
          const verifyCode = 123321
          const user = {
            mobile: {
              region: data.regionCode,
              number: data.phoneNumber,
            },
          }
          await new User(user).sendVerifyCode(verifyCode)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('SendVerifyCodeTooOftenError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Resend email in 30 seconds', async () => {
        try {
          env.errCount_expected++
          const { email } = data
          const verifyCode = 123321
          await new User({ email }).sendVerifyCode(verifyCode)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('SendVerifyCodeTooOftenError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Invalid verify code', async () => {
        try {
          env.errCount_expected++
          const verifyCode = '654321'
          const mobile = {
            region: data.regionCode,
            number: data.phoneNumber,
          }
          await new User({ mobile }).verifyCode(verifyCode)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidVerifyCodeError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Invalid verify code', async () => {
        try {
          env.errCount_expected++
          const { email } = data
          const verifyCode = '654321'
          await new User({ email }).verifyCode(verifyCode)
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('InvalidVerifyCodeError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          const user = {
            mobile: {
              region: data.regionCode,
              number: data.phoneNumber,
            },
          }
          await new User(user).sendVerifyCode()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          const { email } = data
          await new User({ email }).sendVerifyCode()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          const mobile = {
            region: data.regionCode,
            number: data.phoneNumber,
          }
          await new User({ mobile }).verifyCode()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })

      it('Missing fields', async () => {
        try {
          env.errCount_expected++
          const { email } = data
          await new User({ email }).verifyCode()
        } catch (err) {
          (++env.errCount_actual).should.be.equal(env.errCount_expected)
          err.should.have.property('name').and.equal('ValidationFailedError')
          err.should.have.property('statusCode').and.equal(400)
        }
      })
    })
  })

  describe('* Modify phone number', () => {
    it('Resend verify code', async () => {
      const { verifyCode } = data
      data.phoneNumber = '13800138100'
      const phoneNumber = data.regionCode + data.phoneNumber
      await User.sendVerifyCode(phoneNumber, verifyCode)
    })

    it('Change phone number', async () => {
      const id = env.userId
      const mobile = {
        region: data.regionCode,
        number: data.phoneNumber,
        verifyCode: data.verifyCode,
      }
      await new Profile({ id, mobile }).save()
    })

    it('Login by new phone number', async () => {
      const { regionCode, phoneNumber } = data
      const password = '4rfv$RFV'
      const user = {
        mobile: {
          region: regionCode,
          number: phoneNumber,
        },
      }
      const result = await new User(user).login(password)
      result.should.have.property('id')
      result.should.have.property('mobile')
      result.mobile.should.have.property('region')
      result.mobile.should.have.property('number')
    })
  })

  describe('* Modify email', () => {
    it('Resend verify email', async () => {
      data.email = 'dev@demo.com'
      const { email, verifyCode } = data
      await User.sendVerifyEmail(email, verifyCode)
    })

    it('Change email', async () => {
      const id = env.userId2
      const email = {
        email: data.email,
        verifyCode: data.verifyCode,
      }
      await new Profile({ id, email }).save()
    })

    // user 2
    it('Login by new email', async () => {
      const { email } = data
      const password = '5tgb%TGB'
      const result = await new User({ email }).login(password)
      result.should.have.property('id')
      result.should.have.property('email')
    })

    it('Resend verify email', async () => {
      data.email = 'pub@demo.com'
      const { email, verifyCode } = data
      await User.sendVerifyEmail(email, verifyCode)
    })

    it('Change email', async () => {
      const id = env.userId
      const email = {
        email: data.email,
        verifyCode: data.verifyCode,
      }
      await new Profile({ id, email }).save()
    })
    // user 1
    it('Login by new email', async () => {
      const { email } = data
      const password = '4rfv$RFV'
      const result = await new User({ email }).login(password)
      result.should.have.property('id')
      result.should.have.property('email')
    })
  })
})
