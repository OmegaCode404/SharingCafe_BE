import * as adminDAL from '../DAL/adminDAL.js'
import * as blogDAL from '../DAL/blogDAL.js'
import * as eventDAL from '../DAL/eventDAL.js'
import * as userDAL from '../DAL/userDAL.js'
import * as firebaseHelper from '../utility/FirebaseHelper.js'
// DAL -> Data Access Layer
export async function getAdmDetails(email, password) {
  return await adminDAL.getAdmDetails(email, password)
}
export async function getStatics() {
  return await adminDAL.getStatics()
}

export async function getUser(userId) {
  return await adminDAL.getUser(userId)
}

export async function getUsers({ page, size }) {
  return await adminDAL.getUsers({ page, size })
}

export async function updateUserStatus(userId, userDetails) {
  const user = await adminDAL.getUser(userId)
  if (!user) throw new Error('This user does not exist!!')
  else {
    return await adminDAL.updateUserStatus(userId, userDetails)
  }
}

export async function updateBlogStatus(blogId, blogDetails) {
  const [blog] = await blogDAL.getBlog(blogId)
  if (!blog) throw new Error('This blog does not exist!!')
  else {
    const blogCreator = await userDAL.getTokenId(blog.user_id)
    const titleTo = `TÍNH NĂNG BÀI VIẾT`
    const bodyTo = `Thông báo mới: Bài viết ${blog.title} đã bị Admin vô hiệu hóa`
    console.log(blogCreator.token_id)
    firebaseHelper.sendNotification(blogCreator.token_id, titleTo, bodyTo)
    return await adminDAL.updateBlogStatus(blogId, blogDetails)
  }
}

export async function updateEventStatus(eventId, eventDetails) {
  const [event] = await eventDAL.getEvent(eventId)
  if (!event) throw new Error('This event does not exist!!')
  else {
    const eventCreator = await userDAL.getTokenId(event.user_id)
    const titleTo = `TÍNH NĂNG SỰ KIỆN`
    const bodyTo = `Thông báo mới: Sự kiện ${event.title} đã bị Admin vô hiệu hóa`
    console.log(eventCreator.token_id)
    firebaseHelper.sendNotification(eventCreator.token_id, titleTo, bodyTo)
    return await adminDAL.updateEventStatus(eventId, eventDetails)
  }
}

export async function getEventStatics() {
  return await adminDAL.getEventStatics()
}

export async function getScheduleList() {
  return await adminDAL.getScheduleList()
}

export async function getBlogStatics() {
  return await adminDAL.getBlogStatics()
}
