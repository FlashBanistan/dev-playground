import { Server, Socket } from 'socket.io';
import http from 'http';
import express, { Request } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import {
  CreateNewGameResponse,
  SubscribeToGameUpdatesRequest,
  ScumGame,
  StartGameRequest,
  PlayCardsRequest,
  PassTurnRequest,
  StartNewRoundRequest,
  SwapCardsRequest,
} from '@playground/cardly-util';
import { randomId } from '@playground/shared/util/id';

export class CardlyServer {
  private server: http.Server;
  private io: Server;
  private app: express.Application;
  private port: number;
  private games: { [gameId: string]: ScumGame };
  private secretKey = 'myCoolSecretKey';

  constructor() {
    this.games = {};
    this.app = express();
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    // Use Express to handle HTTP requests
    this.port = parseInt(process.env.PORT) || 3000;
    this.server = http.createServer(this.app);

    this.io = new Server(this.server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Handle authentication
    this.io.use((socket, next) => {
      const cookie = socket.handshake.headers.cookie;

      if (!cookie) {
        next(new Error('Authentication error'));
        return;
      }

      const tokenMatch = cookie.match(/token=([^;]+)/);
      if (!tokenMatch || !tokenMatch[1]) {
        next(new Error('Authentication error: Token not found in cookie'));
        return;
      }

      const token = tokenMatch[1];

      try {
        const payload = jwt.verify(token, this.secretKey);
        socket['user'] = payload['user'];
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });

    // Generate a jwt token and set a cookie
    this.app.post('/api/generate-token', (req: Request<{}, {}, { displayName: string }>, res) => {
      // Check if the request includes a cookie:

      if (req.cookies?.token) {
        try {
          const user = jwt.verify(req.cookies.token, this.secretKey);
          res.send({ user: user });
          return;
        } catch (err) {}
      }

      const displayName = req.body?.displayName;
      if (!displayName) {
        res.sendStatus(400);
        return;
      }

      const user = { id: randomId(), displayName: displayName, avatar: 'https://i.pravatar.cc/300' };

      const token = jwt.sign({ user }, this.secretKey);

      // Set the cookie
      res.cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365 * 10 }); // 10 years

      // Return the token
      res.send({ token: token });
    });

    // Check cookie for valid token and return user
    this.app.post('/api/me', (req, res) => {
      if (!req.cookies?.token) {
        res.send(null);
        return;
      }

      try {
        const payload = jwt.verify(req.cookies.token, this.secretKey);
        res.send(payload['user']);
      } catch (err) {
        res.send(null);
      }
    });

    this.app.post('/api/logout', (req, res) => {
      res.clearCookie('token'); // Clear the 'token' cookie
      res.status(200).json({ message: 'Logout successful' });
    });

    this.app.post('/create-game', (req, res) => {});
    // Create a new game

    // Join a game
    this.app.post('/join-game', (req, res) => {});

    // Start a game
    this.app.post('/start-game', (req, res) => {});

    // Get game state
    this.app.get('/game-state', (req, res) => {});

    // Play cards
    this.app.post('/play-cards', (req, res) => {});

    // WebSocket connection handling
    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected: ', socket.id, socket['user'].displayName);

      socket.on('createNewGame', (payload: any) => {
        const game = new ScumGame(socket['user']);
        this.games[game.gameId] = game;
        const response: CreateNewGameResponse = { gameId: game.gameId };
        socket.emit('newGameCreated', response);
      });

      socket.on('joinGame', (payload: any) => {
        const game = this.games[payload.gameId];
        const user = socket['user'];
        if (!game) {
          console.log('Game not found');
          return;
        }
        game.addUserToGame(user);
        const users = game.getUsers();
        for (const user of users) {
          this.io.to(user.id).emit('gameStateUpdate', game.getCurrentGameState(user.id));
        }
        const response = { gameId: game.gameId };
        socket.emit('gameJoined', response);
      });

      socket.on('startGame', (payload: StartGameRequest) => {
        const game = this.games[payload.gameId];
        game.startGame();
        const users = game.getUsers();
        for (const user of users) {
          this.io.to(user.id).emit('gameStateUpdate', game.getCurrentGameState(user.id));
        }
      });

      socket.on('playCards', (payload: PlayCardsRequest) => {
        const game = this.games[payload.gameId];
        game.playCards({ userId: socket['user'].id, cardsInPlay: payload.cards });
        const users = game.getUsers();
        for (const user of users) {
          this.io.to(user.id).emit('gameStateUpdate', game.getCurrentGameState(user.id));
        }
      });

      socket.on('passTurn', (payload: PassTurnRequest) => {
        const game = this.games[payload.gameId];
        game.passTurn(socket['user'].id);
        const users = game.getUsers();
        for (const user of users) {
          this.io.to(user.id).emit('gameStateUpdate', game.getCurrentGameState(user.id));
        }
      });

      socket.on('startNewRound', (payload: StartNewRoundRequest) => {
        const game = this.games[payload.gameId];
        game.startNewRound();
        const users = game.getUsers();
        for (const user of users) {
          this.io.to(user.id).emit('gameStateUpdate', game.getCurrentGameState(user.id));
        }
      });

      socket.on('swapCards', (payload: SwapCardsRequest) => {
        const game = this.games[payload.gameId];
        game.swapCards({ userId: socket['user'].id, cards: payload.cards });
        const users = game.getUsers();
        for (const user of users) {
          this.io.to(user.id).emit('gameStateUpdate', game.getCurrentGameState(user.id));
        }
      });

      socket.on('subscribeToGameUpdates', (payload: SubscribeToGameUpdatesRequest) => {
        socket.join(payload.gameId);
        socket.join(socket['user'].id);
        const game = this.games[payload.gameId];
        socket.emit('gameStateUpdate', game.getCurrentGameState(socket['user'].id));
      });

      socket.on('unsubscribeFromGameUpdates', (payload: SubscribeToGameUpdatesRequest) => {
        socket.leave(payload.gameId);
        socket.leave(socket['user'].id);
      });

      socket.on('close', () => {
        console.log('Client disconnected');
      });
    });

    this.server.listen(this.port, '0.0.0.0', () => {
      console.log(`WebSocket server listening on port ${this.port}`);
    });
  }
}
