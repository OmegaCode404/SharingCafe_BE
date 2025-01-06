import { Discuss } from '../utility/DbHelper.js'

export async function createDiscuss(discuss) {
  return await Discuss.create(discuss)
}
