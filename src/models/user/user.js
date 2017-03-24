import errors from '../../errors'
import Hashids from 'hashids'
import { validate, getSchema, Joi as T } from '../../validator'
import { Profile } from './profile'

const ERRORS = {
  SendVerifyCodeFailed: 400,
  SendVerifyEmailFailed: 400,
  UserNameDuplicated: 400,
  PhoneNumberDuplicated: 400,
  EmailDuplicated: 400,
  CreateUserFailed: 400,
  InvalidIdentification: 401,
  InvalidVerifyCode: 400,
  UserInactive: 400,
  SavePasswordFailed: 400,
  SendVerifyCodeTooOften: 400,
  UserNotFound: 404,
  UserNameSetTwice: 400,
  UserUnauthorized: 401,
  UserIdentityRequired: 400,
  InvalidUserToken: 400,
  UserTokenExpired: 400,
}

errors.register(ERRORS)

export class User {
  constructor(data) {
    if (data) {
      if (data.id) this.id = data.id
      // 用户名，全局唯一
      if (data.name) this.name = data.name
      if (data.mobile) this.mobile = data.mobile
      if (data.email) this.email = data.email
    }
  }

  static SCHEMA = {
    /* eslint-disable newline-per-chained-call */
    id: T.number().integer().min(1000000000).required(),
    regionCode: T.string().required(),
    phoneNumber: T.string().required(),
    verifyCode: T.number().integer().min(100000).max(999999).required(),
    email: T.string().email().allow('', null),
    name: T.string().allow('', null),
    password: T.string().required(),
    oldPassword: T.string().required(),
    mobile: T.object({
      region: T.string().required(),
      number: T.string().required(),
    }).allow('', null),
    token: T.string().required(),
  }

  static STATUS = {
    INACTIVE: 1,
    ACTIVE: 2,
    DISABLED: 9,
  }

  static ACTION = {
    SIGNUP: 1,
    LOGIN: 2,
    FORGOT: 3,
  }

  static async checkAuth(userId) {
    const query = `
      SELECT 1
      FROM "user".user
      WHERE
        id = $1
        AND status = $2
      ;`
    /* eslint-disable no-undef */
    const result = await db.query(query, [userId, this.STATUS.ACTIVE])
    if (result.rowCount <= 0) throw new errors.UserUnauthorizedError()
  }

  async login(password) {
    const data = {
      mobile: this.mobile,
      email: this.email,
      name: this.name,
      password,
    }
    validate(data, getSchema(User.SCHEMA, 'mobile', 'email', 'name', 'password'))
    if (this.mobile) {
      return await User.phoneLogin(this.mobile.region, this.mobile.number, password)
    } else if (this.email) {
      return await User.emailLogin(this.email, password)
    } else if (this.name) {
      return await User.userNameLogin(this.name, password)
    }
    throw new errors.UserIdentityRequiredError()
  }

  static async phoneLogin(region, number, password) {
    const query = `
      SELECT id, status
      FROM "user".user
      WHERE
        region_code = $1
        AND phone_number = $2
        AND password = crypt($3, password)
      ;`
    const result = await db.query(query, [region, number, password])
    if (result.rowCount <= 0) {
      throw new errors.InvalidIdentificationError()
    }
    const row = result.rows[0]
    if (row.status === User.STATUS.INACTIVE) throw new errors.UserInactiveError()
    const { nickname } = await Profile.getProfileLite(row.id)
    const user = {
      id: row.id,
      nickname,
      mobile: { region, number },
    }
    return new Profile(user)
  }

  static async emailLogin(email, password) {
    const query = `
      SELECT id, status
      FROM "user".user
      WHERE
        email ILIKE $1
        AND password = crypt($2, password)
      ;`
    /* eslint-disable no-undef */
    const result = await db.query(query, [email, password])
    if (result.rowCount <= 0) {
      throw new errors.InvalidIdentificationError()
    }
    const row = result.rows[0]
    if (row.status === User.STATUS.INACTIVE) throw new errors.UserInactiveError()
    const { nickname } = await Profile.getProfileLite(row.id)
    const user = {
      id: row.id,
      nickname,
      email,
    }
    return new Profile(user)
  }

  static async userNameLogin(name, password) {
    const query = `
      SELECT id, status
      FROM "user".user
      WHERE
        name ILIKE $1
        AND password = crypt($2, password)
      ;`
    /* eslint-disable no-undef */
    const result = await db.query(query, [name, password])
    if (result.rowCount <= 0) {
      throw new errors.InvalidIdentificationError()
    }
    const row = result.rows[0]
    if (row.status === User.STATUS.INACTIVE) throw new errors.UserInactiveError()
    const { nickname } = await Profile.getProfileLite(row.id)
    const user = {
      id: row.id,
      nickname,
      name,
    }
    return new Profile(user)
  }

  async changePassword(password, oldPassword) {
    const ext = {
      password: T.string().min(6),
    }
    const data = {
      id: this.id,
      password,
      oldPassword,
    }
    const v = validate(data, getSchema(User.SCHEMA, 'id', 'password', 'oldPassword'), ext)
    this.id = v.id
    const query = `
      UPDATE "user".user
      SET password = crypt($4, gen_salt('bf', 8))
      WHERE
        id = $1
        AND password = crypt($2, password)
        AND status = $3
      RETURNING id
      ;`
    const params = [this.id, oldPassword, User.STATUS.ACTIVE, password]
    const result = await db.query(query, params)
    if (result.rowCount <= 0) {
      throw new errors.InvalidIdentificationError()
    }
    return new User(this)
  }

  // 如果手機號未註冊過，發送驗證碼
  // 如果手機號註冊過但沒有激活，重新發送驗證碼
  // 如果手機號註冊並且激活過，拋錯
  // 此时phoneNumber是合并regionCode和phoneNumber
  static async sendVerifyCode(phoneNumber, verifyCode) {
    validate({ phoneNumber, verifyCode }, getSchema(this.SCHEMA, 'phoneNumber', 'verifyCode'))
    const queryUser = `
      SELECT
        unix_now() - a.time AS time_span,
        b.status
      FROM "user".verify_code AS a
      LEFT JOIN "user".user AS b
      ON a.name = (b.region_code || b.phone_number)
      WHERE
        a.name = $1
        AND action = $2
      ;`
    const resultUser = await db.query(queryUser, [phoneNumber, this.ACTION.SIGNUP])
    if (resultUser.rowCount <= 0) {
      // 不曾发送过验证码，不曾注册过
      const query = `
        INSERT INTO "user".verify_code (name, verify_code, action)
        VALUES ($1, $2, $3)
        ;`
      const result = await db.query(query, [phoneNumber, verifyCode, this.ACTION.SIGNUP])
      if (result.rowCount <= 0) throw new errors.SendVerifyCodeFailedError()
    } else {
      const row = resultUser.rows[0]
      // 手機號已註冊
      if (row.status === this.STATUS.ACTIVE) throw new errors.PhoneNumberDuplicatedError()
      // 发送验证码过于频繁
      if (row.time_span < 30) throw new errors.SendVerifyCodeTooOftenError()
      // 重發驗證碼
      const query = `
        UPDATE "user".verify_code
        SET
          verify_code = $3,
          time = unix_now(),
          verified = false
        WHERE
          name = $1
          AND action = $2
        ;`
      const result = await db.query(query, [phoneNumber, this.ACTION.SIGNUP, verifyCode])
      if (result.rowCount <= 0) throw new errors.SendVerifyCodeFailedError()
    }
  }

  // 如果邮箱未註冊過，發送验证邮件
  // 如果邮箱註冊過但沒有激活，重新發送驗證邮件
  // 如果邮箱註冊並且激活過，拋錯
  static async sendVerifyEmail(email, verifyCode) {
    validate({ email, verifyCode }, getSchema(this.SCHEMA, 'email', 'verifyCode'), ['email'])
    const queryUser = `
      SELECT
        unix_now() - a.time AS time_span,
        b.status
      FROM "user".verify_code AS a
      LEFT JOIN "user".user AS b
      ON a.name ILIKE b.email
      WHERE
        a.name ILIKE $1
        AND a.action = $2
      ;`
    const resultUser = await db.query(queryUser, [email, this.ACTION.SIGNUP])
    if (resultUser.rowCount <= 0) {
      // 未注册，发送验证码
      const query = `
        INSERT INTO "user".verify_code (name, verify_code, action)
        VALUES ($1, $2, $3)
        ;`
      const result = await db.query(query, [email, verifyCode, this.ACTION.SIGNUP])
      if (result.rowCount <= 0) throw new errors.SendVerifyEmailFailedError()
    } else {
      const row = resultUser.rows[0]
      // email已註冊
      if (row.status === this.STATUS.ACTIVE) throw new errors.EmailDuplicatedError()
      // 发送验证码过于频繁
      if (row.time_span < 30) throw new errors.SendVerifyCodeTooOftenError()
      // 重發驗證邮件
      const query = `
        UPDATE "user".verify_code
        SET
          verify_code = $3,
          time = unix_now(),
          verified = false
        WHERE
          name ILIKE $1
          AND action = $2
        ;`
      const params = [email, this.ACTION.SIGNUP, verifyCode]
      const result = await db.query(query, params)
      if (result.rowCount <= 0) throw new errors.SendVerifyEmailFailedError()
    }
  }

  async verify(verifyCode) {
    const data = {
      mobile: this.mobile,
      email: this.email,
      verifyCode,
    }
    validate(data, getSchema(User.SCHEMA, 'mobile', 'email', 'verifyCode'))
    if (this.mobile) {
      return await User.verifyPhone(this.mobile.region, this.mobile.number, verifyCode)
    } else if (this.email) {
      return await User.verifyEmail(this.email, verifyCode)
    }
    throw new errors.UserIdentityRequiredError()
  }

  // 验证手机验证码是否有效
  // 返回临时用户id
  static async verifyPhone(region, number, verifyCode) {
    // verify by code in 30 minutes
    // verify code expired after verified pass
    const query = `
      UPDATE "user".verify_code
      SET verified = true
      WHERE
        name = $1
        AND verify_code = $2
        AND action = $3
        AND NOT verified
        AND unix_now() - time <= 30 * 60
      ;`
    const params = [region + number, verifyCode, User.ACTION.SIGNUP]
    const result = await db.query(query, params)
    if (result.rowCount <= 0) throw new errors.InvalidVerifyCodeError()
    const queryUser = 'SELECT "user".upsert_user_phone($1, $2) AS id;'
    const resultUser = await db.query(queryUser, [region, number])
    if (resultUser.rowCount <= 0) throw new errors.InvalidVerifyCodeError()
    const user = {
      id: resultUser.rows[0].id,
      mobile: { region, number },
    }
    return new Profile(user)
  }

  static async verifyEmail(email, verifyCode) {
    const query = `
      UPDATE "user".verify_code
      SET verified = true
      WHERE
        name ILIKE $1
        AND verify_code = $2
        AND action = $3
        AND NOT verified
        AND unix_now() - time <= 30 * 60
      ;`
    const params = [email, verifyCode, User.ACTION.SIGNUP]
    const result = await db.query(query, params)
    if (result.rowCount <= 0) throw new errors.InvalidVerifyCodeError()
    const queryUser = 'SELECT "user".upsert_user_email($1) AS id;'
    const resultUser = await db.query(queryUser, [email])
    if (resultUser.rowCount <= 0) throw new errors.InvalidVerifyCodeError()
    const user = {
      id: resultUser.rows[0].id,
      email,
    }
    return new Profile(user)
  }

  // 设置密码，设置用户已通过验证状态
  async savePassword(password) {
    const ext = {
      password: T.string().min(6),
    }
    const data = {
      id: this.id,
      password,
    }
    const v = validate(data, getSchema(User.SCHEMA, 'id', 'password'), ext)
    this.id = v.id
    await db.transaction(async (client) => {
      const query = `
        UPDATE "user".user
        SET
          password = crypt($3, gen_salt('bf', 8)),
          status = $4
        WHERE
          id = $1
          AND status = $2
        ;`
      const params = [this.id, User.STATUS.INACTIVE, password, User.STATUS.ACTIVE]
      const result = await client.query(query, params)
      if (result.rowCount <= 0) throw new errors.SavePasswordFailedError()
    })
    return new User(this)
  }

  static async getUser(userId) {
    validate({ id: userId }, getSchema(this.SCHEMA, 'id'))
    const query = `
      SELECT name, phone_number, email
      FROM "user".user
      WHERE
        id = $1
        AND status = $2
      ;`
    const params = [userId, this.STATUS.ACTIVE]
    const result = await db.query(query, params)
    if (result.rowCount <= 0) throw new errors.UserNotFoundError()
    const row = result.rows[0]
    return new User({
      id: userId,
      name: row.name,
      mobile: {
        region: row.region_code,
        number: row.phone_number,
      },
      email: row.email,
    })
  }

  async sendVerifyCode(verifyCode) {
    const data = {
      mobile: this.mobile,
      email: this.email,
      verifyCode,
    }
    validate(data, getSchema(User.SCHEMA, 'mobile', 'email', 'verifyCode'))
    if (this.mobile) {
      await User.sendForgotVerifyCode(this.mobile.region, this.mobile.number, verifyCode)
    } else if (this.email) {
      await User.sendForgotVerifyEmail(this.email, verifyCode)
    } else {
      throw new errors.UserIdentityRequiredError()
    }
  }

  // 如果手機號未註冊過 或 註冊過但沒有激活，抛错
  static async sendForgotVerifyCode(region, number, verifyCode) {
    const phoneNumber = region + number
    const queryUser = `
      SELECT unix_now() - b.time AS time_span
      FROM  "user".user AS a
      LEFT JOIN "user".verify_code AS b
      ON
        (a.region_code || a.phone_number) = b.name
        AND b.action = $4
      WHERE
        a.region_code = $1
        AND a.phone_number = $2
        AND a.status = $3
      ;`
    /* eslint-disable no-undef */
    const resultUser = await db.query(queryUser, [
      region,
      number,
      this.STATUS.ACTIVE,
      this.ACTION.FORGOT,
    ])
    if (resultUser.rowCount <= 0) throw new errors.UserNotFoundError()
    const row = resultUser.rows[0]
    if (!row.time_span && row.time_span !== 0) {
      // 不曾发送过找回密码验证码
      const query = `
        INSERT INTO "user".verify_code (name, verify_code, action)
        VALUES ($1, $2, $3)
        ;`
      const result = await db.query(query, [phoneNumber, verifyCode, this.ACTION.FORGOT])
      if (result.rowCount <= 0) throw new errors.SendVerifyCodeFailedError()
    } else {
      // 发送验证码过于频繁
      if (row.time_span < 30) throw new errors.SendVerifyCodeTooOftenError()
      // 重發驗證碼
      const query = `
        UPDATE "user".verify_code
        SET
          verify_code = $3,
          time = unix_now(),
          verified = false
        WHERE
          name = $1
          AND action = $2
        ;`
      const result = await db.query(query, [phoneNumber, this.ACTION.FORGOT, verifyCode])
      if (result.rowCount <= 0) throw new errors.SendVerifyCodeFailedError()
    }
  }

  // 如果邮箱未註冊過 或 註冊過但沒有激活，抛错
  static async sendForgotVerifyEmail(email, verifyCode) {
    const queryUser = `
      SELECT unix_now() - b.time AS time_span
      FROM  "user".user AS a
      LEFT JOIN "user".verify_code AS b
      ON
        a.email ILIKE b.name
        AND b.action = $3
      WHERE
        a.email ILIKE $1
        AND a.status = $2
      ;`
    /* eslint-disable no-undef */
    const resultUser = await db.query(queryUser,
      [email, this.STATUS.ACTIVE, this.ACTION.FORGOT])
    if (resultUser.rowCount <= 0) throw new errors.UserNotFoundError()
    const row = resultUser.rows[0]
    if (!row.time_span && row.time_span !== 0) {
      // 不曾发送过找回密码验证码
      const query = `
        INSERT INTO "user".verify_code (name, verify_code, action)
        VALUES ($1, $2, $3)
        ;`
      const result = await db.query(query, [email, verifyCode, this.ACTION.FORGOT])
      if (result.rowCount <= 0) throw new errors.SendVerifyCodeFailedError()
    } else {
      // 发送验证码过于频繁
      if (row.time_span < 30) throw new errors.SendVerifyCodeTooOftenError()
      // 重發驗證碼
      const query = `
        UPDATE "user".verify_code
        SET
          verify_code = $3,
          time = unix_now(),
          verified = false
        WHERE
          name ILIKE $1
          AND action = $2
        ;`
      const result = await db.query(query, [email, this.ACTION.FORGOT, verifyCode])
      if (result.rowCount <= 0) throw new errors.SendVerifyCodeFailedError()
    }
  }

  async verifyCode(verifyCode) {
    const data = {
      mobile: this.mobile,
      email: this.email,
      verifyCode,
    }
    validate(data, getSchema(User.SCHEMA, 'mobile', 'email', 'verifyCode'))
    if (this.mobile) {
      return await User.verifyForgotPasswordPhone(
        this.mobile.region, this.mobile.number, verifyCode
      )
    } else if (this.email) {
      return await User.verifyForgotPasswordEmail(this.email, verifyCode)
    }
    throw new errors.UserIdentityRequiredError()
  }

  // 验证找回密码手机验证码是否有效
  // 返回用户id
  static async verifyForgotPasswordPhone(region, number, verifyCode) {
    // verify by code in 30 minutes
    // verify code expired after verified pass
    const query = `
      UPDATE "user".verify_code AS a
      SET verified = true
      FROM "user".user AS b
      WHERE
        a.name = (b.region_code || b.phone_number)
        AND a.name = $1
        AND a.verify_code = $2
        AND a.action = $3
        AND b.status = $4
        AND NOT a.verified
        AND unix_now() - a.time <= 30 * 60
      RETURNING b.id
      ;`
    const params = [region + number, verifyCode, User.ACTION.FORGOT, User.STATUS.ACTIVE]
    const result = await db.query(query, params)
    if (result.rowCount <= 0) throw new errors.InvalidVerifyCodeError()
    const hash = new Hashids(hashSalt, 8)
    // expired in 30 min
    const expire = Math.floor(Date.now() / 1000 + 30 * 60)
    const userId = result.rows[0].id
    return {
      id: userId,
      token: hash.encode(userId, expire),
    }
  }

  // 验证找回密码手机验证码是否有效
  // 返回用户id
  static async verifyForgotPasswordEmail(email, verifyCode) {
    // verify by code in 30 minutes
    // verify code expired after verified pass
    const query = `
      UPDATE "user".verify_code AS a
      SET verified = true
      FROM "user".user AS b
      WHERE
        a.name ILIKE b.email
        AND a.name ILIKE $1
        AND a.verify_code = $2
        AND a.action = $3
        AND b.status = $4
        AND NOT a.verified
        AND unix_now() - a.time <= 30 * 60
      RETURNING b.id
      ;`
    const params = [email, verifyCode, User.ACTION.FORGOT, User.STATUS.ACTIVE]
    const result = await db.query(query, params)
    if (result.rowCount <= 0) throw new errors.InvalidVerifyCodeError()
    const hash = new Hashids(hashSalt, 8)
    // expired in 30 min
    const expire = Math.floor(Date.now() / 1000 + 30 * 60)
    const userId = result.rows[0].id
    return {
      id: userId,
      token: hash.encode(userId, expire),
    }
  }

  async resetPassword(password, token) {
    const ext = {
      password: T.string().min(6),
    }
    const data = {
      id: this.id,
      password,
      token,
    }
    const v = validate(data, getSchema(User.SCHEMA, 'id', 'password', 'token'), ext)
    this.id = v.id
    // check token
    const hash = new Hashids(hashSalt, 8)
    const decoded = hash.decode(token)
    if (!decoded || decoded.length < 2) throw new errors.InvalidUserTokenError()
    const [uId, expire] = decoded
    if (!uId
      || (uId !== this.id)
      || !expire
      || (expire * 1000 - 30 * 60 * 1000) > Date.now()
    ) {
      throw new errors.InvalidUserTokenError()
    }
    if (expire * 1000 < Date.now()) throw new errors.UserTokenExpiredError()
    const query = `
      UPDATE "user".user
      SET password = crypt($3, gen_salt('bf', 8))
      WHERE
        id = $1
        AND status = $2
      RETURNING id
      ;`
    const params = [this.id, User.STATUS.ACTIVE, password]
    const result = await db.query(query, params)
    if (result.rowCount <= 0) {
      throw new errors.UserNotFoundError()
    }
    return new User(this)
  }
}
