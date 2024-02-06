import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import router from "./routes";
import { errorMiddleware } from "./middlewares/error-middleware";

export const app: Express = express();
dotenv.config();
const PORT = process.env.BASE_PORT || 52718;


app.use(express.json());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use(cookieParser());
app.use('/api', router);
app.use(errorMiddleware);

const start = (): void => {
  try {
    app.listen(PORT, async (): Promise<void> => {
      console.log(`Server started on ${PORT} port.`);
    });
  } catch (e) {
    console.log(e, 2);
  }
};
start();

