import * as blogService from '../Service/blogService.js';
import { SequelizeInstance } from '../utility/DbHelper.js';
// GET ALL BLOG
export async function getBlogs(req, res) {
  try {
    const page = req.query.page;
    const title = req.query.title;
    const result = await blogService.getBlogs(page, title);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}
// GET A BLOG BY ID
export async function getBlog(req, res) {
  try {
    const userId = req.query.userId;
    const blogId = req.params.blogId;
    const result = await blogService.getBlog(blogId, userId);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}
// CREATE BLOG
export async function createBlog(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const dataObj = req.body;
    const result = await blogService.createBlog(dataObj);
    res.status(200).send(result);
    t.commit();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
    t.rollback();
  }
}
// UPDATE BLOG
export async function updateBlog(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const blogId = req.params.blogId;
    const blogDetails = req.body;
    const blog = await blogService.updateBlog(blogId, blogDetails);
    res.status(200).send(blog);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

// DELETE BLOG
export async function deleteBlog(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const blogIds = req.params.blogId;
    const blog = await blogService.deleteBlog(blogIds);
    res.status(200).send({ blog });
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function updateImg(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const fileData = req.file;
    console.log(fileData);
    if (fileData === undefined) {
      cloudinary.uploader.destroy(fileData.filename)
      return res.status(400).send({ error: error.message });
    }
    const blogId = req.params.blogId;
    const user = await blogService.updateImg(blogId, fileData);
    res.status(200).send(user);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function getNewBlogs(req, res) {
  try {
    const page = req.query.page;
    const result = await blogService.getNewBlogs(page);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getPopularBlogs(req, res) {
  try {
    const page = req.query.page;
    const result = await blogService.getPopularBlogs(page);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function searchByName(req, res) {
  try {
    const title = req.query.title;
    const result = await blogService.searchByName(title);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getComments(req, res) {
  try {
    const blogId = req.params.blogId;
    const result = await blogService.getComments(blogId);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function createComment(req, res){
  const t = await SequelizeInstance.transaction();
  try {
    const dataObj = req.body;
    const result = await blogService.createComment(dataObj);
    res.status(200).send(result);
    t.commit();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
    t.rollback();
  }
}

export async function updateComment(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const commentId = req.params.commentId;
    const content = req.body.content;
    const blog = await blogService.updateComment(commentId, content);
    res.status(200).send(blog);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function likeBlog(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const dataObj = req.body;
    const result = await blogService.likeBlog(dataObj);
    res.status(200).send(result);
    t.commit();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
    t.rollback();
  }
}

export async function unLikeBlog(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const dataObj = req.body;
    const result = await blogService.unlikeBlog(dataObj);
    res.status(200).send({result});
    t.commit();
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
    t.rollback();
  }
}

export async function deleteComment(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const commentId = req.params.commentId;
    const blogId = req.query.blog_id
    const comment = await blogService.deleteComment(commentId, blogId);
    res.status(200).send({ comment });
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function getBlogUrl(req, res) {
  try {
    const blog_id = req.query.blog_id;
    const result = await blogService.getBlogUrl(blog_id);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getUserBlog(req, res) {
  try {
    const page = req.query.page;
    const title = req.query.title;
    const result = await blogService.getUserBlog(page, title);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getMyBlogs(req, res) {
  try {
    const userId = req.loginUser.user_id;
    const result = await blogService.getMyBlogs(userId);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}