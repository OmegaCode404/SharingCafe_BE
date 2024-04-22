import * as firebaseHelper from '../utility/FirebaseHelper.js';
import * as notificationService from '../Service/notificationService.js';
export async function sendNotification(req, res, next) {
  try {
    const token =
      'dInRgZZvSU6AneLz-VEYuM:APA91bEIkIa9m4nCAOCz7KonzJYPlBe8KUl84lUMVdS-0l_wNuI6Qt0DF8KTlk7glUUojQnPPlnC7ewV4ENGfKcYrmpwCNa8YpKLYVfH6TPjbZrYMwvOK62HZflpio9g90Gomba1-u9y';
    const title = 'TESST NOTIFICATION TITLE';
    const body = 'MATCHED SUCCESSFULL';
    firebaseHelper.sendNotification(token, title, body);
    res.send({ title, body });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function getNotificationHistoryByUserId(req, res, next) {
  try {
    const loginUser = req.loginUser;
    const result = await notificationService.getNotificationHistoryByUserId(
      loginUser.user_id,
    );
    res.send(result);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}

export async function sendNotificationForSchedule(req, res) {
  try {
    const result = await notificationService.sendNotificationForSchedule(req);
    res.send({
      result: result,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
}
