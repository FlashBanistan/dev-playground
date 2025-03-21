import { GameManager } from './GameManager';
import {
  CardlyUser,
  ScumGame,
  ScumPayload,
  CreateNewGamePayload,
  JoinGamePayload,
  LeaveGamePayload,
  StartGamePayload,
  PlayCardsPayload,
  PassTurnPayload,
  StartNewRoundPayload,
  SwapCardsPayload,
  SubscribeToGameUpdatesPayload,
  UnsubscribeFromGameUpdatesPayload,
  CreateNewGameSuccess,
  GameUpdate,
  JoinGameSuccess,
  ScumGameUI,
  ScumTrickWinner,
  ScumTrickWon,
} from '@playground/cardly-util';
import { CommunicationService } from '../services/CommunicationService';
import { Serialized } from '@playground/shared/util/typescript';

export class ScumGameManager implements GameManager {
  private games: { [gameId: string]: ScumGame } = {};
  private messageHandlers: { [type: string]: (msg: Serialized<ScumPayload>, user: CardlyUser) => void } = {
    createNewGame: this.createNewGame,
    subscribeToGameUpdates: this.subscribeToGameUpdates,
    joinGame: this.joinGame,
    leaveGame: this.leaveGame,
    startGame: this.startGame,
    playCards: this.playCards,
    passTurn: this.passTurn,
    startNewRound: this.startNewRound,
    swapCards: this.swapCards,
    unsubscribeFromGameUpdates: this.unsubscribeFromGameUpdates,
  };

  constructor(private commService: CommunicationService) {}

  handleMessage(msg: Serialized<ScumPayload>, user: CardlyUser): void {
    const handler = this.messageHandlers[msg.type];
    if (handler) {
      handler.call(this, msg, user);
    } else {
      console.error('No handler for message type: ', msg.type);
    }
  }

  private createNewGame(msg: Serialized<CreateNewGamePayload>, user: CardlyUser): void {
    const game = new ScumGame();
    this.subscribeToGameEvents(game);
    game.addUserToGame(user);
    const gameId = game.gameId;
    this.games[gameId] = game;
    const res = new CreateNewGameSuccess(gameId).toSerializedObject();
    this.commService.sendToUser(user.id, res);
  }

  private subscribeToGameUpdates(msg: Serialized<SubscribeToGameUpdatesPayload>, user: CardlyUser): void {
    this.commService.joinGameRoom(user.id, msg.gameId);
    const game = this.games[msg.gameId];
    const res = new GameUpdate(this.getGameStateForUser(game, user.id)).toSerializedObject();
    this.commService.sendToUser(user.id, res);
  }

  private unsubscribeFromGameUpdates(msg: Serialized<UnsubscribeFromGameUpdatesPayload>, user: CardlyUser): void {
    this.commService.leaveGameRoom(user.id, msg.gameId);
  }

  private joinGame(msg: Serialized<JoinGamePayload>, user: CardlyUser): void {
    const game = this.games[msg.gameId];
    game.addUserToGame(user);
    this.sendGameStateToUsers(game.gameId);
    const res = new JoinGameSuccess(game.gameId).toSerializedObject();
    this.commService.sendToUser(user.id, res);
  }

  private leaveGame(msg: Serialized<LeaveGamePayload>, user: CardlyUser): void {
    const game = this.games[msg.gameId];
    game.removeUserFromGame(user.id);
    this.sendGameStateToUsers(game.gameId);
  }

  private startGame(msg: Serialized<StartGamePayload>, user: CardlyUser): void {
    const game = this.games[msg.gameId];
    game.startGame();
    this.sendGameStateToUsers(game.gameId);
  }

  private playCards(msg: Serialized<PlayCardsPayload>, user: CardlyUser): void {
    const game = this.games[msg.data.gameId];
    game.playCards({
      userId: user.id,
      cardsInPlay: msg.data.cards,
    });
    this.sendGameStateToUsers(game.gameId);
  }

  private passTurn(msg: Serialized<PassTurnPayload>, user: CardlyUser): void {
    const game = this.games[msg.gameId];
    game.passTurn(user.id);
    this.sendGameStateToUsers(game.gameId);
  }

  private startNewRound(msg: Serialized<StartNewRoundPayload>, user: CardlyUser): void {
    const game = this.games[msg.gameId];
    game.startNewRound();
    this.sendGameStateToUsers(game.gameId);
  }

  private swapCards(msg: Serialized<SwapCardsPayload>, user: CardlyUser): void {
    const game = this.games[msg.data.gameId];
    game.swapCards({ userId: user.id, cards: msg.data.cards });
    this.sendGameStateToUsers(game.gameId);
  }

  private sendGameStateToUsers(gameId: string): void {
    const game = this.games[gameId];
    const users = game.getUsers();
    for (const user of users) {
      const res = new GameUpdate(this.getGameStateForUser(game, user.id)).toSerializedObject();
      this.commService.sendToUser(user.id, res);
    }
  }

  private subscribeToGameEvents(game: ScumGame): void {
    game.on('trickWinner', (event: ScumTrickWinner) => this.emitTrickWinner(event, game));
  }

  private unsubscribeFromGameEvents(game: ScumGame): void {
    game.off('trickWinner', (event) => this.emitTrickWinner(event, game));
  }

  private emitTrickWinner(event: ScumTrickWinner, game: ScumGame): void {
    const res = new ScumTrickWon(event).toSerializedObject();
    this.commService.broadcastToGame(game.gameId, res);
  }

  private deleteGame(gameId: string): void {
    const game = this.games[gameId];
    if (game) {
      this.unsubscribeFromGameEvents(game);
      delete this.games[gameId];
      console.log(`Game ${gameId} delete and unsubscribed from events`);
    } else {
      console.error(`Game ${gameId} not found`);
    }
  }

  private getGameStateForUser(game: ScumGame, userId: string): ScumGameUI {
    return {
      gameId: game.gameId,
      gameOwnerUserId: game.gameOwnerUserId,
      hand: game.hands[userId]?.cards || [],
      discardPile: game.trick?.discardPile || [],
      requiredDiscardSize: game.trick?.requiredDiscardSize || undefined,
      phase: game.phase,
      currentUserTurnId: game.trick?.currentUserTurnId || '',
      presidentTraded: game.presidentTraded,
      vicePresidentTraded: game.vicePresidentTraded,
      players: game.users.reduce((acc: any, user) => {
        acc[user.id] = {
          ...user,
          numOfCards: game.hands[user.id]?.cards.length || 0,
          passed: game.trick?.players[user.id]?.passed || false,
          finishOrder: game.hands[user.id]?.finishOrder || 0,
          turnOrder: game.hands[user.id]?.turnOrder || 0,
        };
        return acc;
      }, {}),
    };
  }
}
