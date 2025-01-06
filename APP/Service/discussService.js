import * as Discuss from '../DAL/discussDAL.js'

export async function createDiscuss(discuss, user) {
  discuss.created_by = user.user_id
  return await Discuss.createDiscuss(discuss)
}
