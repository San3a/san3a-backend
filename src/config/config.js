import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV || 'development';

dotenv.config({ path: path.resolve(`.env.${env}`) });

export const { PORT } = process.env;
export const { MONGO_URL } = process.env;
export const { NODE_ENV } = process.env;
export const { SERVER_URL } = process.env;
