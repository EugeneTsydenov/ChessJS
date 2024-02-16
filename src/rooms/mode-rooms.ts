import {ChessGameRoom} from "./game-chess-room";
import {Client} from "colyseus";
import * as http from "http";

/*
* These rooms are for finding games for different game modes for chess
* Naming rooms:
*   Ultra + name mode - this is the fastest game in this mode,
*   Hyper + name mode - this is a little slower than ultra mode,
*   Super + name mode - this is a little slower than hyper mode,
*   Just the name of the mode - this is the slowest game in this mode
* */

export class UltraBulletRoom extends ChessGameRoom {
  totalTime = 1;
  incrementTime = 0;

  async onAuth(client: Client, options: any, request?: http.IncomingMessage): Promise<any> {
    return super.onAuth(client, options, request);
  }

  async onJoin(client: Client, req?: http.IncomingMessage): Promise<void> {
    return super.onJoin(client, req);
  }

  async confirmGame(): Promise<void> {
    return super.confirmGame();
  }

  async onLeave(client: Client, consented: boolean): Promise<void> {
    return super.onLeave(client, consented);
  }

  startGame() {
    super.startGame();
  }
}

export class BulletRoom extends ChessGameRoom {
  totalTime = 2;
  incrementTime = 1;

  async onAuth(client: Client, options: any, request?: http.IncomingMessage): Promise<any> {
    return super.onAuth(client, options, request);
  }

  async onJoin(client: Client, req?: http.IncomingMessage): Promise<void> {
    return super.onJoin(client, req);
  }

  async confirmGame(): Promise<void> {
    return super.confirmGame();
  }

  async onLeave(client: Client, consented: boolean): Promise<void> {
    return super.onLeave(client, consented);
  }

  startGame() {
    super.startGame();
  }
}

export class UltraBlitzRoom extends ChessGameRoom {
  totalTime = 3;
  incrementTime = 0
  async onAuth(client: Client, options: any, request?: http.IncomingMessage): Promise<any> {
    return super.onAuth(client, options, request);
  }

  async onJoin(client: Client, req?: http.IncomingMessage): Promise<void> {
    return super.onJoin(client, req);
  }

  async confirmGame(): Promise<void> {
    return super.confirmGame();
  }

  async onLeave(client: Client, consented: boolean): Promise<void> {
    return super.onLeave(client, consented);
  }

  startGame() {
    super.startGame();
  }
}

export class HyperBlitzRoom extends ChessGameRoom {
  totalTime = 3;
  incrementTime = 2

  async onAuth(client: Client, options: any, request?: http.IncomingMessage): Promise<any> {
    return super.onAuth(client, options, request);
  }

  async onJoin(client: Client, req?: http.IncomingMessage): Promise<void> {
    return super.onJoin(client, req);
  }

  async confirmGame(): Promise<void> {
    return super.confirmGame();
  }

  async onLeave(client: Client, consented: boolean): Promise<void> {
    return super.onLeave(client, consented);
  }

  startGame() {
    super.startGame();
  }
}

export class SuperBlitzRoom extends ChessGameRoom {
  totalTime = 5;
  incrementTime = 0
  async onAuth(client: Client, options: any, request?: http.IncomingMessage): Promise<any> {
    return super.onAuth(client, options, request);
  }

  async onJoin(client: Client, req?: http.IncomingMessage): Promise<void> {
    return super.onJoin(client, req);
  }

  async confirmGame(): Promise<void> {
    return super.confirmGame();
  }

  async onLeave(client: Client, consented: boolean): Promise<void> {
    return super.onLeave(client, consented);
  }

  startGame() {
    super.startGame();
  }
}

export class BlitzRoom extends ChessGameRoom {
  totalTime = 5;
  incrementTime = 3
  async onAuth(client: Client, options: any, request?: http.IncomingMessage): Promise<any> {
    return super.onAuth(client, options, request);
  }

  async onJoin(client: Client, req?: http.IncomingMessage): Promise<void> {
    return super.onJoin(client, req);
  }

  async confirmGame(): Promise<void> {
    return super.confirmGame();
  }

  async onLeave(client: Client, consented: boolean): Promise<void> {
    return super.onLeave(client, consented);
  }

  startGame() {
    super.startGame();
  }
}

export class UltraRapidRoom extends ChessGameRoom {
  totalTime = 10;
  incrementTime = 0

  async onAuth(client: Client, options: any, request?: http.IncomingMessage): Promise<any> {
    return super.onAuth(client, options, request);
  }

  async onJoin(client: Client, req?: http.IncomingMessage): Promise<void> {
    return super.onJoin(client, req);
  }

  async confirmGame(): Promise<void> {
    return super.confirmGame();
  }

  async onLeave(client: Client, consented: boolean): Promise<void> {
    return super.onLeave(client, consented);
  }

  startGame() {
    super.startGame();
  }
}

export class HyperRapidRoom extends ChessGameRoom {
  totalTime = 10;
  incrementTime = 5;

  async onAuth(client: Client, options: any, request?: http.IncomingMessage): Promise<any> {
    return super.onAuth(client, options, request);
  }

  async onJoin(client: Client, req?: http.IncomingMessage): Promise<void> {
    return super.onJoin(client, req);
  }

  async confirmGame(): Promise<void> {
    return super.confirmGame();
  }

  async onLeave(client: Client, consented: boolean): Promise<void> {
    return super.onLeave(client, consented);
  }

  startGame() {
    super.startGame();
  }
}

export class RapidRoom extends ChessGameRoom {
  totalTime = 15;
  incrementTime = 10

  async onAuth(client: Client, options: any, request?: http.IncomingMessage): Promise<any> {
    return super.onAuth(client, options, request);
  }

  async onJoin(client: Client, req?: http.IncomingMessage): Promise<void> {
    return super.onJoin(client, req);
  }

  async confirmGame(): Promise<void> {
    return super.confirmGame();
  }

  async onLeave(client: Client, consented: boolean): Promise<void> {
    return super.onLeave(client, consented);
  }

  startGame() {
    super.startGame();
  }
}

export class UltraClassicalRoom extends ChessGameRoom {
  totalTime = 30;
  incrementTime = 0

  async onAuth(client: Client, options: any, request?: http.IncomingMessage): Promise<any> {
    return super.onAuth(client, options, request);
  }

  async onJoin(client: Client, req?: http.IncomingMessage): Promise<void> {
    return super.onJoin(client, req);
  }

  async confirmGame(): Promise<void> {
    return super.confirmGame();
  }

  async onLeave(client: Client, consented: boolean): Promise<void> {
    return super.onLeave(client, consented);
  }

  startGame() {
    super.startGame();
  }
}

export class ClassicalRoom extends ChessGameRoom {
  totalTime = 30;
  incrementTime = 20

  async onAuth(client: Client, options: any, request?: http.IncomingMessage): Promise<any> {
    return super.onAuth(client, options, request);
  }

  async onJoin(client: Client, req?: http.IncomingMessage): Promise<void> {
    return super.onJoin(client, req);
  }

  async confirmGame(): Promise<void> {
    return super.confirmGame();
  }

  async onLeave(client: Client, consented: boolean): Promise<void> {
    return super.onLeave(client, consented);
  }

  startGame() {
    super.startGame();
  }
}
