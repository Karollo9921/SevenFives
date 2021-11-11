//import url
import { returnOrigin } from './utilities/url.js';

// let's import modules
import { Player } from './SinglePlayerGameComponents/Player.js';
import { BidTable } from './SinglePlayerGameComponents/BidTable.js';
import { Backlog } from './SinglePlayerGameComponents/Backlog.js';
import { Statement } from './SinglePlayerGameComponents/Statement.js';
import { Game } from './SinglePlayerGameComponents/Game.js'


// let's get player nickname:
const fetchData = (url) => {
    return axios.get(url, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    ).then(response => response.data.user.login.toUpperCase());
};


// let's initialize the game
const initializeTheGame = async () => {
    const login = await fetchData(returnOrigin(true) + '/api/play/single-player');
    const game = new Game({
        btnRollTheDice: document.getElementById('roll'),
        btnCallHimLiar: document.getElementById('call'),
        btnOK: document.getElementById('ok'),
        players: [
          new Player(login, false), 
          new Player('DAVY JONES', true), 
          new Player('BILL TURNER', true), 
          new Player('WILLIAM', true)
        ],
        Statement: new Statement(document.getElementsByClassName('statement')[0]),
        Backlog: new Backlog(document.getElementsByClassName('backlog')[0]),
        BidTable: new BidTable(document.getElementsByClassName('grid-table')[0])
    });

    game.startGame();
  }


initializeTheGame();