import { Interest, SequelizeInstance } from '../utility/DbHelper.js';

export async function getInterests() {
  // const interests = await Interest.findAll();
  // return interests;
  const sqlQuery = `
  select 
    i.* , count(b.interest_id) as num_of_blog 
  from
    interest i
  full join blog b  
    on b.interest_id = i.interest_id
  group by i.interest_id
  order by num_of_blog desc 
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}
export async function getInterest(interestId) {
  const interest = await Interest.findOne({
    where: { interest_id: interestId },
  });
  return interest;
}

export async function createInterest(interestDetails) {
  const interests = await Interest.create(interestDetails);
  return interests;
}
export async function updateInterest(interest, interestDetail) {
  return await interest.update({
    name: interestDetail.name,
    parent_interest_id: interestDetail.parent_interest_id,
    image: interestDetail.image
  });
}
export async function deleteInterests(interestIds) {
  const deletedInterest = await Interest.destroy({
    where: { interest_id: interestIds },
  });
  return deletedInterest;
}

export async function getParentInterests() {
  const sqlQuery = `
  select 
 	i.interest_id, i."name" ,i.image
 from
 	interest i
 where i.parent_interest_id is null
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function getToppick() {
  const sqlQuery = `
  select 
 	  i.interest_id, i."name", i.image, count(ui.interest_id) as top_pick
  from
 	  user_interest ui
  join
 	  interest i 
 	  on ui.interest_id = i.interest_id
  group by i."name", i.image, i.interest_id 
  order by top_pick desc
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function updateImage(interestId, fileData) {
  return await Interest.update({
    image: fileData?.path
  }, {
    where: {interest_id: interestId}
  });
}