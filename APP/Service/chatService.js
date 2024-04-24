import * as chatDAL from '../DAL/chatDAL.js';
import * as userDAL from '../DAL/userDAL.js';
import * as firebaseHelper from '../utility/FirebaseHelper.js';
import { v4 as uuidv4 } from 'uuid';

export async function saveMessage(messageData) {
  const messageId = uuidv4();
  const [block] = await userDAL.getBlockCouple(messageData);
  if (block) {
    return null; // If blocked, return null
  }
  await chatDAL.saveMessage(messageId, messageData);
  const { from, to, messageContent } = messageData;
  const [userFrom] = await userDAL.getUserInfoById(from);
  const [userTo] = await userDAL.getUserInfoById(to);

  const title = `TÍNH NĂNG TRÒ CHUYỆN`;
  const body = `${messageContent} bởi ${userFrom.user_name}`;
  firebaseHelper.sendNotification(userTo.token_id, title, body);
  return messageId;
}
export async function getChatHistory(userIdFrom, userIdTo, limit, offset) {
  return await chatDAL.getChatHistory(userIdFrom, userIdTo, limit, offset);
}

export async function getMessage(messageId) {
  return await chatDAL.getMessage(messageId);
}
