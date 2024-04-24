import { Schedule, SequelizeInstance, Rating } from '../utility/DbHelper.js';

export async function createSchedule(schedule_id, dataObj) {
  return await Schedule.create({
    schedule_id: schedule_id,
    content: dataObj.content,
    location: dataObj.location,
    schedule_time: dataObj.date,
    sender_id: dataObj.sender_id,
    receiver_id: dataObj.receiver_id,
  });
}

export async function getScheduleBetweenUsers(userId, anotherUserId) {
  const sqlQuery = `
select
	schedule_id,
	"content",
	schedule_time,
	is_accept,
	created_at,
	"location",
	sender_id,
	receiver_id
from
	public.schedule
where
	1 = 0
	or (
      sender_id = '${userId}'
	  and receiver_id = '${anotherUserId}'
    )
	or (
      sender_id = '${anotherUserId}'
	  and receiver_id = '${userId}'
    )
order by
	schedule_time desc
  `;

  const userDetails = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });

  return userDetails;
}

export async function changeStatus(dataObj) {
  console.log(dataObj);
  return await Schedule.update(
    { is_accept: dataObj.is_accept },
    { where: { schedule_id: dataObj.schedule_id } },
  );
}

export async function getScheduleHistoryByUserId(userId) {
  const sqlQuery = `
  SELECT
  s.schedule_id,
  s."content",
  s.schedule_time,
  s."location",
  s.sender_id, 
  u2.user_name as sender,
  u2.profile_avatar as sender_avatar,
  s.receiver_id ,
  u3.user_name as receiver,
  u3.profile_avatar as receiver_avatar,
  s.is_accept,
  s.created_at,
  jsonb_agg(
      jsonb_build_object(
      'rating_id', r.rating_id ,
      'user_id', u.user_id ,
      'user_name', u.user_name ,
      'content', r."content"  ,
      'rating', r.rating
      ) 
    ) as rating
  FROM
    schedule s
  LEFT JOIN
    rating r 
    on r.schedule_id = s.schedule_id
  LEFT JOIN 
    "user" u 
    on r.user_id = u.user_id
  LEFT JOIN
    "user" u2
    on s.sender_id  = u2.user_id 
  LEFT JOIN 
    "user" u3 
    on s.receiver_id = u3.user_id 
  WHERE
    sender_id = '${userId}'
    OR receiver_id = '${userId}'
    AND schedule_time < NOW()
  GROUP BY 
    s.schedule_id, 
    s."content", 
    s.schedule_time, 
    s.is_accept,
    s.created_at,
    s."location",
    s.sender_id, 
    u2.user_name,
    u2.profile_avatar,
    s.receiver_id ,
    u3.user_name,
    u3.profile_avatar
    ORDER BY
      schedule_time desc
    `;
  const userDetails = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return userDetails;
}
export async function getScheduleId(scheduleId) {
  const sqlQuery = `
SELECT
    u.user_name as user_from,
    u.token_id as user_from_token,
    u2.user_name as user_to,
    u2.token_id as user_token_token,
    'The schedule ' || s.content || ' occurring at ' || s.schedule_time || ' has been updated as ' || now()  as message
FROM
    public.schedule s
inner join public.user u
on u.user_id = s.sender_id
inner join public.user u2
on u2.user_id = s.receiver_id
WHERE
    schedule_id = '${scheduleId}'
    `;

  const userDetails = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return userDetails;
}

export async function getScheduleById(scheduleId) {
  const sqlQuery = `
  SELECT
  u.user_name as user_from,
  u.token_id as user_from_token,
  u2.user_name as user_to,
  u2.token_id as user_token_token,
  'The schedule ' || s.content || ' occurring at ' || s.schedule_time || ' has been updated as ' || now()  as message
FROM
  public.schedule s
inner join public.user u
on u.user_id = s.sender_id
inner join public.user u2
on u2.user_id = s.receiver_id
WHERE
  schedule_id = '${scheduleId}'
  `;

  const userDetails = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });

  return userDetails;
}

export async function createRating(rating_id, loginUser, dataObj) {
  return await Rating.create({
    schedule_id: dataObj.schedule_id,
    content: dataObj.content,
    rating_id: rating_id,
    user_id: loginUser,
    rating: dataObj.rating,
  });
}

export async function getScheduleRating(scheduleId) {
  const sqlQuery = `
  SELECT
  	s.schedule_id,
	s."content",
	s.schedule_time,
	s.is_accept,
	s.created_at,
	s."location",
	jsonb_agg(
  			jsonb_build_object(
  			'rating_id', r.rating_id ,
  			'user_id', u.user_id ,
  			'user_name', u.user_name ,
  			'profile_avatar', u.profile_avatar ,
  			'content', r."content"  ,
  			'rating', r.rating
  			) 
  		) as rating
FROM
   schedule s
FULL JOIN
	rating r 
	on r.schedule_id = s.schedule_id
LEFT JOIN 
	"user" u 
	on r.user_id = u.user_id 
WHERE
     s.schedule_id = '${scheduleId}'
GROUP BY 
 	s.schedule_id, 
 	s."content", 
 	s.schedule_time, 
 	s.is_accept,
	s.created_at,
	s."location"
  `;

  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });

  return result;
}

export async function canceledSchedule(userId, blockedId) {
  const sqlQuery = `
    UPDATE public.schedule
    SET is_accept = false
    WHERE 
      ((sender_id = :userId AND receiver_id = :blockedId) OR (sender_id = :blockedId AND receiver_id = :userId))
      AND schedule_time >= NOW();
  `;

  const userDetails = await SequelizeInstance.query(sqlQuery, {
    replacements: { userId, blockedId },
    type: SequelizeInstance.QueryTypes.UPDATE,
    raw: true,
  });

  return userDetails;
}
