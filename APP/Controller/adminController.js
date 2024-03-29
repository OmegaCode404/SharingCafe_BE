// admRoutes.js

// import express from 'express';
import jwt from 'jsonwebtoken';
import * as admService from '../Service/adminService.js';
import { SequelizeInstance } from '../utility/DbHelper.js';
import dotenv from 'dotenv';

dotenv.config();

// const router = express.Router();
const secret_key = process.env.SECRET_KEY;

export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;
    const result = await admService.getAdmDetails(email, password);
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
      res.status(400).send({ message: 'Admin not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send(error);
  }
}

export async function getStatics(req, res) {
  try {
    const statics = await admService.getStatics();
    res.status(200).send(statics);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
}

export async function getUser(req, res){
  try {
    const userId = req.params.userId;
    const result = await admService.getUser(userId);
    res.status(200).send(result);
  } catch (error){
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function getUsers(req, res) {
  try {
    const result = await admService.getUsers();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

export async function updateUserStatus(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const userId = req.params.userId;
    const userDetails = req.body;
    const user = await admService.updateUserStatus(userId, userDetails);
    res.status(200).send(user);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function updateBlogStatus(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const blogId = req.params.blogId;
    const blogDetails = req.body;
    const user = await admService.updateBlogStatus(blogId, blogDetails);
    res.status(200).send(user);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}

export async function updateEventStatus(req, res) {
  const t = await SequelizeInstance.transaction();
  try {
    const eventId = req.params.eventId;
    const eventDetails = req.body;
    const user = await admService.updateEventStatus(eventId, eventDetails);
    res.status(200).send(user);
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(404).send(error);
  }
}