// admRoutes.js

import express from 'express';
import jwt from 'jsonwebtoken';
import * as userService from '../Service/userService.js';
import dotenv from 'dotenv';

dotenv.config();

// const router = express.Router();
const secret_key = process.env.SECRET_KEY;

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const result = await userService.getUserDetails(email, password);
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
