import { returnOrigin } from '../utilities/url.js';

// let's import modules
import { PlayerPanel } from '../GameComponents/PlayerPanel.js';
import { MainPlayerPanel } from '../GameComponents/MainPlayerPanel.js';
import { BidTable } from '../GameComponents/BidTable.js';
import { Backlog } from '../GameComponents/Backlog.js';
import { Statement } from '../GameComponents/Statement.js';
import { Buttons } from '../GameComponents/Buttons.js';
import { convertBidToArray, SINGULAR, PLURAL } from '../GameComponents/dictonary.js'
import { bidHierarchy, arraysIdentical, indexOf } from '../GameComponents/bidHierarchy.js'


const displayMessageOnChat = (userMessage, message) => {
  let paragraphMessage = document.createElement("p");
  paragraphMessage.innerHTML = `${userMessage}: ${message}`;
  chatDiv.appendChild(paragraphMessage);
}

const fetchData = (url) => {
  return axios.get(url, {
    headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }
  ).then(response => response.data);
};
  
const fetchedData = await fetchData(
  returnOrigin(true) + 
  '/api/play/multi-player-lobby/' + 
  window.location.href.substring((window.location.origin + '/play/multi-player-lobby/').length, window.location.href.length)
);

console.log(fetchedData)
    

const stakingTable = new BidTable(document.getElementsByClassName('grid-table')[0]);
const backlog = new Backlog(document.getElementsByClassName('backlog-multi')[0]);
const statement = new Statement(document.getElementsByClassName('statement')[0]);
const buttons = new Buttons(document.getElementsByClassName('decide')[0]);
const mainPlayer = new MainPlayerPanel(document.getElementsByClassName('main-player')[0]);

const chatDiv = document.getElementsByClassName('chat-in-game')[0];
const sendMessageBtn = document.getElementById('chat-message-btn-multi');

mainPlayer.setNickname(fetchedData.user.login);

// let's initialize Game Panel
if (fetchedData.game.status === 'waiting') {
  stakingTable.hideTable();
}

if (fetchedData.game.status === 'started') {
  let you = fetchedData.game.players.filter((player) => player.login === fetchedData.user.login)[0];

  // main player dices 
  mainPlayer.dices = you.dices;
  mainPlayer.setNumOfDices(you.dices.length);
  mainPlayer.displayDices();
  
  // staking table
  fetchedData.game.playerTurn === fetchedData.user.login && you.dices[0] !== '?' ? stakingTable.showTable() : stakingTable.hideTable();

  // display proper statement
  if (fetchedData.game.turn === 1 && fetchedData.game.playerTurn === fetchedData.user.login) { statement.setNewStatement(`What Is Your Bid ${fetchedData.user.login} ?`) };
  if (fetchedData.game.turn > 1 && fetchedData.game.playerTurn === fetchedData.user.login) { statement.setNewStatement(`Call ${fetchedData.game.playerPreviousTurn} a Liar or Up The Bid !`) };
  if (you.dices[0] === '?') {statement.setNewStatement('CAST THE DICES !')};
  if (you.numOfDices > 5) { statement.setNewStatement('YOU LOST, YOU CAN ONLY WATCH') };
  if (fetchedData.game.playerTurn !== fetchedData.user.login) { statement.setNewStatement(`Now This Is ${fetchedData.game.playerTurn}'s Turn !`) };

  // display proper button
  if ((fetchedData.game.playerTurn !== fetchedData.user.login) || (fetchedData.game.turn === 1 && fetchedData.game.playerTurn === fetchedData.user.login)) { buttons.hideAll() };
  if (fetchedData.game.turn > 1 && fetchedData.game.playerTurn === fetchedData.user.login) { buttons.setVisible('call') };
  if (you.dices[0] === '?') { buttons.setVisible('roll') };

  //display fullbacklog of current round
  let backlogsToDisplay = fetchedData.game.fullBacklog.filter((log) => log.round === fetchedData.game.round);
  backlog.setNewLog(
    "This is " + "<span class='sp-round'>" + "Round " + fetchedData.game.round + "</span>" + ", we have " + "<span class='sp-dices'>" + 
    fetchedData.game.numOfAllDices + " dices"  + "</span>" + " in this Round !"
  );

  backlogsToDisplay.forEach((log) => {
    if (log.calledALiar) {
      backlog.setNewLog(
        "<span class='sp-player'>" + log.playerTurn + "</span> calls " + 
        "<span class='sp-player'>" + log.playerPreviousTurn + "</span> a Liar !"
      );
      if (log.wasALiar) {
        backlog.setNewLog("All Dices: " + "<span class='sp-dices'>" + fetchedData.game.allDices.sort() + "</span>");
        backlog.setNewLog(
          "<span class='sp-player'>" + log.playerPreviousTurn + "</span>" + " is a Liar, " + 
          "<span class='sp-player'>" + log.playerPreviousTurn + "</span>" + " gets extra Dice !"
        );
      } else {
        backlog.setNewLog("All Dices: " + "<span class='sp-dices'>" + fetchedData.game.allDices.sort() + "</span>");
        backlog.setNewLog(
          "<span class='sp-player'>" + log.playerPreviousTurn + "</span>" + " is not a Liar, " + 
          "<span class='sp-player'>" + log.playerTurn + "</span>" + " gets extra Dice !"
        );
      }
    } else {
      backlog.setNewLog(
        "<span class='sp-player'>" + log.playerTurn + "</span>" + ": " + 
        "<span class='singular'>" + log.action.split(' ')[0] + "</span>" + ' ' + "<span class='plural'>" + log.action.split(' ')[1] + "</span>" + " !"
      );
    };
  });
};

document.getElementById('nickname').textContent = `${fetchedData.user.login.toUpperCase()}: ${fetchedData.user.rating}`;

const gameSocket = () => {
  const socket = io(
    returnOrigin(true) + 
    '/api/play/multi-player-lobby/' +  
    window.location.href.substring((window.location.origin + '/play/multi-player-lobby/').length, window.location.href.length)
  );

  socket.on('connect', () => {
    console.log(`User Connected: ${socket.id}`);
    console.log(socket.io)
  });
  
  socket.on('disconnect', () => {
    console.log(socket.io);
  });
  
  sendMessageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    var message = document.getElementById('chat-message-multi').value;
    socket.emit('send-chat-message', { user: fetchedData.user.login, message: message });
    socket.emit('data-to-server', { user: fetchedData.user.login });
    document.getElementById('chat-message-multi').value = '';
  });

  socket.on('display-chat-message', (data) => {
    displayMessageOnChat(data.user, data.message, fetchedData.user.login);
    let lastElement = chatDiv.lastChild;
    lastElement.scrollIntoView();
  });

  socket.on('hello', (hello) => {
    socket.emit('data-to-server', { user: fetchedData.user.login, rating: fetchedData.user.rating });

    if (fetchedData.game.status === 'started' && fetchedData.game.playerTurn === fetchedData.user.login) {
      putBid(socket, fetchedData, fetchedData.game, players);
      callALiar(socket, fetchedData.game);
    };
  });

  socket.on('full', (reason) => {
    window.location.href = returnOrigin(false) + '/play/table-is-full'
  })

  const players = [];
  const playersToBackend = [];
  var alreadyStarted = fetchedData.game.status === 'waiting' ? false : true;

  socket.on('updateUsersList', (dataToUpdate) => {

    let gameStatus = dataToUpdate[0].gameStatus;
    let allPlayers = dataToUpdate[0].allPlayers;

    console.log(`Game status: ${gameStatus}`)
    console.log(`Number of players: ${allPlayers.length}`)
    console.log(`Number of connected players: ${dataToUpdate.length}`)

    if (gameStatus === 'waiting') {
      let yourPosition = dataToUpdate.find((data) => data.user === fetchedData.user.login)?.position;
      for (let i = 1; i < fetchedData.game.numOfPlayers; i++) {
        let playerToDisplay = dataToUpdate.find((data) => data.position === (yourPosition + i) % fetchedData.game.numOfPlayers)?.user;
        let ratingToDisplay = dataToUpdate.find((data) => data.position === (yourPosition + i) % fetchedData.game.numOfPlayers)?.rating;
        let nickname = playerToDisplay || 'WAITING FOR PLAYER';
        let rating = ratingToDisplay || '';
        players[i - 1] = new PlayerPanel(document.getElementsByClassName(`player${i}-multi`)[0]);
        players[i - 1].setNickname(`${nickname}: ${rating}`);
        players[i - 1].login = nickname;
        players[i - 1].rating = rating;
      };
    }

    if (gameStatus === 'started' && allPlayers.length === dataToUpdate.length) {
      let yourIndex = allPlayers.findIndex((player => player.login === fetchedData.user.login));
      let yourPosition = allPlayers[yourIndex].position;
      for (let i = 1; i < fetchedData.game.numOfPlayers; i++) {
        let playerToDisplay = allPlayers.find((player) => player.position === (yourPosition + i) % fetchedData.game.numOfPlayers)
        players[i - 1] = new PlayerPanel(document.getElementsByClassName(`player${i}-multi`)[0]);
        players[i - 1].setNickname(`${playerToDisplay?.login}: ${playerToDisplay?.rating}`);
        players[i - 1].login = playerToDisplay?.login;
        players[i - 1].rating = playerToDisplay?.rating;
        let playerIndex = allPlayers.findIndex((player => player.login === playerToDisplay?.login));
        let numOfDices = allPlayers[playerIndex].numOfDices || 1;
        players[i - 1].setNumOfDices(numOfDices)
        playerToDisplay.dices[0] === '?' ? players[i - 1].setStatus('The dices have not been casted yet !', 'Black') : players[i - 1].setStatus('', 'Black');
        players[i - 1].setLastMove('');
      };
    };

    // if (gameStatus === 'started' && allPlayers.length > dataToUpdate.length) {
    //   let connectedPlayers = dataToUpdate.map((data) => { return data.user });
    //   let disconnectedPlayers = allPlayers.filter((player) => !connectedPlayers.includes(player.login)).map((pl) => { return pl.login });
    //   let disconnectedPlayersPanels = players.filter((pl) => disconnectedPlayers.includes(pl.login))
    //   console.log('Connected players: ' + connectedPlayers);
    //   console.log('Disconnected players: ' + disconnectedPlayers);
    //   disconnectedPlayersPanels.forEach((pl) => {
    //     let time = 60; 
    //     pl.setTimer(`${'1'}:${'00'}`);
    //     while (time >= 0) {
    //       (function(time) {
    //         setTimeout(function() {
    //           let minutes = Math.floor((time) / 60);
    //           let seconds = (time % (60)).toString().length === 1 ? '0' + (time % (60)).toString() : (time % (60)).toString()
    //           pl.setTimer(`${minutes}:${seconds}`);
    //         }, 1000 * (60 - time))
    //       })(time--)
    //       console.log(pl.returnLoginTextContent())
    //       if (pl.login === pl.returnLoginTextContent()) {
    //         break;
    //       };
    //     };
    //     pl.setNickname(`${pl.login}: ${pl.rating}`)
    //   });
    // };

    if (fetchedData.game.numOfPlayers === dataToUpdate.length && !alreadyStarted) {
      buttons.setVisible('start');
      players.forEach((player) => {
        player.setStatus('NOT READY ;(', 'Black');
      })
    };
  });

  document.getElementById('start').addEventListener('click', (e) => {
    e.preventDefault();
    buttons.hideAll();
    socket.emit('clicked-start', { login: fetchedData.user.login, rating: fetchedData.user.rating });
  });

  socket.on('is-ready', (user) => {
    players.forEach((player) => {
      player.login === user.login ? player.setStatus('READY ;)', 'White') : console.log();
    });

    if (playersToBackend.filter((player) => player.login === user.login).length === 0) {
      playersToBackend.push({ login: user.login, numOfDices: 1, position: 0, rating: user.rating, dices: ['?'] });
    }

    if (buttons.isStartButtonNone() && players.filter((player) => player.returnPlayerStatus() === "NOT READY ;(").length === 0) {

      alreadyStarted = true;
      players.forEach((player) => {
        if (player.numOfDices < 6) {
          player.setStatus('The dices have not been casted yet !', 'Black')
        };
      });

      console.log(`mainPlayer.numOfDices: ${mainPlayer.numOfDices}`)

      if (mainPlayer.numOfDices < 6) {
        buttons.setVisible('roll');
        statement.setNewStatement('CAST THE DICES !');
        mainPlayer.setDiceDefault();
      } else {
        statement.setNewStatement('YOU LOST, YOU CAN ONLY WATCH');
      }

      socket.emit('game-started-players', playersToBackend)
    };
  });

  document.getElementById('roll').addEventListener('click', (e) => {
    e.preventDefault();
    buttons.hideAll();
    mainPlayer.castTheDices();
    socket.emit('clicked-cast-dices', { user: fetchedData.user.login, dices: mainPlayer.dices });
  });

  socket.on('the-die-is-cast', (user) => {
    players.forEach((player) => {
      player.returnPlayerLogin() === user ? player.setStatus('THE DIE IS CAST', 'White') : console.log();
    });

    if ((mainPlayer.isDiceCasted() || mainPlayer.numOfDices > 5 ) && players.filter((player) => player.returnPlayerStatus() === "The dices have not been casted yet !").length === 0) {

      players.forEach((player) => {
        player.setStatus('', 'Black')
      });

      buttons.hideAll();
      socket.emit('start-the-round', 'start-the-round');
    };
  });

  socket.on('start-the-new-round', (gameData) => {
    console.log(`Round ${gameData.round}: Am I here?`);
    backlog.clearBacklog();
    mainPlayer.diceCasted = false;

    if (gameData.turn === 1) {
      if (stakingTable.returnNumOfColumns() > gameData.numOfAllDices) { 
        stakingTable.dropColumns(stakingTable.returnNumOfColumns() - gameData.numOfAllDices);
      };

      players.forEach((player) => {
        player.setLastMove('');
      });
      backlog.setNewLog(
        "This is " + "<span class='sp-round'>" + "Round " + gameData.round + "</span>" + ", we have " + "<span class='sp-dices'>" + 
        gameData.numOfAllDices + " dices"  + "</span>" + " in this Round !"
      );
    } else {
      backlog.setNewLog(gameData.backlogMessage);
    }

    if (fetchedData.user.login === gameData.playerTurn && gameData.players.filter((pl) => pl.dices[0] === '?').length === 0) {
      stakingTable.showTable();
      if (gameData.turn === 1) {
        statement.setNewStatement(`What Is Your Bid ${gameData.playerTurn} ?`);
      } else {
        statement.setNewStatement(`Call ${gameData.playerPreviousTurn} a Liar or Up The Bid !`);
      }

      console.log('Am I here?')
      putBid(socket, fetchedData, gameData, players);

    } else {
      if (gameData.players.filter((pl) => pl.dices[0] === '?').length === 0) {
        statement.setNewStatement(`Now This Is ${gameData.playerTurn}'s Turn !`);
      } else {
        if (gameData.players.filter((pl) => pl.login === fetchedData.user.login && pl.dices[0] === '?').length > 0) {
          statement.setNewStatement(`Cast The Dice !`);
        } else {
          statement.setNewStatement(`We Wait Until All Players Cast The Dice !`);
        }
      }
    }
  })

  socket.on('continue-the-round', (gameData) => {

    if (gameData.turn === 1) {
      backlog.setNewLog(
        "This is " + "<span class='sp-round'>" + "Round " + gameData.round + "</span>" + ", we have " + "<span class='sp-dices'>" + 
        gameData.numOfAllDices + " dices"  + "</span>" + " in this Round !"
      );
    } else {
      backlog.setNewLog(gameData.backlogMessage);
      let player = players.find((player) => player.login === gameData.playerPreviousTurn);
      if (player) { player.setLastMove(gameData.lastMove) };
    };

    if (fetchedData.user.login === gameData.playerTurn && gameData.players.filter((pl) => pl.dices[0] === '?').length === 0) {
      stakingTable.showTable();
      if (gameData.turn === 1) {
        statement.setNewStatement(`What Is Your Bid ${gameData.playerTurn} ?`);
      } else {
        statement.setNewStatement(`Call ${gameData.playerPreviousTurn} a Liar or Up The Bid !`);
        buttons.setVisible('call');
      }

      console.log('Am I here?')
      putBid(socket, fetchedData, gameData, players);
      callALiar(socket, gameData);

    } else {
      if (gameData.players.filter((pl) => pl.dices[0] === '?').length === 0) {
        statement.setNewStatement(`Now This Is ${gameData.playerTurn}'s Turn !`);
      } else {
        if (gameData.players.filter((pl) => pl.login === fetchedData.user.login && pl.dices[0] === '?').length > 0) {
          statement.setNewStatement(`Cast The Dice !`);
        } else {
          statement.setNewStatement(`We Wait Until All Players Cast The Dice !`);
        }
      }
    }
  });

  socket.on('summary', (data) => {
    console.log(data.players)
    data.backlogMessages.forEach((backlogMessage) => {
      backlog.setNewLog(backlogMessage);
    });

    if (fetchedData.user.login === data.playerTurn) {
      if (mainPlayer.numOfDices < 5) {
        mainPlayer.addDice()
      } else {
        mainPlayer.setDiceDefault()
        mainPlayer.numOfDices += 1;
      }
    } else {
      players.forEach((player) => {
        let playerFromBackend = data.players.filter((dataGamePlayer) => player.login === dataGamePlayer.login);
        player.setNumOfDices(playerFromBackend[0].numOfDices);
      });
    };

    if (data.players.filter((player) => player.numOfDices > 5).length === data.numOfPlayers - 1) {
      backlog.setNewLog(`Game Is Over`);
      backlog.setNewLog(`Results:`);
      let winner = data.players.filter((player) => player.numOfDices < 6)[0].login;
      backlog.setNewLog(`1: ${winner}`);
      data.result.reverse().forEach((player) => {
        backlog.setNewLog(`${player.place}: ${player.player}`);
      });
      statement.setNewStatement(`Game Is Over - The Winner Is: ${winner}`)
      buttons.setVisible('back-to-lobby');
      socket.emit('game-end', winner);
    } else {
      stakingTable.addColumn(data.numOfAllDices);
      socket.emit('clicked-start', fetchedData.user.login);
    }
  })

  socket.on('creator-disconnected-game-aborted', (data) => {
    statement.setNewStatement(`Creator Left The Game - Go Back To Lobby`)
    buttons.setVisible('back-to-lobby');
  })


}

export { gameSocket };


function putBid(socket, fetchedData, gameData, players) {
  Array.from(document.getElementsByClassName('staking-btn')).forEach(button => {
    button.gameData = gameData;
    button.players = players;
    button.addEventListener('click', (e) => {
      e.preventDefault();

      let singularPartOfBid = e.target.parentElement.children[0].textContent;
      let pluralPartOfBid = e.target.textContent;
      let positionOfCurrentBid = indexOf(bidHierarchy, e.currentTarget.gameData.currentBid, arraysIdentical);
      let positionOfPlayerBid = indexOf(bidHierarchy, convertBidToArray(singularPartOfBid, pluralPartOfBid), arraysIdentical);

      if (positionOfCurrentBid >= positionOfPlayerBid) {
        statement.setNewStatement(`Your Bid Is Too Low ! Call ${e.currentTarget.gameData.playerPreviousTurn} a Liar or Up The Bid !`);
        e.stopImmediatePropagation();
      } else {
        let backlogMessage = 
          "<span class='sp-player'>" + fetchedData.user.login + "</span>" + ": " + 
          "<span class='singular'>" + singularPartOfBid + "</span>" + ' ' + "<span class='plural'>" + pluralPartOfBid + "</span>" + " !";
  
        let fullBacklog = {
          playerTurn: e.currentTarget.gameData.playerTurn,
          playerPreviousTurn: e.currentTarget.gameData.playerPreviousTurn,
          round: e.currentTarget.gameData.round,
          turn: e.currentTarget.gameData.turn,
          action: singularPartOfBid + ' ' + pluralPartOfBid,
          calledALiar: false,
          wasALiar: false
        };
  
        let playerPreviousTurn = e.currentTarget.gameData.playerTurn;
        let playersInGame = e.currentTarget.gameData.players.filter((player) => player.numOfDices < 6).map((player) => { return player.login });
        let i = 0;
        while (!playersInGame.includes(e.currentTarget.players[i].login) && i < 10) {
          i += 1;
        };
        let playerTurn = e.currentTarget.players[i].login;
        let currentBid = convertBidToArray(singularPartOfBid, pluralPartOfBid);
        let lastMove = singularPartOfBid + ' ' + pluralPartOfBid;
        stakingTable.hideTable();
        buttons.hideAll();
        e.stopImmediatePropagation();
  
        socket.emit('next-turn', { 
          backlogMessage: backlogMessage,
          playerPreviousTurn: playerPreviousTurn,
          playerTurn: playerTurn,
          currentBid: currentBid,
          lastMove: lastMove,
          fullBacklog: fullBacklog
        });
      };
    });
  });
}

function callALiar(socket, gameData) {
  document.getElementById('call').gameData = gameData;
  document.getElementById('call').addEventListener('click', (e) => {
    e.preventDefault();
    buttons.hideAll();

    let allDices = e.currentTarget.gameData.allDices;
    let dicesfromBidTemp = allDices.filter((el) => (el) === e.currentTarget.gameData.currentBid[0]);
    let backlogMessages = [];

    if (dicesfromBidTemp.length >= e.currentTarget.gameData.currentBid.length) {

      backlogMessages.push(
        "<span class='sp-player'>" + e.currentTarget.gameData.playerTurn + "</span> calls " + 
        "<span class='sp-player'>" + e.currentTarget.gameData.playerPreviousTurn + "</span> a Liar !"
      );

      backlogMessages.push(
        "All Dices: " + "<span class='sp-dices'>" + e.currentTarget.gameData.allDices.sort() + "</span>"
      );

      backlogMessages.push(
        "<span class='sp-player'>" + e.currentTarget.gameData.playerPreviousTurn + "</span>" + " is not a Liar, " + 
        "<span class='sp-player'>" + e.currentTarget.gameData.playerTurn + "</span>" + " gets extra Dice !"
      );

      let fullBacklog = {
        playerTurn: e.currentTarget.gameData.playerTurn,
        playerPreviousTurn: e.currentTarget.gameData.playerPreviousTurn,
        round: e.currentTarget.gameData.round,
        turn: e.currentTarget.gameData.turn,
        action: 'Call A Liar !',
        calledALiar: true,
        wasALiar: false
      };

      let playerPreviousTurn = '';
      let playerTurn = e.currentTarget.gameData.playerTurn;
      let currentBid = [];
      let lastMove = '';

      stakingTable.hideTable();
      e.stopImmediatePropagation();

      socket.emit('end-of-the-round', { 
        backlogMessages: backlogMessages,
        playerPreviousTurn: playerPreviousTurn,
        playerTurn: playerTurn,
        currentBid: currentBid,
        lastMove: lastMove,
        fullBacklog: fullBacklog
      });

    } else {

      backlogMessages.push(
        "<span class='sp-player'>" + e.currentTarget.gameData.playerTurn + "</span> calls " + 
        "<span class='sp-player'>" + e.currentTarget.gameData.playerPreviousTurn + "</span> a Liar !"
      );

      backlogMessages.push(
        "All Dices: " + "<span class='sp-dices'>" + e.currentTarget.gameData.allDices.sort() + "</span>"
      );

      backlogMessages.push(
        "<span class='sp-player'>" + e.currentTarget.gameData.playerPreviousTurn + "</span>" + " is a Liar, " + 
        "<span class='sp-player'>" + e.currentTarget.gameData.playerPreviousTurn + "</span>" + " gets extra Dice !"
      );

      let fullBacklog = {
        playerTurn: e.currentTarget.gameData.playerTurn,
        playerPreviousTurn: e.currentTarget.gameData.playerPreviousTurn,
        round: e.currentTarget.gameData.round,
        turn: e.currentTarget.gameData.turn,
        action: 'Call A Liar !',
        calledALiar: true,
        wasALiar: true
      };

      let playerPreviousTurn = '';
      let playerTurn = e.currentTarget.gameData.playerPreviousTurn;
      let currentBid = [];
      let lastMove = '';
      stakingTable.hideTable();
      e.stopImmediatePropagation();

      socket.emit('end-of-the-round', { 
        backlogMessages: backlogMessages,
        playerPreviousTurn: playerPreviousTurn,
        playerTurn: playerTurn,
        currentBid: currentBid,
        lastMove: lastMove,
        fullBacklog: fullBacklog            
      });
    }
  });
}