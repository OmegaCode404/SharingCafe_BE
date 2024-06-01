import { SequelizeInstance } from '../utility/DbHelper.js';
import * as scheduleService from '../Service/scheduleService.js';
import { getMiniUser } from '../Service/userService.js';
import * as firebaseHelper from '../utility/FirebaseHelper.js';
export async function createSchedule(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const dataObj = req.body;
    const result = await scheduleService.createSchedule(dataObj);
    res.status(200).send(result);
    t.commit();
  } catch (error) {
    const userProfile = await getMiniUser(dataObj.receiver_id);
    console.log(userProfile);
    firebaseHelper.sendNotification(
      userProfile[0].token_id,
      'Bạn có lịch hẹn mới',
      'Vui lòng kiểm tra hộp tin nhắn',
    );

    t.rollback();
  }
}
export async function getScheduleBetweenUsers(req, res) {
  try {
    const loginUser = req.loginUser;
    const anotherUserId = req.params.anotherUserId;
    const result = await scheduleService.getScheduleBetweenUsers(
      loginUser.user_id,
      anotherUserId,
    );
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function changeStatus(req, res) {
  try {
    const dataObj = req.query;
    const result = await scheduleService.changeStatus(dataObj);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getScheduleHistoryByUserId(req, res) {
  try {
    const loginUser = req.loginUser;
    const result = await scheduleService.getScheduleHistoryByUserId(
      loginUser.user_id,
    );
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function createRating(req, res) {
  try {
    const loginUser = req.loginUser.user_id;
    const dataObj = req.body;
    const result = await scheduleService.createRating(loginUser, dataObj);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getScheduleRating(req, res) {
  try {
    const scheduleId = req.query.schedule_id;
    console.log(scheduleId);
    const result = await scheduleService.getScheduleRating(scheduleId);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}
