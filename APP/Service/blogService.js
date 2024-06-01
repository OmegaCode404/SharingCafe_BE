import * as firebaseHelper from '../utility/FirebaseHelper.js';
import * as blogDAL from '../DAL/blogDAL.js';
import { v4 as uuidv4 } from 'uuid';

export async function getBlogs(page, title) {
  return await blogDAL.getBlogs(page, title);
}

export async function getBlog(blogId, userId) {
  var blogInfo = await blogDAL.getBlog(blogId);
  if (userId) {
    var likeCount = await blogDAL.isUserLikeBlog(blogId, userId);
    blogInfo[0].is_like = likeCount.length > 0;
  }
  return blogInfo;
}

export async function createBlog(dataObj) {
  const blog_id = uuidv4();
  return await blogDAL.createBlog(blog_id, dataObj);
}

export async function updateBlog(blogId, blogDetails) {
  const [blog] = await getBlog(blogId);
  if (!blog) throw new Error('Blog not found !!!');
  return await blogDAL.updateBlog(blogId, blogDetails);
}

export async function deleteBlog(blogId) {
  const [blog] = await getBlog(blogId);
  if (!blog) throw new Error('Blog not found !!!');
  return await blogDAL.deleteBlog(blogId);
}

export async function updateImg(blogId, fileData) {
  const [blog] = await getBlog(blogId);
  if (!blog) throw new Error('Blog not found !!!');
  return await blogDAL.updateImg(blogId, fileData);
}

export async function getNewBlogs(page) {
  return await blogDAL.getNewBlogs(page);
}

export async function getPopularBlogs(page) {
  return await blogDAL.getPopularBlogs(page);
}

export async function searchByName(title) {
  return await blogDAL.searchByName(title);
}

export async function getComments(blogId) {
  return await blogDAL.getComments(blogId);
}

export async function createComment(dataObj) {
  const comment_id = uuidv4();
  const [blog] = await getBlog(dataObj.blogId);
  if (!blog) throw new Error('Blog not found !!!');
  return await blogDAL.createComment(comment_id, dataObj);
}

export async function getComment(commentId) {
  return await blogDAL.getComment(commentId);
}

export async function updateComment(commentId, content) {
  const [comment] = await getComment(commentId);
  if (!comment) throw new Error('Comment not found');
  return await blogDAL.updateComment(commentId, content);
}

export async function likeBlog(dataObj) {
  const like_blog_id = uuidv4();
  const [blog] = await blogDAL.getBlog(dataObj.blog_id);
  if (!blog) throw new Error('Blog not found !!!');
  const title = `CẬP NHẬP BÀI VIẾT`;
  const body = `Có người vừa thích bài viết của bạn`;
  firebaseHelper.sendNotification(blog.token_id, title, body);

  return await blogDAL.likeBlog(like_blog_id, dataObj);
}

export async function unlikeBlog(dataObj) {
  const [blog] = await blogDAL.getBlog(dataObj.blog_id);
  if (!blog) throw new Error('Blog not found !!!');
  const title = `CẬP NHẬP BÀI VIẾT`;
  const body = `Có người vừa đánh giá không thích bài viết của bạn`;
  firebaseHelper.sendNotification(blog.token_id, title, body);
  return await blogDAL.unlikeBlog(dataObj);
}

export async function deleteComment(commentId, blogId) {
  const [comment] = await getComment(commentId);
  if (!comment) throw new Error('Comment not found !!!');
  return await blogDAL.deleteComment(commentId, blogId);
}

export async function getBlogUrl(blog_id) {
  const [blog] = await getBlog(blog_id);
  if (!blog) throw new Error('Blog not found !!!');
  else {
    return {
      url: `https://sharing-coffee-be-capstone-com.onrender.com/api/blog/${blog_id}`,
    };
  }
}

export async function getUserBlog(page, title) {
  return await blogDAL.getUserBlog(page, title);
}

export async function getMyBlogs(userId) {
  return await blogDAL.getMyBlogs(userId);
}
