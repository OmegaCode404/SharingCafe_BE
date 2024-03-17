import { Message, SequelizeInstance } from '../utility/DbHelper.js';

export async function viewMessage(dataObj) {
  const sender = dataObj.sender_id;
  const receiver = dataObj.receiver_id;
  const sqlQuery = `
    
    `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function saveMessage(messageData, is_read) {
  const { sender_id, receiver_id, content } = messageData;
  const created_at = new Date();

  const savedMessage = await Message.create({
    sender_id,
    receiver_id,
    content,
    created_at,
    is_read,
  });

  return savedMessage;
}
