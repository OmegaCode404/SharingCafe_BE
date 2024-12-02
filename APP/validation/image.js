import Joi from 'joi'
import { page, size, text, number } from '../common/joi.js'

export const getImageFromRefIdAndType = Joi.object({
  offset: page,
  limit: size,
  ref_id: text,
  type: number,
}).unknown(true)
