import { SequelizeInstance } from '../utility/DbHelper.js';
import * as mapService from '../Service/mapService.js';

export async function getProvinces(req, res) {
  try {
    const result = await mapService.getProvinces();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function createProvince(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const province = req.query.province;
    const result = await mapService.createProvince(province);
    res.status(200).send(result);
    t.commit();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
    t.rollback();
  }
}

export async function updateProvince(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const province_id = req.query.province_id;
    const province_name = req.query.province;
    const result = await mapService.updateProvince(province_id, province_name);
    res.status(200).send(result);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function deleteProvince(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const province_id = req.query.province_id;
    const result = await mapService.deleteProvince(province_id);
    res.status(200).send({ result });
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function getDistricts(req, res) {
  try {
    const province_id = req.query.province_id;
    const result = await mapService.getDistricts(province_id);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function createDistrict(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const district = req.query.district;
    const province_id = req.query.province_id;
    const result = await mapService.createDistrict(province_id, district);
    res.status(200).send(result);
    t.commit();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
    t.rollback();
  }
}

export async function updateDistrict(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const district_id = req.query.district_id;
    const province_id = req.query.province_id;
    const district_name = req.query.district;
    const result = await mapService.updateDistrict(district_id, province_id, district_name);
    res.status(200).send(result);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function deleteDistrict(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const district_id = req.query.district_id;
    const result = await mapService.deleteDistrict(district_id);
    res.status(200).send({ result });
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}