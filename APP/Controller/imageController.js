import * as imageService from '../Service/imageService.js'

export async function uploadMultipleImage(req, res) {
  try {
    const result = await imageService.uploadMultipleImage(req.body)
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: error.message })
  }
}

export async function getImageFromRefIdAndType(req, res) {
  try {
    const result = await imageService.getImageFromRefIdAndType(req.query)
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: error.message })
  }
}

export async function updateMultipleImage(req, res, net) {
  try {
    const result = await imageService.updateMultipleImage(req.body)
    res.status(200).send(result)
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: error.message })
  }
}
