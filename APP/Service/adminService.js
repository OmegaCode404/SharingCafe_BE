import * as adminDAL from '../DAL/adminDAL.js';
import * as blogDAL from '../DAL/blogDAL.js';
import * as eventDAL from '../DAL/eventDAL.js';
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

export async function updateBlogStatus(blogId, blogDetails) {
  const blog = blogDAL.getBlog(blogId);
  if (!blog) throw new Error('This blog does not exist!!');
  return await adminDAL.updateBlogStatus(blogId, blogDetails);
}

export async function updateEventStatus(eventId, eventDetails) {
  const event = eventDAL.getEvent(eventId);
  if (!event) throw new Error('This event does not exist!!');
  return await adminDAL.updateEventStatus(eventId, eventDetails);
}