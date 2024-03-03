import * as adminDAL from '../DAL/adminDAL.js';
// DAL -> Data Access Layer
export async function getAdmDetails(email, password) {
  return await adminDAL.getAdmDetails(email, password);
}
export async function getStatics() {
  return await adminDAL.getStatics();
}
export async function getUsers() {
  return await adminDAL.getUsers();
}
