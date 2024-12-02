import Joi from 'joi'

export const page = Joi.number().integer().min(0).default(1)

export const size = Joi.number().integer().min(0).default(10)

export const search = Joi.string().allow('', null).default(null)

export const phone = Joi.string().min(6).trim()

export const fullName = Joi.string().min(2).trim()

export const code = Joi.string().min(3)

export const password = Joi.string().min(5).max(20).trim()

export const email = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ['com', 'net'] },
})

export const id = Joi.string().length(36)

export const boolean = Joi.boolean()

export const text = Joi.string().trim().allow('', null)

export const textRequired = Joi.string().trim().required()

export const number = Joi.number().allow('', null)

export const numberRequired = Joi.number().required()
