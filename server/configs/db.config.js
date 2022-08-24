const env = process.env;
const dbConfig = {
  host: env.DB_HOST || 'localhost',
  user: env.DB_USER || 'root',
  password: env.DB_PASSWORD || 'root',
  database: env.DB_NAME || 'newDb',
  port: env.DB_PORT || '27017',
};

module.exports = dbConfig;