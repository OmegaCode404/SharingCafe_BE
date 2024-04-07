import { SequelizeInstance } from '../utility/DbHelper.js';
import * as scheduleService from '../Service/scheduleService.js';
export async function createSchedule(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const dataObj = req.body;
    const result = await scheduleService.createSchedule(dataObj);
    res.status(200).send(result);
    t.commit();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
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
