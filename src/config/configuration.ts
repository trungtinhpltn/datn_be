export default {
  port: parseInt(process.env.PORT, 10) || 8228,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432
  },
  serviceAuthExpire: process.env.SERVICE_AUTH_EXPIRE || 30, // in minutes
  databaseUrl: process.env.DATABASE_URL,
  uploadPath: process.env.UPLOAD_PATH || "./public/uploads/tmp",
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "access_token_secret",
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "refresh_token_secret",
  accessTokenExpires: "1d",
  refreshTokenExpires: "7d"
};
