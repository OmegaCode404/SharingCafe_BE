import * as scheduleDAL from '../DAL/scheduleDAL.js';
import * as userDAL from '../DAL/userDAL.js';
import * as firebaseHelper from '../utility/FirebaseHelper.js';
import * as notificationDAL from '../DAL/notificationDAL.js';
import { v4 as uuidv4 } from 'uuid';

export async function createSchedule(dataObj) {
  const schedule_id = uuidv4();
  const [userFrom] = await userDAL.getUserInfoById(dataObj.sender_id);
  const [userTo] = await userDAL.getUserInfoById(dataObj.receiver_id);
  const checkSchedule = await scheduleDAL.checkSchedule(dataObj);
  if (checkSchedule) {
    const titleTo = `Bạn có lịch hẹn mới`;
    const bodyTo = `${userFrom.user_name} đã tạo một cuộc hẹn với bạn vào lúc ${dataObj.date}`;
    firebaseHelper.sendNotification(userTo.token_id, titleTo, bodyTo);
    const [newNotificationStatus] =
      await notificationDAL.getNotificationNewStatus();
    await notificationDAL.createNotification(
      dataObj.receiver_id,
      bodyTo,
      newNotificationStatus.notification_status_id,
    );
    return await scheduleDAL.createSchedule(schedule_id, dataObj);
  } else {
    return {'error': 'Cuộc hẹn bạn tạo có thể đã trùng với cuộc hẹn khác'};
  }
}
export async function getScheduleBetweenUsers(userId, anotherUserId) {
  return await scheduleDAL.getScheduleBetweenUsers(userId, anotherUserId);
}

export async function checkSchedule(dataObj) {
  return await scheduleDAL.checkSchedule(dataObj);
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
  const [schedule] = await scheduleDAL.getScheduleId(dataObj.schedule_id);
  const tile = `ĐÁNH GIÁ LỊCH TRÌNH`;
  const body = `Cuộc hẹn với nội dung ${schedule.content} vừa được đánh giá`;
  firebaseHelper.sendNotification(schedule.user_from_token, tile, body);
  firebaseHelper.sendNotification(schedule.user_to_token, tile, body);
  return await scheduleDAL.createRating(rating_id, loginUser, dataObj);
}

export async function getScheduleRating(scheduleId) {
  return await scheduleDAL.getScheduleRating(scheduleId);
}
