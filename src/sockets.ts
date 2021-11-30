import Game from './models/game';
import { GameStatus } from './utilities/gameStatus';
import * as socketio from 'socket.io';

const socketsToLobby = (io: socketio.Server) => {
  var usersInLobby: { user: string, sid: string }[] = [];
  io.of('/api/play/multi-player-lobby').on('connection', async (socket: socketio.Socket) => {

    socket.on('dataToServer', (dataFromClient: object) => {

        let userToAdd = { user: Object.values(dataFromClient)[0], sid: socket.id }
        if (!usersInLobby.find(user => user === userToAdd)) {
            usersInLobby.push(userToAdd)
        }

        io.of('/api/play/multi-player-lobby').emit('updateUsersList', usersInLobby);
    });

    socket.on('send-chat-message', (data: object) => {
        io.of('/api/play/multi-player-lobby').emit('display-chat-message', data)
    });

    socket.on('create-a-game', (data) => {
        socketsToGame(io);
        io.of('/api/play/multi-player-lobby').emit('display-created-game', data);
    });

    socket.on('get-num-of-players-in-game', (gamesId) => {
        var dataToClient = gamesId.map((gameId: string) => {
            return { [gameId]: io.of('/api/play/multi-player-lobby/' + gameId).sockets.size }
        });
        io.of('/api/play/multi-player-lobby').emit('refresh-num-of-players-data', dataToClient);
    })

    socket.on('disconnect', () => {
        usersInLobby = usersInLobby.filter((user) => user.sid !== socket.id)
        io.of('/api/play/multi-player-lobby').emit('updateUsersList', usersInLobby);

        setTimeout(async () => {
            try {
                var gamesId = await Game.find({ status: GameStatus.Waiting }, {_id: 1});
                var dataToClient = gamesId.map((gameId) => {
                    return { [gameId._id]: io.of('/api/play/multi-player-lobby/' + gameId._id).sockets.size }
                });
                io.of('/api/play/multi-player-lobby').emit('refresh-num-of-players-data', dataToClient);
            } catch (error) {
                console.log(`Error: ${error}`)
            }
        }, 3000)
    });
  });
};

const socketsToGame = async (io: socketio.Server) => {
  try {
      var namespaces = await Game.find({ status: GameStatus.Waiting }, {_id: 1});    
      namespaces.forEach(async (ns) => {
          
          let usersInTheGame: { namespace: string, user: string, sid: string, position: number, gameStatus: GameStatus, allPlayers: any[] }[] = [];
          try {
              var game = await Game.findById(ns._id).exec();
              var numOfPlayers = await Game.find({ _id: ns._id }, {_id: 0, numOfPlayers: 1});
          } catch (error) {
              console.log(`Error: ${error}`)
          }

          io.of('/api/play/multi-player-lobby/' + ns._id).on('connection', async (nsSocket) => {
              if (io.of('/api/play/multi-player-lobby/' + ns._id).sockets.size > numOfPlayers[0].numOfPlayers) {
                  io.of('/api/play/multi-player-lobby/' + ns._id).in(nsSocket.id).emit('full', 'Sorry, table is full');
              }

              io.of('/api/play/multi-player-lobby/' + ns._id).emit('hello', 'Hello');

              nsSocket.on('data-to-server', (dataFromClient: object) => {
                  var position = 0;
                  usersInTheGame.forEach((user) => {
                      if (user.position === position) {
                          position += 1;
                      }
                  });

                  let userToAdd = { 
                      namespace: ns._id, 
                      user: Object.values(dataFromClient)[0], 
                      sid: nsSocket.id, 
                      position: position, 
                      gameStatus: game!.status,
                      allPlayers: game!.players
                    }
                  if (!usersInTheGame.find(user => user.user == userToAdd.user)) {
                      usersInTheGame.push(userToAdd)
                      io.of('/api/play/multi-player-lobby/' + ns._id).emit('updateUsersList', usersInTheGame);
                  }

              });

              nsSocket.on('send-chat-message', (data: object) => {
                  io.of('/api/play/multi-player-lobby/' + ns._id).emit('display-chat-message', data)
              });

              nsSocket.on('clicked-start', (user) => {
                  io.of('/api/play/multi-player-lobby/' + ns._id).emit('is-ready', user);
              });

              nsSocket.on('clicked-cast-dices', async (data) => {

                  try {
                    game!.allDices = game!.allDices.concat(data.dices);
                    await game!.save();

                    let playerIndex = game!.players.findIndex((player => player.login === data.user));
                    game!.players[playerIndex] = { 
                        login: game!.players[playerIndex].login, 
                        numOfDices: game!.players[playerIndex].numOfDices,
                        position: game!.players[playerIndex].position,
                        dices: data.dices
                    };
                    await Game.updateOne({ _id: ns._id }, { players: game!.players });

                  } catch (error) {
                      console.log(`Error: ${error}`)
                  }

                  io.of('/api/play/multi-player-lobby/' + ns._id).emit('the-die-is-cast', data.user);
              });

              nsSocket.on('game-started-players', async (players: { login: string, numOfDices: number, position: number, dices: string[] }[]) => {
                  try {
                      if (game!.players.length === 0) {
                          players.forEach((player: { login: string, numOfDices: number, position: number, dices: string[] }) => {
                              let position = usersInTheGame.filter((user) => user.user === player.login)[0].position;
                              player.position = position;
                              game!.players.push(player);
                          });
                          game!.playerTurn = game!.players[Math.ceil(Math.random() * game!.players.length) - 1].login;
                          game!.status = GameStatus.Started;
                          usersInTheGame = usersInTheGame.map((user) => { 
                              user.gameStatus = GameStatus.Started
                              user.allPlayers = game!.players
                              return user
                           })
                          await game!.save();
                      }
                  } catch (error) {
                      console.log(`Error: ${error}`)
                  }
              })

              nsSocket.on('start-the-round', (data) => {
                  if (game!.players.filter((player) => player.numOfDices > 5).map((player) => { return player.login }).includes(game!.playerTurn)) {
                      let playerIndex = usersInTheGame.findIndex((player => player.user === data.playerTurn));

                      let i = 1;
                      while (
                          game!.players
                              .filter((player) => player.numOfDices > 5)
                              .map((player) => { return player.login })
                              .includes(usersInTheGame[(playerIndex + i) % game!.numOfPlayers].user) && i < 10
                          ) {

                          i += 1;
                      };

                      game!.playerTurn = usersInTheGame[(playerIndex + i) % game!.numOfPlayers].user;
                  }

                  io.of('/api/play/multi-player-lobby/' + ns._id).emit('start-the-new-round', { 
                      players: game!.players,
                      playerTurn: game!.playerTurn,
                      round: game!.round,
                      turn: game!.turn,
                      playerPreviousTurn: game!.playerPreviousTurn,
                      numOfAllDices: game!.numOfAllDices,
                      currentBid: game!.currentBid
                  });
              });

              nsSocket.on('next-turn', async (data) => {
                  try {
                          
                    game!.playerTurn = data.playerTurn;
                    game!.playerPreviousTurn = data.playerPreviousTurn;
                    game!.currentBid = data.currentBid;
                    game!.turn += 1;
                    game!.fullBacklog.push(data.fullBacklog);

                    await game!.save();
                    
                    io.of('/api/play/multi-player-lobby/' + ns._id).emit('continue-the-round', {  
                        players: game!.players,
                        playerTurn: game!.playerTurn,
                        round: game!.round,
                        turn: game!.turn,
                        playerPreviousTurn: game!.playerPreviousTurn,
                        numOfAllDices: game!.numOfAllDices,
                        currentBid: game!.currentBid,
                        backlogMessage: data.backlogMessage,
                        allDices: game!.allDices,
                        lastMove: data.lastMove
                    });

                  } catch (error) {
                      console.log(`Error: ${error}`)
                  }
              });

              nsSocket.on('end-of-the-round', async (data) => {
                  try {
                    let playerIndex = game!.players.findIndex((player => player.login === data.playerTurn));
                    game!.players[playerIndex] = { 
                      login: game!.players[playerIndex].login, 
                      numOfDices: game!.players[playerIndex].numOfDices + 1,
                      position: game!.players[playerIndex].position,
                      dices: Array.from({ length: game!.players[playerIndex].numOfDices + 1 > 5 ? 5 : game!.players[playerIndex].numOfDices + 1 }, (v, i) => '?')
                    };

                    game!.players.forEach((player) => {
                      player.dices = player.dices.map((dice) => { return '?' })
                    });

                    await Game.updateOne({ _id: ns._id }, { players: game!.players });

                    if (game!.players[playerIndex].numOfDices > 5) {
                      game!.result.push({ 
                        place: game!.numOfPlayers - game!.result.length,
                        player: game!.players[playerIndex].login
                      });
                      game!.numOfAllDices -= 5;
                    } else {
                      game!.numOfAllDices += 1;
                    }

                    game!.playerTurn = data.playerTurn;
                    game!.playerPreviousTurn = data.playerPreviousTurn;
                    game!.currentBid = data.currentBid;
                    game!.round += 1;
                    game!.turn = 1;
                    game!.fullBacklog.push(data.fullBacklog);
                    game!.allDices = [];

                    await game!.save();

                    io.of('/api/play/multi-player-lobby/' + ns._id).emit('summary', { 
                      result: game!.result,
                      players: game!.players,
                      numOfPlayers: game!.numOfPlayers,
                      numOfAllDices: game!.numOfAllDices,
                      playerTurn: data.playerTurn,
                      backlogMessages: data.backlogMessages,
                    });


                  } catch (error) {
                      console.log(`Error: ${error}`)
                  }
              });

              nsSocket.on('game-end', async (winner) => {
                  try {
                      game!.result.push({ place: 1, player: winner });
                      game!.status = GameStatus.Finished;
                      await game!.save();
                  } catch (error) {
                      console.log(`Error: ${error}`)
                  };
              });

              nsSocket.on('disconnect', async () => {
                  usersInTheGame = usersInTheGame.filter((user) => user.sid !== nsSocket.id);
                  let disconnectedUser = usersInTheGame.filter((user) => user.sid === nsSocket.id)[0].user;
                  
                  if (game!.status === 'waiting' && disconnectedUser === game!.creator ) {
                    game!.status = GameStatus.Aborted;
                    await game!.save();
                    io.of('/api/play/multi-player-lobby/' + ns._id).emit('creator-disconnected-game-aborted', disconnectedUser);
                  } else {
                    io.of('/api/play/multi-player-lobby/' + ns._id).emit('updateUsersList', usersInTheGame);
                  }
              });
          })
      })
  } catch (error) {
      console.log(`Error: ${error}`)
  }
};

export { socketsToGame, socketsToLobby };