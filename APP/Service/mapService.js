import * as mapDAL from '../DAL/mapDAL.js';
import { v4 as uuidv4 } from 'uuid';

export async function getProvinces() {
  return await mapDAL.getProvinces();
}

export async function createProvince(province) {
  const province_id = uuidv4();
  return await mapDAL.createProvince(province_id, province);
}

export async function getProvince(province_id) {
  const province = await mapDAL.getProvince(province_id);
  return province;
}

export async function updateProvince(province_id, province_name) {
  const [province] = await getProvince(province_id);
  if (!province) {
    throw new Error('Province not found !!!');
  } else {
    return await mapDAL.updateProvince(province_id, province_name);
  }
}

export async function deleteProvince(province_id) {
  const [province] = await getProvince(province_id);
  if (!province) {
    throw new Error('Province not found !!!');
  } else {
    return await mapDAL.deleteProvince(province_id);
  }
}

export async function getDistricts(province_id) {
  return await mapDAL.getDistricts(province_id);
}

export async function createDistrict(province_id, district) {
  const district_id = uuidv4();
  return await mapDAL.createDistrict(district_id, province_id, district);
}

export async function getDistrict(district_id) {
  const district = await mapDAL.getDistrict(district_id);
  return district;
}

export async function updateDistrict(district_id, province_id, district_name) {
  const [district] = await getDistrict(district_id);
  if (!district) {
    throw new Error('District not found !!!');
  } else {
    return await mapDAL.updateDistrict(district_id, province_id, district_name);
  }
}

export async function deleteDistrict(district_id) {
  const [district] = await getDistrict(district_id);
  if (!district) {
    throw new Error('District not found !!!');
  } else {
    return await mapDAL.deleteDistrict(district_id);
  }
}
