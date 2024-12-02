const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API',
      version: '1.0.0',
      description: 'API SHARING_COFFEE',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
        },
      },
    },
  },
  schema: ['http', 'https'],
  apis: ['./allRouter.js'],
  servers: [
    {
      url: 'http://localhost:3500',
      description: 'This is the local development environment',
    },
    {
      url: 'https://sharing-coffee-be-capstone-com.onrender.com',
      description: 'This is the cloud development environment',
    },
  ],
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export default options;
