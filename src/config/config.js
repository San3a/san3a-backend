import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV || 'development';

dotenv.config({ path: path.resolve(`.env.${env}`) });

export const { PORT } = process.env;
export const { MONGO_URL } = process.env;
export const { NODE_ENV } = process.env;
export const { SERVER_URL } = process.env;
export const { JWT_SECRET } = process.env;
export const { CLOUD_NAME } = process.env;
export const { API_KEY } = process.env;
export const { API_SECRET } = process.env;
export const { CLIENT_URL } = process.env;
