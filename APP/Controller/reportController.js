import { SequelizeInstance } from '../utility/DbHelper.js';
import * as reportService from '../Service/reportService.js';

export async function getAllReportStatus(req, res) {
  try {
    const page = req.query.page;
    const result = await reportService.getAllReportStatus(page);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getAllBlogReport(req, res) {
  try {
    const page = req.query.page;
    const result = await reportService.getAllBlogReport(page);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function createBlogReport(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const dataObj = req.body;
    const result = await reportService.createBlogReport(dataObj);
    res.status(200).send(result);
    t.commit();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
    t.rollback();
  }
}

export async function deleteBlogReport(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const reportId = req.params.reportId;
    const report = await reportService.deleteBlogReport(reportId);
    res.status(200).send({ report });
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function getAllEventReport(req, res) {
  try {
    const page = req.query.page;
    const result = await reportService.getAllEventReport(page);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function createEventReport(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const dataObj = req.body;
    const result = await reportService.createEventReport(dataObj);
    res.status(200).send(result);
    t.commit();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
    t.rollback();
  }
}

export async function deleteEventReport(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const reportId = req.params.reportId;
    const report = await reportService.deleteEventReport(reportId);
    res.status(200).send({ report });
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function getAllUserReport(req, res) {
  try {
    const page = req.query.page;
    const result = await reportService.getAllUserReport(page);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function createUserReport(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const dataObj = req.body;
    const result = await reportService.createUserReport(dataObj);
    res.status(200).send(result);
    t.commit();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
    t.rollback();
  }
}

export async function deleteUserReport(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const reportId = req.params.reportId;
    const report = await reportService.deleteUserReport(reportId);
    res.status(200).send({ report });
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}