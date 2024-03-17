import { Error } from 'sequelize';
import * as userDAL from '../DAL/userDAL.js';
import * as matchDAL from '../DAL/matchDAL.js';
import { v4 as uuidv4 } from 'uuid';

export function getUserDetails(email, password) {
  return userDAL.getUserDetails(email, password);
}

export async function getUserByPhone(phone) {
  return await userDAL.getUserByPhone(phone);
}

export async function getUserByEmail(email) {
  return await userDAL.getUserByEmail(email);
}

export async function register(user) {
  const userId = uuidv4();
  const phone = await getUserByPhone(user.phone);
  const email = await getUserByEmail(user.email);
  if(phone || email) { throw new Error ('Phone or Email already in use 😕');}
  return await userDAL.register(userId, user);
}

export async function getUser(userId) {
  return await userDAL.getUser(userId);
}

export async function updateProfile(userId, profile) {
  const user = await getUser(userId);
  if (!user) throw new Error('User not found');
  return await userDAL.updateProfile(userId, profile);
}

export async function updateAvatar(userId, fileData) {
  const user = await getUser(userId);
  if (!user) throw new Error('User not found');
  return await userDAL.updateAvatar(userId, fileData);
}

export async function createInterest(userInterestDetails) {
  const user_interest_id = uuidv4();
  return await userDAL.createInterest(user_interest_id, userInterestDetails);
}

export async function getInterests(userId) {
  return await userDAL.getInterests(userId);
}

export async function getInterest(userInterestId) {
  return await userDAL.getInterest(userInterestId);
}

export async function updateInterest(userInterestId, userInterestDetails) {
  const userInterest = await getInterest(userInterestId);
  if (!userInterest) throw new Error('User Interest not found');
  return await userDAL.updateInterest(userInterest, userInterestDetails);
}

export async function deleteInterest(interestIds) {
  return await userDAL.deleteInterests(interestIds);
}
export async function getUserInfoById(userId) {
  const result = await userDAL.getUserDetailsById(userId);
  return result;
}
export async function getUserInfoByEmail(email) {
  const result = await userDAL.getUserDetailsByEmail(email);
  return result;
}
export async function getUserMatchByInterest(userId) {
  const result = await userDAL.getUserMatchByInterest(userId);
  return result;
}
export async function getUserMatchByInterestPaging(userId, limit, offset) {
  const result = await userDAL.getUserMatchByInterestPaging(
    userId,
    limit,
    offset,
  );
  const list = await userDAL.getUserMatchByInterest(userId);
  return { total: list.length, limit, offset, data: result };
}

export async function getMyEvents(userId) {
  return await userDAL.getMyEvents(userId);
}

export async function getEventsByInterest(interestId) {
  return await userDAL.getEventsByInterest(interestId);
}

export async function getBlogsByInterest(interestId) {
  return await userDAL.getBlogsByInterest(interestId);
}

export async function getSuggestEvent(userId) {
  return await userDAL.getSuggestEvent(userId);
}
export async function updateUserMatchStatus(userId, dataObj) {
  const [status] = await matchDAL.getMatchStatus(dataObj.status);
  const [match] = await matchDAL.MatchCouple(userId, dataObj.user_id);

  const user_match_id = match?.user_match_id || uuidv4();
  return await matchDAL.upsertMatch(
    user_match_id,
    userId,
    dataObj.user_id,
    status.user_match_status_id,
  );
}
