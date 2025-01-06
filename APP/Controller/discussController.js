import * as discussService from '../Service/discussService.js'

export async function createDiscuss(req, res) {
  try {
    const result = await discussService.createDiscuss(req.body, req.user)
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: error.message })
  }
}
