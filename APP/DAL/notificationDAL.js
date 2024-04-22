import { SequelizeInstance } from '../utility/DbHelper.js';

export async function getNotificationHistoryByUserId(userId) {
  const sqlQuery = `
  select * from notification n
inner join notification_status ns 
on 1=1
and n.notification_status_id = ns.notification_status_id 
where user_id = '${userId}'
order by n.created_at DESC
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function getNotificationNewStatus() {
  const sqlQuery = `
  select * from notification_status ns where notification_status = 'NEW'
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function createNotification(userId, content, statusId) {
  const sqlQuery = `
        INSERT INTO public.notification (notification_id, user_id, notification_status_id, created_at, content) 
        VALUES (gen_random_uuid(), :userId, :statusId, now(), :content)
        RETURNING *;
    `;

  try {
    const result = await SequelizeInstance.query(sqlQuery, {
      replacements: { userId, content, statusId },
      type: SequelizeInstance.QueryTypes.INSERT,
    });
    return result;
  } catch (error) {
    console.error('Error in createNotification:', error);
    throw error;
  }
}
