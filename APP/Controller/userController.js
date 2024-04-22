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
    const { email, password, token } = req.body;
    await userService.updateUserToken(email, token);
    const result = await userService.getUserDetails(email, password);
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
    res.status(404).send(error);
  }
}

export async function getUser(req, res) {
  try {
    const userId = req.loginUser.user_id;
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
    const userId = req.loginUser.user_id;
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
    const userId = req.loginUser.user_id;
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
    const userId = req.loginUser.user_id;
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
    await userService.upsertInterests(userId, interests);
    const user = await userService.getInterests(userId);
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
    const user = await userService.upsertPersonalProblems(
      userId,
      personal_problems,
    );
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
    const user = await userService.upsertFavoriteDrinks(
      userId,
      favorite_drinks,
    );
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
    if (user.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    const result = await userService.register(user);
    const userDetails = result.dataValues;
    if (userDetails) {
      const email = userDetails.email;
      firebaseHelper.registerUser(email, userDetails.password);
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
    res.status(400).send({ error: error.message });
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

export async function getProfile(req, res) {
  try {
    const userId = req.params.userId;
    const currentUserId = req.query.currentUserId;
    const result = await userService.getProfile(userId, currentUserId);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

// confirm verification email
export async function confirmVerificationEmail(req, res) {
  try {
    const email = req.query.email;
    const password = req.query.password;
    const result = await firebaseHelper.checkEmailVerified(email, password);
    res.status(200).send({ result: result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getUserBlockedByUser(req, res) {
  try {
    const loginUser = req.loginUser;
    const result = await userService.getUserBlockedByUser(loginUser.user_id);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function blockingAUser(req, res) {
  try {
    const loginUser = req.loginUser;
    console.log(`~~~~~~~~`, req.body);
    const { blocked_id } = req.body;
    console.log(blocked_id);
    const result = await userService.blockingAUser(
      loginUser.user_id,
      blocked_id,
    );
    res.status(200).send({ status: 'BLOCKED', message: 'BLOCKED THIS USER' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function unBlockingAUser(req, res) {
  try {
    const loginUser = req.loginUser;
    const { blocked_id } = req.body;
    const result = await userService.unBlockingAUser(
      loginUser.user_id,
      blocked_id,
    );
    res
      .status(200)
      .send({ status: 'UN-BLOCKED', message: 'UN-BLOCKED THIS USER' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}
