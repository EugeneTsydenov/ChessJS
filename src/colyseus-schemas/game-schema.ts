import { Schema, MapSchema } from '@colyseus/schema';
import { Chess } from 'chess.js';

export class GameState extends Schema {
  players = new MapSchema<Player>();
  game = new Chess();

  constructor() {
    super();
  }
}

class Player extends Schema {
  id: string = '';
  color: string = '';

  constructor(id: string) {
    super();
    this.id = id;
  }
}
