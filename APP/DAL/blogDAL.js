import { Blog, SequelizeInstance } from '../utility/DbHelper.js';
export async function getBlogs() {
  const sqlQuery = `
  select 
    b.*, u.user_name, i.name
  from 
    blog b 
  join 
    interest i 
    on 1=1 
    and b.interest_id = i.interest_id
  join
    "user" u
    on u.user_id = b.user_id
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function getBlog(blogId) {
  const sqlQuery = `
  select 
    b.*, u.user_name, i.name
  from 
    blog b 
  join 
    interest i 
    on 1=1 
    and b.interest_id = i.interest_id
  join
    "user" u
    on u.user_id = b.user_id
   where b.blog_id = '${blogId}'
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function createBlog(blogId, dataObj){
    return await Blog.create({
      blog_id: blogId,
      user_id: dataObj.user_id,
      title: dataObj.title,
      contetn: dataObj.content,
      image: dataObj.image,
      likes_count: dataObj.likes_count,
      comments_count: dataObj.comments_count,
      is_approve: dataObj.is_approve,
      is_visible: dataObj.is_visible,
      interest_id: dataObj.interest_id
    });
}

export async function updateBlog(blogId, blogDetails){
  return await Blog.update({
    user_id: blogDetails.user_id,
    title: blogDetails.title,
    content: blogDetails.content,
    image: blogDetails.image,
    likes_count: blogDetails.likes_count,
    comments_count: blogDetails.comments_count,
    is_approve: blogDetails.is_approve,
    is_visible: blogDetails.is_visible,
    interest_id: blogDetails.interest_id
 }, {
   where: {blog_id: blogId}
 });
}

export async function deleteBlog(blogId) {
    const deletedBlog = await Blog.destroy({
      where: { blog_id: blogId },
    });
    return deletedBlog;
}

export async function updateImg(blogId, fileData) {
  return await Blog.update({
    image: fileData?.path
  }, {
    where: {blog_id: blogId}
  });
}

export async function getNewBlogs() {
  const sqlQuery = `
  select 
    b.*, u.user_name, i.name
  from 
    blog b 
  join 
    interest i 
    on 1=1 
    and b.interest_id = i.interest_id
  join
    "user" u
    on u.user_id = b.user_id
  order by b.created_at desc 
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}
