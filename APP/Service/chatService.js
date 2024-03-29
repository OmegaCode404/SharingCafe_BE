import * as chatDAL from '../DAL/chatDAL.js';
import { v4 as uuidv4 } from 'uuid';

export async function viewMessage(dataObj) {
  return await chatDAL.viewMessage(dataObj);
}

export async function saveMessage(messageData) {
  const messageId = uuidv4();
  const message = await chatDAL.saveMessage(messageId, messageData);
  return messageId;
}
export async function getChatHistory(userIdFrom, userIdTo, limit, offset) {
  return await chatDAL.getChatHistory(userIdFrom, userIdTo, limit, offset);
}

export async function getMessage(messageId) {
  return await chatDAL.getMessage(messageId);
}
