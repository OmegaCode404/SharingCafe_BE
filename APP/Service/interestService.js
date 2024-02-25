import * as interestDAL from '../DAL/interestDAL.js';
import { v4 as uuidv4 } from 'uuid';
export async function getInterests() {
  return await interestDAL.getInterests();
}
export async function getInterest(interestId) {
  return await interestDAL.getInterest(interestId);
}

export async function createInterest(interestDetails) {
  interestDetails.interest_id = uuidv4();
  return await interestDAL.createInterest(interestDetails);
}

export async function updateInterest(interestId, interestDetails) {
  const interest = await getInterest(interestId);
  if (!interest) throw new Error('Interest Not Found !!!');
  return await interestDAL.updateInterest(interest, interestDetails);
}
export async function deleteInterest(interestIds) {
  return await interestDAL.deleteInterests(interestIds);
}
