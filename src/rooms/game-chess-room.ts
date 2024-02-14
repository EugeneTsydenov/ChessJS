import {Client, Room} from "colyseus";
import tokenService from "../services/token-service";
import {ApiError} from "../exceptions/api-error";
import userService from "../services/user-service";
import * as http from "http";

export class ChessGameRoom extends Room {
  maxClients = 2;
  connectedPlayers: string[] = [];
  accessToken: string = '';
  confirmedPlayers: Client[] = [];
  userId: string = '';
  totalTime = 30;
  incrementTime = 20

  async onAuth(client: Client, options: any, request?: http.IncomingMessage){
    try {
      const accessToken = options.accessToken;
      const decodedAccessToken = await tokenService.validateAccessToken(accessToken);
      if(typeof decodedAccessToken === 'object') {
        const userId = decodedAccessToken.userID;

        if(!userId) {
          throw ApiError.UnauthorizedError();
        }

        if(this.connectedPlayers.includes(userId)) {
          this.send(client, 'Error', "Игрок уже подключен к комнате");
          await this.disconnect();
          return;
        }

        const user = await userService.findUserById(userId);
        if(!user) {
          throw ApiError.UnauthorizedError();
        }

        this.connectedPlayers.push(decodedAccessToken.userID);
        this.userId = userId
      }
      return super.onAuth(client, options, request);
    } catch (e) {
      throw e
    }
  }

  async onJoin(client: Client, req?: http.IncomingMessage) {
    if (this.clients.length === 2) {
      await this.confirmGame();
    } else {
      client.send('start search game')
    }
  }

  async confirmGame() {
    this.broadcast('confirm game');
    this.onMessage('user confirm game', (sessionId) => {
      this.confirmedPlayers.push(sessionId)
      if(this.confirmedPlayers.length === 2) {
        this.startGame()
      } else {
        sessionId.send('waiting enemy')
      }
    })
  }

  async onLeave(client: Client, consented: boolean) {
    if(consented) {
      client.leave()
    }
  }

  startGame() {
    this.broadcast('start game')
  }
}
