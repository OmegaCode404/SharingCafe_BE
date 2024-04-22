import express from 'express';
import cors from 'cors';
import http from 'http';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Server } from 'socket.io';
import allRouter from './allRouter.js';
import options from './swagger.js';
import * as userService from './APP/Service/userService.js';
import * as chatController from './APP/Controller/chatController.js';
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' with { "type": "json" };
import * as eventService from './APP/Service/eventService.js'
import fs from 'fs';
const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY;

// Create HTTP server
const server = http.createServer(app);

// Swagger configuration
const specs = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to extract user information from JWT token
const getUserInfoMiddleware = async (req, res, next) => {
  const accessToken =
    req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({
      error: 'Unauthorized - Access token missing',
      accessToken: accessToken,
    });
  }

  try {
    const decodedToken = jwt.verify(accessToken, SECRET_KEY);
    const email = decodedToken.email;
    const [loginUser] = await userService.getUserInfoByEmail(email);
    req.loginUser = loginUser;
    next();
  } catch (error) {
    res.status(401).json({
      error: 'Unauthorized - Invalid access token',
      message: error.message,
    });
  }
};

// Middleware for authentication
const authenticatedRoutes = ['/api/auth/'];
app.use(async (req, res, next) => {
  const requestedRoute = req.path;
  const authCheck = authenticatedRoutes.some((prefix) =>
    requestedRoute.includes(prefix),
  );

  if (authCheck) {
    await getUserInfoMiddleware(req, res, next);
  } else {
    next();
  }
});

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Sharing_Coffee_CAPSTONE🤣🤣🤣');
});

app.use(allRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

// 404 Not Found Handling
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Initialize Socket.io
const io = new Server(server);

// Socket.io handling
io.on('connection', (socket) => {
  console.log('Socket.io client connected');
  // Accessing data from headers
  const accessToken = socket.handshake.headers['authorization'];

  // Log the header value
  console.log('Authorization header:', accessToken);
  socket.on('message', async (data) => {
    console.log('Received data:', data);
    const messageId = await chatController.saveMessage(data);
    if(!messageId) {
      const message = await chatController.getMessage(messageId);
      io.emit('message', message);
    }else{
      io.emit('message', "USER GOT BLOCKED");
    }
  });
});
// Schedule the task to run every 5 minutes
import cron from 'node-cron';

cron.schedule('*/30 * * * * *', async () => {
  try {
    await eventService.sendNotificationIfEventOccurToday(); 
  } catch (error) {
    console.error('Error:', error);
  }
});

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});