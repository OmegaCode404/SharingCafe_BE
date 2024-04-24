import * as scheduleDAL from '../DAL/scheduleDAL.js';
import * as firebaseHelper from '../utility/FirebaseHelper.js';
import { v4 as uuidv4 } from 'uuid';

export async function createSchedule(dataObj) {
  const schedule_id = uuidv4();
  return await scheduleDAL.createSchedule(schedule_id, dataObj);
}
export async function getScheduleBetweenUsers(userId, anotherUserId) {
  return await scheduleDAL.getScheduleBetweenUsers(userId, anotherUserId);
}

export async function changeStatus(dataObj) {
  const [schedule] = await scheduleDAL.getScheduleId(dataObj.schedule_id);
  // const tile = `SCHEDULE HAS BEEN UPDATED `;

  const tile = `LỊCH TRÌNH ĐÃ ĐƯỢC CẬP NHẬT `;
  firebaseHelper.sendNotification(
    schedule.user_from_token,
    tile,
    `KÍNH GỬI ${schedule.user_from}` + schedule.message,
  );
  firebaseHelper.sendNotification(
    schedule.user_to_token,
    tile,
    `KÍNH GỬI ${schedule.user_to}` + schedule.message,
  );
  return await scheduleDAL.changeStatus(dataObj);
}

export async function getScheduleHistoryByUserId(dataObj) {
  return await scheduleDAL.getScheduleHistoryByUserId(dataObj);
}

export async function createRating(loginUser, dataObj) {
  const rating_id = uuidv4();
  return await scheduleDAL.createRating(rating_id, loginUser, dataObj);
}

export async function getScheduleRating(scheduleId) {
  return await scheduleDAL.getScheduleRating(scheduleId);
}
