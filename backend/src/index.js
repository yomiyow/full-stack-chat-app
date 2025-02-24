import express from 'express';
import dotenv from 'dotenv';
import authRoute from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}}`);
  connectDB();
});