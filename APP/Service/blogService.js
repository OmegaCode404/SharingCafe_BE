import * as blogDAL from '../DAL/blogDAL.js';
import { v4 as uuidv4 } from 'uuid';
export async function getBlogs(page){
    return await blogDAL.getBlogs(page);
}

export async function getBlog(blogId){
    return await blogDAL.getBlog(blogId);
}

export async function createBlog(dataObj){
    const blog_id = uuidv4();
    return await blogDAL.createBlog(blog_id, dataObj);
}

export async function updateBlog(blogId, blogDetails){
    const blog = await getBlog(blogId);
    if (!blog) throw new Error('Blog not found !!!');
    return await blogDAL.updateBlog(blogId, blogDetails);
}

export async function deleteBlog(blogId) {
    const blog = await getBlog(blogId);
    if (!blog) throw new Error('Blog not found !!!');
    return await blogDAL.deleteBlog(blogId);
}

export async function updateImg(blogId, fileData){
    const blog = await getBlog(blogId);
    if (!blog) throw new Error('Blog not found !!!');
    return await blogDAL.updateImg(blogId, fileData);
}

export async function getNewBlogs(){
    return await blogDAL.getNewBlogs();
}

export async function getPopularBlogs(){
    return await blogDAL.getPopularBlogs();
}

export async function searchByName(title){
    return await blogDAL.searchByName(title);
}

export async function getComments(blogId){
    return await blogDAL.getComments(blogId);
}

export async function createComment(dataObj){
    const comment_id = uuidv4();
    const blog = await getBlog(dataObj.blogId)
    if (!blog) throw new Error('Blog not found !!!');
    return await blogDAL.createComment(comment_id, dataObj);
}

export async function getComment(commentId){
    return await blogDAL.getComment(commentId);
}

export async function updateComment(commentId, content){
    const comment = await getComment(commentId);
    if (!comment) throw new Error('Comment not found');
    return await blogDAL.updateComment(commentId, content)
}