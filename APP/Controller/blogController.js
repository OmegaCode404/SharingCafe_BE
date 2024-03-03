import * as blogService from '../Service/blogService.js';
import { SequelizeInstance } from '../utility/DbHelper.js';
// GET ALL BLOG
export async function getBlogs(req, res) {
    try{
        const result = await blogService.getBlogs();
        res.status(200).send(result);
    } catch (error){
        console.log(error);
        res.status(500).send({ error: error.message });
    }
}
// GET A BLOG BY ID
export async function getBlog(req, res){
    try {
        const blogId = req.params.blogId;
        const result = await blogService.getBlog(blogId);
        res.status(200).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error.message });
    }
}
// CREATE BLOG
export async function createBlog(req, res){
    try {
        const dataObj = req.body;
        const result = await blogService.createBlog(dataObj);
        res.status(200).send(result);
    } catch (error){
        console.log(error);
        res.status(500).send({ error: error.message });
    }
}
// UPDATE BLOG
export async function updateBlog(req, res){
    const t = await SequelizeInstance.transaction();
    try{
        const blogId = req.params.blogId;
        const blogDetails = req.body;
        const blog = await blogService.updateBlog(
            blogId,
            blogDetails
        );
        res.status(200).send(blog);
        await t.commit();
    } catch (error){
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