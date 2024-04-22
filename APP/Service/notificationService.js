import * as notificationDAL from '../DAL/notificationDAL.js';
import * as scheduleDAL from '../DAL/scheduleDAL.js';
import * as firebaseHelper from '../utility/FirebaseHelper.js';

export async function getNotificationHistoryByUserId(userId) {
  return await notificationDAL.getNotificationHistoryByUserId(userId);
}

export async function sendNotificationForSchedule(req) {
  try {
    const { scheduleId } = req.query;
    const schedule = await scheduleDAL.getScheduleById(scheduleId);
    console.log(schedule);
    const senderToken = schedule[0].user_from_token;
    const receiverToken = schedule[0].user_token_token;
    const message = schedule[0].message;
    const notification = {
      title: 'Thông báo lịch hẹn',
      body: message,
    };

    firebaseHelper.sendNotification(
      receiverToken,
      notification.title,
      notification.body,
    );
    firebaseHelper.sendNotification(
      senderToken,
      notification.title,
      notification.body,
    );
  } catch (error) {
    console.error(error);
    return error;
  }
  return true;
}
