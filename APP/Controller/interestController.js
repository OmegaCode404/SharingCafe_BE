import express from 'express';
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
