import * as chatDAL from '../DAL/chatDAL.js';
import * as userDAL from '../DAL/userDAL.js';
import * as scheduleDAL from '../DAL/scheduleDAL.js';
import * as firebaseHelper from '../utility/FirebaseHelper.js';
import { v4 as uuidv4 } from 'uuid';

export async function saveMessage(messageData) {
  const messageId = uuidv4();
  const { from, to, message } = messageData;
  const [userFrom] = await userDAL.getUserInfoById(from);
  const [userTo] = await userDAL.getUserInfoById(to);
  const title = `${userFrom.user_name} đã gửi tin nhắn cho bạn!`;
  const body = `${message}`;
  if (userTo?.token_id)
    firebaseHelper.sendNotification(userTo.token_id, title, body);
  await chatDAL.saveMessage(messageId, messageData);
  return messageId;
}
export async function getChatHistory(userIdFrom, userIdTo, limit, offset) {
  return await chatDAL.getChatHistory(userIdFrom, userIdTo, limit, offset);
}

export async function getMessage(messageId) {
  return await chatDAL.getMessage(messageId);
}
