import * as scheduleDAL from '../DAL/scheduleDAL.js';
import * as userDAL from '../DAL/userDAL.js';
import * as firebaseHelper from '../utility/FirebaseHelper.js';
import { v4 as uuidv4 } from 'uuid';

export async function createSchedule(dataObj) {
  const schedule_id = uuidv4();
  const [userFrom] = await userDAL.getUserInfoById(dataObj.sender_id);
  const [userTo] = await userDAL.getUserInfoById(dataObj.receiver_id);
  const titleTo = `TÍNH NĂNG BUỔI HẸN`;
  const bodyTo = `Thông báo mới: Người dùng ${userFrom.user_name} đã tạo một cuộc hẹn với bạn vào lúc ${dataObj.schedule_time},
  tại ${dataObj.location} với nội dung ${dataObj.content}. Kiểm tra lịch trình của mình ngay nhé 😊😊😊`;
  firebaseHelper.sendNotification(userTo.token_id, titleTo, bodyTo);
  const titleFrom = `TÍNH NĂNG BUỔI HẸN`;
  const bodyFrom = `Thông báo mới: Bạn đã tạo một cuộc hẹn tới ${userTo.user_name} vào lúc ${dataObj.schedule_time},
  tại ${dataObj.location} với nội dung ${dataObj.content}. Kiểm tra lịch trình của mình ngay nhé 😊😊😊`;
  firebaseHelper.sendNotification(userTo.token_id, titleFrom, bodyFrom);
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
