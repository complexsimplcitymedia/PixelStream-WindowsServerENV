export const serverConfig = {
  port: process.env.PORT || 3000,
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  },
  logLevel: process.env.LOG_LEVEL || 'info'
};