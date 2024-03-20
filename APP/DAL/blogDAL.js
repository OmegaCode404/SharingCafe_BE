import { Blog, SequelizeInstance, Comment } from '../utility/DbHelper.js';
export async function getBlogs(page) {
  let sqlQuery = '';
  if (page){
    sqlQuery = `
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
    offset ((${page} - 1 ) * 10) rows 
    fetch next 10 rows only`
  } else {
    sqlQuery = `
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
  }
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function getBlog(blogId) {
  const sqlQuery = `
  select 
    b.*, u.user_name, u.profile_avatar, i.name
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

export async function getPopularBlogs() {
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
  order by b.likes_count desc 
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function searchByName(title) {
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
  where b.title like '%${title}%'
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function getComments(blogId) {
  const sqlQuery = `
  select 
    c.comment_id , c."content", u.user_id ,u.user_name , u.profile_avatar
  from 
 	"comment" c
  join
 	  "user" u 
 	  on u.user_id = c.user_id
  join 
 	  blog b 
 	  on b.blog_id = c.blog_id 
  where c.blog_id = '${blogId}'
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function createComment (comment_id, dataObj){
  return await Comment.create({
    comment_id: comment_id,
    blog_id: dataObj.blogId,
    user_id: dataObj.userId,
    content: dataObj.content
  });
}

export async function getComment(commentId){
  const sqlQuery = `
  select 
 	  c.*, u.user_name , u.profile_avatar 
  from
 	  "comment" c 
  join
 	  blog b 
 	  on b.blog_id = c.blog_id 
  join 
 	  "user" u 
 	  on c.user_id = u.user_id 
  where c.comment_id = '${commentId}'
  `;
  const result = await SequelizeInstance.query(sqlQuery, {
    type: SequelizeInstance.QueryTypes.SELECT,
    raw: true,
  });
  return result;
}

export async function updateComment(commentId, content){
  return await Comment.update({
    content: content
  }, {
    where: {comment_id: commentId}
  })
}