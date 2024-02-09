import * as socketIo from 'socket.io';
import * as http from "http";
import {app} from "./index";

const server = http.createServer(app);
const io = new socketIo.Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});



export default io;