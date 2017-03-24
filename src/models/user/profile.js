import 'date-utils'
import errors from '../../errors'
import { validate, getSchema, Joi as T } from '../../validator'
import { User } from './user'
import { City } from './city'

const ERRORS = {
  SaveProfileFailed: 400,
  SaveSignatureFailed: 400,
  SaveInterestsFailed: 400,
  SaveAddressFailed: 400,
  InvalidProfile: 400,
  UserNicknameDuplicated: 400,
  MobileRequired: 400,
}

errors.register(ERRORS)

export class Profile {
  constructor(data) {
    if (data) {
      if (data.id) this.id = data.id
      if (data.name) this.name = data.name
      if (data.mobile) this.mobile = data.mobile
      if (data.email) this.email = data.email
      if (data.nickname) this.nickname = data.nickname
      if (data.avatar) this.avatar = data.avatar
      if (data.birthday) this.birthday = data.birthday
      if (data.gender || data.gender === 0) this.gender = data.gender
      if (data.geo) this.geo = data.geo
      if (data.signature) this.signature = data.signature
      if (data.interests && data.interests.length > 0) this.interests = data.interests
      if (data.address) this.address = data.address
      if (data.followings || data.followings === 0) this.followings = data.followings
      if (data.followers || data.followers === 0) this.followers = data.followers
      if (data.following || data.following === false) this.following = data.following
      if (data.follower || data.follower === false) this.follower = data.follower
      if (data.friend || data.friend === false) this.friend = data.friend
    }
  }

  static SCHEMA = {
    /* eslint-disable newline-per-chained-call */
    id: T.number().integer().min(1000000000).required(),
    friendId: T.number().integer().min(1000000000),
    name: T.string().allow('', null),
    nickname: T.string().allow('', null),
    avatar: T.string().allow('', null),
    birthday: T.date().max('now').allow('', null).raw(),
    gender: T.number().integer().min(0).max(2).allow('', null),
    geo: T.object({
      country: T.object({
        name: T.string().required(),
        code: T.string().required(),
      }).required(),
      province: T.string().required(),
      city: T.object({
        name: T.string().required(),
        id: T.number().integer().min(1).allow('', null),
      }).required(),
    }).allow(null),
    signature: T.string().allow('', null),
    interests: T.array().items(T.string()).allow('', null),
    address: T.string().allow('', null),
    mobile: T.object({
      region: T.string().required(),
      number: T.string().required(),
      verifyCode: T.number().integer().min(100000).max(999999).required(),
    }).allow(null),
    email: T.object({
      email: T.string().email().required(),
      verifyCode: T.number().integer().min(100000).max(999999).required(),
    }).allow(null),
  }

  async save() {
    if (Object.keys(this).length <= 1) throw new errors.InvalidProfileError()
    const v = validate(this, getSchema(Profile.SCHEMA,
      'id', 'nickname', 'avatar', 'birthday', 'gender',
      'geo', 'signature', 'interests', 'address',
      'name', 'mobile', 'email'))
    this.gender = v.gender
    await User.checkAuth(this.id)
    try {
      const profile = await Profile.getProfile(this.id)
      this.nickname = this.nickname || profile.nickname
      this.avatar = this.avatar || profile.avatar
      this.birthday = this.birthday || profile.birthday
      this.gender = (this.gender || this.gender === 0) ? this.gender : (profile.gender || 0)
      this.geo = this.geo || profile.geo
      this.signature = this.signature !== null ? this.signature : profile.signature
      this.interests = this.interests || profile.interests
      this.address = this.address || profile.address
      this.geo = await City.getCityCode(this.geo)
      const cityCode = this.geo ? this.geo.city.id : null
      // update profile
      const query = 'SELECT "user".upsert_profile($1, $2, $3, $4, $5, $6, $7, $8, $9);'
      /* eslint-disable no-undef */
      const result = await db.query(query, [
        this.id, this.nickname, this.avatar, this.birthday, this.gender,
        cityCode, this.signature, this.interests, this.address,
      ])
      if (result.rowCount <= 0) throw new errors.SaveProfileFailedError()
      // update auth info
      // 只有没有设置过用户名用户，可以设置一次
      if (this.name) {
        if (profile.name) throw new errors.UserNameSetTwiceError()
        const queryUsername = `
          UPDATE "user".user
          SET name = $2
          WHERE
            id = $1
            AND name IS NULL
          ;`
        const resultUsername = await db.query(queryUsername, [this.id, this.name])
        if (resultUsername.rowCount <= 0) throw new errors.UserNameSetTwiceError()
      }
      if (this.mobile) {
        const queryVerifyPhone = `
          UPDATE "user".verify_code
          SET verified = true
          WHERE
            name = $1
            AND verify_code = $2
            AND action = $3
            AND NOT verified
            AND unix_now() - time <= 30 * 60
          ;`
        const params = [
          this.mobile.region + this.mobile.number,
          this.mobile.verifyCode,
          User.ACTION.SIGNUP,
        ]
        const resultVerifyPhone = await db.query(queryVerifyPhone, params)
        if (resultVerifyPhone.rowCount <= 0) throw new errors.InvalidVerifyCodeError()
        const queryPhone = `
          UPDATE "user".user
          SET
            region_code = $2,
            phone_number = $3
          WHERE id = $1
          ;`
        await db.query(queryPhone, [this.id, this.mobile.region, this.mobile.number])
        delete this.mobile.verifyCode
      }
      if (this.email) {
        const queryVerifyEmail = `
          UPDATE "user".verify_code
          SET verified = true
          WHERE
            name ILIKE $1
            AND verify_code = $2
            AND action = $3
            AND NOT verified
            AND unix_now() - time <= 30 * 60
          ;`
        const params = [this.email.email, this.email.verifyCode, User.ACTION.SIGNUP]
        const resultVerifyEmail = await db.query(queryVerifyEmail, params)
        if (resultVerifyEmail.rowCount <= 0) throw new errors.InvalidVerifyCodeError()
        const queryEmail = `
          UPDATE "user".user
          SET email = $2
          WHERE id = $1
          ;`
        await db.query(queryEmail, [this.id, this.email.email])
        delete this.email.verifyCode
      }
    } catch (err) {
      if (err.code === '23505') {
        if (err.detail.includes('(lower(name::text))')) {
          throw new errors.UserNameDuplicatedError()
        }
        if (err.detail.includes('(lower(nickname::text))')) {
          throw new errors.UserNicknameDuplicatedError()
        }
      }
      throw err
    }
    return new Profile(this)
  }

  static async getProfileLite(userId) {
    const query = `
      SELECT nickname
      FROM "user".profile
      WHERE user_id = $1
      ;`
    const result = await db.query(query, [userId])
    if (result.rowCount <= 0) return {}
    const row = result.rows[0]
    return {
      nickname: row.nickname,
    }
  }

  static async getProfile(id, friendId) {
    validate({ id, friendId }, getSchema(this.SCHEMA, 'id', 'friendId'))
    await User.checkAuth(id)
    const userId = friendId || id
    const query = `
      SELECT
        a.*,
        b.country_code,
        b.country,
        b.province,
        b.city AS city_name,
        c.followings,
        c.followers,
        d.phone_number,
        d.email,
        d.name
      FROM "user".profile AS a
      LEFT JOIN "user".user AS d
      ON a.user_id = d.id
      LEFT JOIN "user".summary AS c
      ON a.user_id = c.user_id
      LEFT JOIN "user".city AS b
      ON a.city = b.id
      WHERE
        a.user_id = $1
      ;`
    const result = await db.query(query, [userId])
    if (result.rowCount <= 0) return new Profile({ id: userId })
    const row = result.rows[0]
    const p = {
      id: userId,
      nickname: row.nickname,
      avatar: row.avatar,
      gender: row.gender || 0,
      geo: row.city_name ? {
        country: {
          name: row.country,
          code: row.country_code,
        },
        province: row.province,
        city: {
          name: row.city_name,
          id: row.city,
        },
      } : null,
      signature: row.signature,
      interests: row.interests,
      address: row.address,
      followers: row.followers || 0,
      followings: row.followings || 0,
    }
    if (!friendId || id === friendId) {
      p.birthday = row.birthday ? row.birthday.toFormat('YYYY-MM-DD') : null
      p.name = row.name
      p.mobile = {
        region: row.region_code,
        number: row.phone_number,
      }
      p.email = row.email
    } else {
      // 对方是否关注了我，和我是否关注了对方
      p.follower = false
      p.following = false
    }
    return new Profile(p)
  }

  static async checkMobile(userId) {
    const query = `
      SELECT region_code, phone_number
      FROM "user".user
      WHERE
        id = $1
        AND status = $2
      ;`
    const result = await db.query(query, [userId, User.STATUS.ACTIVE])
    if (result.rowCount <= 0) throw new errors.UserNotFoundError()
    const row = result.rows[0]
    if (!row.region_code || !row.phone_number) {
      throw new errors.MobileRequiredError()
    }
  }

  static async getThumbProfile(userId, client) {
    /* eslint-disable no-param-reassign */
    client = client || db
    const query = `
      SELECT *
      FROM "user".profile
      WHERE user_id = $1
      ;`
    const result = await client.query(query, [userId])
    if (result.rowCount <= 0) throw new errors.UserNotFoundError()
    const row = result.rows[0]
    return new Profile({
      id: userId,
      nickname: row.nickname,
      avatar: row.avatar,
    })
  }
}
