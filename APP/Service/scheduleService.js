import * as scheduleDAL from '../DAL/scheduleDAL.js';
import { v4 as uuidv4 } from 'uuid';

export async function createSchedule(dataObj) {
  const schedule_id = uuidv4();
  return await scheduleDAL.createSchedule(schedule_id, dataObj);
}
export async function getScheduleBetweenUsers(userId, anotherUserId) {
  return await scheduleDAL.getScheduleBetweenUsers(userId, anotherUserId);
}

export async function changeStatus(dataObj) {
  return await scheduleDAL.changeStatus(dataObj);
}
