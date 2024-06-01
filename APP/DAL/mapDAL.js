import { District, Province, SequelizeInstance } from '../utility/DbHelper.js';

export async function getProvinces() {
  const sqlQuery = `
    select * from province p 
    `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function getProvince(province_id) {
  const sqlQuery = `
    select * from province p
    where p.province_id = '${province_id}'
    `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function createProvince(province_id, province) {
  return await Province.create({
    province_id: province_id,
    province: province,
  });
}

export async function updateProvince(province_id, province_name) {
  return await Province.update(
    {
      province: province_name,
    },
    {
      where: { province_id: province_id },
    },
  );
}

export async function deleteProvince(province_id) {
  const deletedProvince = await Province.destroy({
    where: { province_id: province_id },
  });
  return deletedProvince;
}

export async function getDistricts(province_id) {
  let sqlQuery = `
  select
	  d.district_id,
	  p.province,
	  d.district 
  from district d 
  left join province p 
  on p.province_id = d.province_id 
  `;
  if (province_id) {
    sqlQuery += ` where p.province_id = '${province_id}'`;
  }
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function createDistrict(district_id, province_id, district) {
  return await District.create({
    district_id: district_id,
    province_id: province_id,
    district: district,
  });
}

export async function getDistrict(district_id) {
  const sqlQuery = `
    select * from district d
    where d.district_id = '${district_id}'
    `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function updateDistrict(district_id, province_id, district_name) {
  return await District.update(
    {
      province_id: province_id,
      district: district_name,
    },
    {
      where: { district_id: district_id },
    },
  );
}

export async function deleteDistrict(district_id){
  const deletedDistrict = await District.destroy({
    where: { district_id: district_id },
  });
  return deletedDistrict;
}