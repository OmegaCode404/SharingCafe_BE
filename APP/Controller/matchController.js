import * as userService from '../Service/userService.js';
import { SequelizeInstance } from '../utility/DbHelper.js';
export async function getUserMatchByInterest(req, res, next) {
  try {
    const loginUser = req.loginUser;
    const limit = req.query.limit || null;
    const offset = req.query.offset || null;
    let result = null;
    if (limit !== null && offset !== null)
      result = userService.getUserMatchByInterestPaging(
        loginUser.user_id,
        limit,
        offset,
      );
    else result = userService.getUserMatchByInterest(loginUser.user_id);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}
export async function updateUserMatchStatus(req, res, next) {
  const t = await SequelizeInstance.transaction();
  try {
    const loginUser = req.loginUser;
    const dataObj = req.body;
    const [result] = await userService.updateUserMatchStatus(
      loginUser.user_id,
      dataObj,
    );
    await t.commit();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    await t.rollback();
    res.status(500).send({ error: error.message });
  }
}
