import * as modService from '../Service/modService.js';
import * as eventService from '../Service/eventService.js';
import * as blogService from '../Service/blogService.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { SequelizeInstance } from '../utility/DbHelper.js';

dotenv.config();
const secret_key = process.env.SECRET_KEY;

export async function loginMod(req, res) {
    try {
      const { email, password } = req.body;
      const result = await modService.getModDetails(email, password);
      const userDetails = result.dataValues;
      if (userDetails) {
        const email = userDetails.email;
        const accessToken = jwt.sign({ email: email }, secret_key, {
          expiresIn: '30d',
        });
        res.header('Authorization', `Bearer ${accessToken}`);
        userDetails.accessToken = `Bearer ${accessToken}`;
        res.send(userDetails);
      } else {
        res.status(400).send({ message: 'Moderator not found' });
      }
    } catch (error) {
      console.log(error);
      res.status(404).send(error);
    }
}

export async function censorBlog(req, res){
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

export async function censorEvent(req, res) {
    const t = await SequelizeInstance.transaction();
    try{
        const eventId = req.params.eventId;
        const eventDetails = req.body;
        const event = await eventService.updateEvent(
            eventId,
            eventDetails
        );
        res.status(200).send(event);
        await t.commit();
    } catch (error){
        await t.rollback();
        console.log(error);
        res.status(404).send(error);
    }
}