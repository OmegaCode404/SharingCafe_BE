// admRoutes.js

import jwt from 'jsonwebtoken';
import * as userService from '../Service/userService.js';
import dotenv from 'dotenv';
import { SequelizeInstance } from '../utility/DbHelper.js';
import { v2 as cloudinary } from 'cloudinary';
import * as firebaseHelper from '../utility/FirebaseHelper.js';

dotenv.config();

// const router = express.Router();
const secret_key = process.env.SECRET_KEY;

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const result = await userService.getUserDetails(email, password);
    const userDetails = result.dataValues;
    if (userDetails) {
      const email = userDetails.email;
      const accessToken = jwt.sign({ email: email }, secret_key, {
        expiresIn: '30d',
      });
      // console.log(notificationToken)
      // const token = notificationToken;
      // const title = 'Xin chao';
      // const body = 'You have a new message!';

      // firebaseHelper.sendNotification(token, title, body)
      //   .then(response => {
      //     console.log('Notification sent successfully:', response);
      //   })
      //   .catch(error => {
      //     console.error('Error sending notification:', error);
      //   });

      res.header('Authorization', `Bearer ${accessToken}`);
      userDetails.accessToken = `Bearer ${accessToken}`;
      res.send(userDetails);
    } else {
      res.status(400).send({ message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
}

export async function getUser(req, res) {
  try {
    const userId = req.params.userId;
    const result = await userService.getUser(userId);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function createInterest(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const interestDetails = req.body;
    const interest = await userService.createInterest(interestDetails);
    res.status(200).send(interest);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function getInterests(req, res) {
  try {
    const userId = req.params.userId;
    const result = await userService.getInterests(userId);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getInterest(req, res) {
  try {
    const interestId = req.params.userInterestId;
    const result = await userService.getInterest(interestId);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function updateInterest(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const userInterestId = req.params.userInterestId;
    const userInterestDetails = req.body;
    const userInterest = await userService.updateInterest(
      userInterestId,
      userInterestDetails,
    );
    res.status(200).send(userInterest);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function deleteInterest(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const interestIds = req.body;
    const interest = await userService.deleteInterest(interestIds);
    res.status(200).send({ interest });
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function getMyEvents(req, res) {
  try {
    const userId = req.params.userId;
    const result = await userService.getMyEvents(userId);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getEventsByInterest(req, res) {
  try {
    const interestId = req.params.interestId;
    const result = await userService.getEventsByInterest(interestId);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getBlogsByInterest(req, res) {
  try {
    const interestId = req.params.interestId;
    const result = await userService.getBlogsByInterest(interestId);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getSuggestEvent(req, res) {
  try {
    const userId = req.params.userId;
    const result = await userService.getSuggestEvent(userId);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function updateProfile(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    // const fileData = req.file;
    // if (fileData === undefined) {
    //   cloudinary.uploader.destroy(fileData.filename)
    //   return res.status(400).send({ error: error.message });
    // }
    const userId = req.params.userId;
    const profile = req.body;
    const user = await userService.updateProfile(userId, profile);
    res.status(200).send(user);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}
export async function upsertInterests(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const userId = req.loginUser.user_id;
    const interests = req.body;
    const user = await userService.upsertInterests(userId, interests);
    res.status(200).send(user);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function upsertUnlikeTopics(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const userId = req.loginUser.user_id;
    const unlike_topics = req.body;
    const user = await userService.upsertUnlikeTopics(userId, unlike_topics);
    res.status(200).send(user);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function upsertPersonalProblems(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const userId = req.loginUser.user_id;
    const personal_problems = req.body;
    const user = await userService.upsertPersonalProblems(userId, personal_problems);
    res.status(200).send(user);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function upsertFavoriteDrinks(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const userId = req.loginUser.user_id;
    const favorite_drinks = req.body;
    const user = await userService.upsertFavoriteDrinks(userId, favorite_drinks);
    res.status(200).send(user);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function upsertFreeTimes(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const userId = req.loginUser.user_id;
    const free_times = req.body;
    const user = await userService.upsertFreeTimes(userId, free_times);
    res.status(200).send(user);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function updateAvatar(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const fileData = req.file;
    console.log(fileData);
    if (fileData === undefined) {
      cloudinary.uploader.destroy(fileData.filename);
      return res.status(400).send({ error: error.message });
    }
    const userId = req.params.userId;
    const user = await userService.updateAvatar(userId, fileData);
    res.status(200).send(user);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function register(req, res) {
  try {
    const user = req.body;
    const result = await userService.register(user);
    const userDetails = result.dataValues;
    if (userDetails) {
      const email = userDetails.email;
      const accessToken = jwt.sign({ email: email }, secret_key, {
        expiresIn: '30d',
      });
      res.header('Authorization', `Bearer ${accessToken}`);
      userDetails.accessToken = `Bearer ${accessToken}`;
      res.send(userDetails);
    } else {
      res.status(400).send({ message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
}

export async function getTokenId(req, res) {
  try {
    const userId = req.params.userId;
    const result = await userService.getTokenId(userId);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}