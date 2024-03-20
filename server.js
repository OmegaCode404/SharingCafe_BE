import express from 'express';
import cors from 'cors';
import allRouter from './allRouter.js';
import dotenv from 'dotenv';
import options from './swagger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import * as userService from './APP/Service/userService.js';
import jwt from 'jsonwebtoken';
// Trái tim của app
const app = express();
dotenv.config();
const specs = swaggerJSDoc(options);
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware
app.use(cors());
app.use(express.json());

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

// Define an array of routes that require authentication
const authenticatedRoutes = ['/api/auth/'];

// Middleware for authentication
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
// Routes   -> API :  METHOD + URL
// METHOD : GET  && URL : /
app.get('/', (req, res) => {
  res.send('Welcome to the Sharing_Coffee_CAPSTONE🤣🤣🤣');
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// API Kích hoạt library

app.use(allRouter);

// Error Handling Middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

// 404 Not Found Handling
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Server Start
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Upgrade HTTP server to WebSocket server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
