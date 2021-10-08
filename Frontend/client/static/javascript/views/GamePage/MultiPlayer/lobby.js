import AbstractView from "../../AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Let's Play !");
    }

    async getHtml() {
        return `
        <div class="grid-lobby">
            <div class="chat">
                <p><span class="nickname">Karollo</span><span class="message">: Hello !</span></p>
            </div>
            <div class="players-header"><h3>Active Players:</h3></div>
            <div class="logged-in-players">
                <ul id="ul-players">
                </ul>
            </div>
            <div class="create-game">
                <form id="create" action="http://localhost:3000/play/:id" method="post">
                    <button id="create-btn" type="submit">Create a Game</button>
                    <label for="numOfPlayers">Number of Players:</label>
                    <select name="numOfPlayers" id="numOfPlayers">
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                </form>
            </div>
            <div class="input-message">
                <input type="text" id="chat-message" name="chat-message" required>
                <input id="post-btn" type="submit" value="Send Message">
            </div>
            <div class="list-of-games">
                <ul>
                    <li><p>Game Crated by Karollo For 5 Players </p><p claas="slots">1/5</p><a href="/play/:id" class="join-btn">JOIN</a></li>
                </ul>
            </div>
        </div>
        `
    }

    async addScript() {
        return `
        import { lobbySocket } from '/static/javascript/sockets/lobbySocket.js';
        import { dataFromServer } from '/static/javascript/utilities/getData.js';
        import { logout } from '/static/javascript/utilities/logout.js';

        lobbySocket();
        dataFromServer(window.location.pathname);
        document.getElementById('logout-btn').addEventListener('click', logout);
        `
    }
}