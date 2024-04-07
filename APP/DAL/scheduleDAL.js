import { Schedule, SequelizeInstance } from '../utility/DbHelper.js';

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
