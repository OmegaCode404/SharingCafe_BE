import { Interest, SequelizeInstance } from '../utility/DbHelper.js';

export async function getInterests() {
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
    image: interestDetail.image,
    is_available: interestDetail.is_available,
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
	i.interest_id, i."name", i.image , COUNT(b.blog_id) AS blog_count
  from interest i
  full join blog b 
  on b.interest_id = i.interest_id 
  where i.parent_interest_id is null and i.is_available = true
  group by i.interest_id
  order by blog_count desc 
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
  where i.is_available = true
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
  return await Interest.update(
    {
      image: fileData?.path,
    },
    {
      where: { interest_id: interestId },
    },
  );
}
export async function countBlogByInterest() {
  const sqlQuery = `
  WITH RECURSIVE interest_hierarchy AS (
  SELECT interest_id, parent_interest_id
  FROM interest
  UNION ALL
  SELECT i.interest_id, i.parent_interest_id
  FROM interest i
  INNER JOIN interest_hierarchy ih ON i.interest_id = ih.parent_interest_id
)
SELECT ih.interest_id, ih.parent_interest_id,COUNT(b.blog_id) AS blog_count
FROM blog b
INNER JOIN interest_hierarchy ih ON b.interest_id = ih.interest_id
GROUP BY ih.interest_id, ih.parent_interest_id;`;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}
