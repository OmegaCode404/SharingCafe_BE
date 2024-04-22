import { Message, SequelizeInstance } from '../utility/DbHelper.js';

export async function saveMessage(messageId, messageData) {
  const { from, to, message } = messageData;
  const sqlQuery = `
    INSERT INTO public.message (message_id, sender_id, receiver_id, "content", created_at, is_read)
    SELECT '${messageId}', '${from}', '${to}', '${message}', now(), false
    WHERE NOT EXISTS (
      SELECT 1
      FROM public.user_block
      WHERE (blocker_id = '${from}' AND blocked_id = '${to}')
          OR (blocker_id = '${to}' AND blocked_id = '${from}')
);
    `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.INSERT,
    raw: true,
  });
  return result;
}
export async function getChatHistory(userIdFrom, userIdTo, limit, offset) {
  const sqlQuery = `
SELECT 
  m.message_id,
  m.sender_id,
  sender.user_name AS sender_name,
  sender.profile_avatar AS sender_avatar,
  m.receiver_id,
  receiver.user_name AS receiver_name,
  receiver.profile_avatar AS receiver_avatar,
  m.content,
  m.created_at
FROM 
  public.message m
INNER JOIN 
  public."user" sender ON sender.user_id = m.sender_id
INNER JOIN 
  public."user" receiver ON receiver.user_id = m.receiver_id
WHERE 
  (m.sender_id = '${userIdFrom}' OR m.receiver_id = '${userIdFrom}')
  AND (m.sender_id = '${userIdTo}' OR m.receiver_id = '${userIdTo}')
ORDER BY 
  m.created_at
LIMIT ${limit}
OFFSET ${offset};
    `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}
export async function getMessage(messageId) {
  const sqlQuery = `
SELECT 
  message_id
  , sender_id
  , sender.user_name as sender_name
  , sender.profile_avatar as sender_avatar
  , receiver_id
  , receiver.user_name as receiver_name
  , receiver.profile_avatar as receiver_avatar
  , "content"
  , created_at
FROM 
  public.message m
inner join 
  public."user" sender
  on 1 = 1
    and sender.user_id = m.sender_id
inner join 
  public."user" receiver
  on 1 = 1
   and receiver.user_id = m.receiver_id
    WHERE 1 = 1
    and message_id = '${messageId}'
    `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}
