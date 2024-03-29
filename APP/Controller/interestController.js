import * as interestService from '../Service/interestService.js';
import { SequelizeInstance } from '../utility/DbHelper.js';

export async function getInterests(req, res) {
  try {
    const result = await interestService.getInterests();
    console.log(result);
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
}
export async function getInterest(req, res) {
  try {
    const interestId = req.params.interestId;
    const result = await interestService.getInterest(interestId);
    res.status(200).send(result ? result : 'No interest found !!!');
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
}

export async function createInterest(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const interestDetails = req.body;
    const interest = await interestService.createInterest(interestDetails);
    res.status(200).send(interest);
    await t.commit();
  } catch (e) {
    await t.rollback();
    console.log(e);
    res.status(404).send(e);
  }
}

export async function updateInterest(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const interestId = req.params.interestId;
    const interestDetails = req.body;
    const interest = await interestService.updateInterest(
      interestId,
      interestDetails,
    );
    res.status(200).send(interest);
    await t.commit();
  } catch (e) {
    await t.rollback();
    console.log(e);
    res.status(404).send(e);
  }
}

export async function deleteInterest(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const interestIds = req.body;
    const interest = await interestService.deleteInterest(interestIds);
    res.status(200).send({ interest });
    await t.commit();
  } catch (e) {
    await t.rollback();
    console.log(e);
    res.status(404).send(e);
  }
}

export async function getToppick(req, res) {
  try {
    const result = await interestService.getToppick();
    console.log(result);
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.status(404).send(e);
  }
}

export async function getParentInterests(req, res) {
  try {
    const result = await interestService.getParentInterests();
    console.log(result);
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.sta;
  }
}

export async function countBlogByInterest(req, res) {
  try {
    const result = await interestService.countBlogByInterest();
    console.log(result);
    res.status(200).send(result);
  } catch (e) {
    console.log(e);
    res.sta;
  }
}

export async function updateImage(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const fileData = req.file;
    console.log(fileData);
    if (fileData === undefined) {
      cloudinary.uploader.destroy(fileData.filename);
      return res.status(400).send({ error: error.message });
    }
    const interestId = req.params.interestId;
    const user = await interestService.updateImage(interestId, fileData);
    res.status(200).send(user);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}
