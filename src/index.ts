import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import router from "./routes";
import { errorMiddleware } from "./middlewares/error-middleware";
import {Server} from "colyseus";
import {createServer} from "node:http";
import {
  BlitzRoom,
  BulletRoom, ClassicalRoom,
  HyperBlitzRoom, HyperRapidRoom, RapidRoom,
  SuperBlitzRoom,
  UltraBlitzRoom,
  UltraBulletRoom, UltraClassicalRoom, UltraRapidRoom
} from "./rooms/mode-rooms";

export const app: Express = express();

dotenv.config();
const PORT = Number(process.env.BASE_PORT) || 52718;

app.use(express.json());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use(cookieParser());
app.use('/api', router);
app.use(errorMiddleware);

const gameServer = new Server({
  server: createServer(app)
})

gameServer.define('ultra-bullet', UltraBulletRoom);
gameServer.define('bullet', BulletRoom);
gameServer.define('ultra-blitz', UltraBlitzRoom);
gameServer.define('hyper-blitz', HyperBlitzRoom);
gameServer.define('super-blitz', SuperBlitzRoom);
gameServer.define('blitz', BlitzRoom);
gameServer.define('ultra-rapid', UltraRapidRoom);
gameServer.define('hyper-rapid', HyperRapidRoom);
gameServer.define('rapid', RapidRoom);
gameServer.define('ultra-classical', UltraClassicalRoom);
gameServer.define('classical', ClassicalRoom);

gameServer.listen(PORT).then(() => {
  console.log(`Server started on ${PORT} port.`)
})