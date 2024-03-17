import * as adminDAL from '../DAL/adminDAL.js';
// DAL -> Data Access Layer
export async function getAdmDetails(email, password) {
  return await adminDAL.getAdmDetails(email, password);
}
export async function getStatics() {
  return await adminDAL.getStatics();
}

export async function getUser(userId) {
  return await adminDAL.getUser(userId);
}

export async function getUsers() {
  return await adminDAL.getUsers();
}

export async function updateUserStatus(userId, userDetails) {
  const user = adminDAL.getUser(userId);
  if (!user) throw new Error('This user does not exist!!');
  return await adminDAL.updateUserStatus(userId, userDetails);
}
