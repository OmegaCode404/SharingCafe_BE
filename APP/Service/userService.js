import * as userDAL from '../DAL/userDAL.js';
export function getUserDetails(email, password) {
  return userDAL.getUserDetails(email, password);
}
